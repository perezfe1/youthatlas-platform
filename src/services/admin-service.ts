import { createClient } from '@supabase/supabase-js';

import { clientEnv, getServerEnv, getKitEnv } from '@/config/env';
import type { AppError, Result } from '@/types/opportunity';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DbStats {
  totalActive: number;
  newToday: number;
  newThisWeek: number;
  byType: Record<string, number>;
  totalSaves: number;
  totalUsers: number;
}

export interface PipelineRun {
  id: string;
  source_site: string;
  status: string;
  found: number | null;
  scraped: number | null;
  stored: number | null;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface FeaturedStats {
  total: number;
  pending: number;
  active: number;
}

export interface KitStats {
  totalSubscribers: number;
}

export interface WorkflowRun {
  name: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  html_url: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function adminError(code: string, message: string): { data: null; error: AppError } {
  return { data: null, error: { code, message } };
}

function createAdminClient() {
  const { SUPABASE_SERVICE_KEY } = getServerEnv();
  return createClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
}

// ── getDbStats ────────────────────────────────────────────────────────────────

export async function getDbStats(): Promise<Result<DbStats>> {
  try {
    const supabase = createAdminClient();
    const today = new Date().toISOString().split('T')[0]!;
    const todayStart = `${today}T00:00:00.000Z`;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      totalActiveRes,
      newTodayRes,
      newThisWeekRes,
      typeDataRes,
      totalSavesRes,
      totalUsersRes,
    ] = await Promise.all([
      supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('created_at', todayStart),
      supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('created_at', weekAgo),
      supabase.from('opportunities').select('type').eq('status', 'active'),
      supabase.from('saved_opportunities').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    ]);

    const byType: Record<string, number> = {};
    for (const row of typeDataRes.data ?? []) {
      const t = (row as { type: string }).type;
      byType[t] = (byType[t] ?? 0) + 1;
    }

    return {
      data: {
        totalActive: totalActiveRes.count ?? 0,
        newToday: newTodayRes.count ?? 0,
        newThisWeek: newThisWeekRes.count ?? 0,
        byType,
        totalSaves: totalSavesRes.count ?? 0,
        totalUsers: totalUsersRes.count ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return adminError('DB_ERROR', err instanceof Error ? err.message : String(err));
  }
}

// ── getRecentPipelineRuns ─────────────────────────────────────────────────────

export async function getRecentPipelineRuns(): Promise<Result<PipelineRun[]>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('scrape_runs')
      .select('id, source_site, status, found, scraped, stored, started_at, completed_at, error_message')
      .order('started_at', { ascending: false })
      .limit(10);

    if (error) return adminError('DB_ERROR', error.message);
    return { data: (data ?? []) as PipelineRun[], error: null };
  } catch (err) {
    return adminError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}

// ── getFeaturedListingsStats ──────────────────────────────────────────────────

export async function getFeaturedListingsStats(): Promise<Result<FeaturedStats>> {
  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    const [totalRes, pendingRes, activeRes] = await Promise.all([
      supabase.from('featured_listings').select('*', { count: 'exact', head: true }),
      supabase
        .from('featured_listings')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false),
      supabase
        .from('featured_listings')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${now}`),
    ]);

    return {
      data: {
        total: totalRes.count ?? 0,
        pending: pendingRes.count ?? 0,
        active: activeRes.count ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return adminError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}

// ── getKitStats ───────────────────────────────────────────────────────────────

export async function getKitStats(): Promise<Result<KitStats>> {
  try {
    const { KIT_API_SECRET } = getKitEnv();
    const res = await fetch('https://api.kit.com/v4/subscribers?status=active', {
      headers: {
        Authorization: `Bearer ${KIT_API_SECRET}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return adminError('KIT_API_ERROR', `Kit API returned ${res.status}`);
    }

    const json = (await res.json()) as { pagination?: { total_count?: number }; meta?: { total_count?: number } };
    // Kit v4 returns total_count under pagination or meta depending on endpoint
    const totalSubscribers =
      json.pagination?.total_count ?? json.meta?.total_count ?? 0;

    return { data: { totalSubscribers }, error: null };
  } catch (err) {
    return adminError('KIT_API_ERROR', err instanceof Error ? err.message : String(err));
  }
}

// ── getGitHubWorkflowRuns ─────────────────────────────────────────────────────

interface GitHubRun {
  name: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  html_url: string;
}

export async function getGitHubWorkflowRuns(): Promise<Result<WorkflowRun[]>> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/perezfe1/youthatlas-scrapers/actions/runs?per_page=10',
      {
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      return adminError('GITHUB_API_ERROR', `GitHub API returned ${res.status}`);
    }

    const json = (await res.json()) as { workflow_runs?: GitHubRun[] };

    // Keep only the most recent run per workflow name
    const byName = new Map<string, WorkflowRun>();
    for (const run of json.workflow_runs ?? []) {
      if (!byName.has(run.name)) {
        byName.set(run.name, {
          name: run.name,
          status: run.status,
          conclusion: run.conclusion,
          created_at: run.created_at,
          html_url: run.html_url,
        });
      }
    }

    return { data: Array.from(byName.values()), error: null };
  } catch (err) {
    return adminError('GITHUB_API_ERROR', err instanceof Error ? err.message : String(err));
  }
}
