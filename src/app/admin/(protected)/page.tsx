import type { Metadata } from 'next';

import {
  getDbStats,
  getRecentPipelineRuns,
  getFeaturedListingsStats,
  getKitStats,
  getGitHubWorkflowRuns,
} from '@/services/admin-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin | YouthAtlas',
  robots: { index: false, follow: false },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDuration(startedAt: string, completedAt: string | null): string {
  if (!completedAt) return '—';
  const secs = Math.round(
    (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000,
  );
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

const TYPE_COLORS: Record<string, string> = {
  scholarship: 'bg-blue-500',
  fellowship: 'bg-violet-500',
  internship: 'bg-emerald-500',
  grant: 'bg-amber-500',
  conference: 'bg-orange-500',
  job: 'bg-teal-500',
  competition: 'bg-rose-500',
  training: 'bg-indigo-500',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-1.5 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-base font-semibold text-slate-700 mb-3 mt-8">{title}</h2>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Unable to load: {message}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const now = new Date();

  const [dbResult, pipelineResult, featuredResult, kitResult, githubResult] =
    await Promise.all([
      getDbStats(),
      getRecentPipelineRuns(),
      getFeaturedListingsStats(),
      getKitStats(),
      getGitHubWorkflowRuns(),
    ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
              YouthAtlas Admin
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">{formatTimestamp(now)}</p>
          </div>
          <a
            href="/api/admin/logout"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Logout
          </a>
        </div>

        {/* ── Section 1 — Database Stats ────────────────────────────────── */}
        <SectionHeader title="Database Stats" />
        {dbResult.error ? (
          <ErrorCard message={dbResult.error.message} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard
              label="Active Opps"
              value={dbResult.data.totalActive.toLocaleString()}
              color="text-blue-600"
            />
            <StatCard
              label="New Today"
              value={dbResult.data.newToday}
              color={dbResult.data.newToday > 0 ? 'text-emerald-600' : 'text-slate-400'}
            />
            <StatCard
              label="New This Week"
              value={dbResult.data.newThisWeek}
              color="text-blue-600"
            />
            <StatCard
              label="Total Users"
              value={dbResult.data.totalUsers.toLocaleString()}
              color="text-violet-600"
            />
            <StatCard
              label="Total Saves"
              value={dbResult.data.totalSaves.toLocaleString()}
              color="text-amber-600"
            />
            <StatCard
              label="Opp Types"
              value={Object.keys(dbResult.data.byType).length}
              color="text-slate-700"
            />
          </div>
        )}

        {/* ── Section 2 — Opportunities by Type ───────────────────────── */}
        <SectionHeader title="Opportunities by Type" />
        {dbResult.error ? (
          <ErrorCard message={dbResult.error.message} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
            {(() => {
              const entries = Object.entries(dbResult.data.byType).sort(
                (a, b) => b[1] - a[1],
              );
              const maxCount = entries[0]?.[1] ?? 1;
              return entries.map(([type, count]) => {
                const pct = Math.round((count / maxCount) * 100);
                const barColor = TYPE_COLORS[type] ?? 'bg-slate-400';
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm capitalize text-slate-600">
                      {type}
                    </span>
                    <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-sm font-medium text-slate-700">
                      {count}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* ── Section 3 — Pipeline Health ───────────────────────────────── */}
        <SectionHeader title="Pipeline Health (last 10 runs)" />
        {pipelineResult.error ? (
          <ErrorCard message={pipelineResult.error.message} />
        ) : pipelineResult.data.length === 0 ? (
          <p className="text-sm text-slate-500">No pipeline runs found.</p>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Source', 'Status', 'Found', 'Scraped', 'Stored', 'Duration', 'Time'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pipelineResult.data.map((run) => {
                  const statusIcon =
                    run.status === 'success'
                      ? '✅'
                      : run.status === 'partial'
                        ? '⚠️'
                        : '❌';
                  return (
                    <tr key={run.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-medium text-slate-700">
                        {run.source_site}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-1">
                          {statusIcon}{' '}
                          <span className="text-slate-600 capitalize">{run.status}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{run.found ?? '—'}</td>
                      <td className="px-3 py-2.5 text-slate-600">{run.scraped ?? '—'}</td>
                      <td className="px-3 py-2.5 text-slate-600">{run.stored ?? '—'}</td>
                      <td className="px-3 py-2.5 text-slate-500">
                        {formatDuration(run.started_at, run.completed_at)}
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">
                        {formatRelativeTime(run.started_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Section 4 — GitHub Actions ────────────────────────────────── */}
        <SectionHeader title="GitHub Actions Workflows" />
        {githubResult.error ? (
          <ErrorCard message={githubResult.error.message} />
        ) : githubResult.data.length === 0 ? (
          <p className="text-sm text-slate-500">No workflow runs found.</p>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Workflow', 'Status', 'Last Run', 'Link'].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {githubResult.data.map((run) => {
                  const statusIcon =
                    run.status === 'in_progress'
                      ? '🔄'
                      : run.conclusion === 'success'
                        ? '✅'
                        : '❌';
                  return (
                    <tr key={run.name} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-medium text-slate-700">{run.name}</td>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-1">
                          {statusIcon}{' '}
                          <span className="text-slate-600 capitalize">
                            {run.status === 'in_progress' ? 'running' : (run.conclusion ?? run.status)}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">
                        {formatRelativeTime(run.created_at)}
                      </td>
                      <td className="px-3 py-2.5">
                        <a
                          href={run.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Section 5 — Featured Listings ────────────────────────────── */}
        <SectionHeader title="Featured Listings" />
        {featuredResult.error ? (
          <ErrorCard message={featuredResult.error.message} />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Total Submissions"
                value={featuredResult.data.total}
                color="text-slate-700"
              />
              <StatCard
                label="Pending Review"
                value={featuredResult.data.pending}
                color={featuredResult.data.pending > 0 ? 'text-amber-600' : 'text-slate-400'}
              />
              <StatCard
                label="Currently Active"
                value={featuredResult.data.active}
                color="text-emerald-600"
              />
            </div>
            {featuredResult.data.pending > 0 && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-center justify-between">
                <p className="text-sm font-medium text-amber-800">
                  ⚠️ {featuredResult.data.pending} submission
                  {featuredResult.data.pending === 1 ? '' : 's'} need review
                </p>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-700 hover:text-amber-900"
                >
                  Open Supabase →
                </a>
              </div>
            )}
          </>
        )}

        {/* ── Section 6 — Newsletter ────────────────────────────────────── */}
        <SectionHeader title="Newsletter" />
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          {kitResult.error ? (
            <p className="text-sm text-slate-500">
              Unable to fetch subscriber count: {kitResult.error.message}
            </p>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-violet-600">
                {kitResult.data.totalSubscribers.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500">active subscribers</span>
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-400">
          <span>Last updated: {formatTimestamp(now)}</span>
          <a
            href="/admin"
            className="rounded px-2 py-1 hover:bg-slate-100 transition-colors font-medium text-slate-500"
          >
            ↺ Refresh
          </a>
        </div>
      </div>
    </div>
  );
}
