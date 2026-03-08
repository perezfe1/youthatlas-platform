import { ImageResponse } from 'next/og';

import { getOpportunityBySlug } from '@/services/opportunity-service';
import type { OpportunityType } from '@/types/opportunity';

// ── Route config ────────────────────────────────────────────────────────────

export const runtime = 'edge';
export const alt = 'YouthAtlas Opportunity';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ── Type → accent colour map ────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  scholarship: '#3B82F6',
  fellowship: '#8B5CF6',
  grant: '#10B981',
  internship: '#F59E0B',
  conference: '#14B8A6',
  competition: '#F43F5E',
  training: '#6366F1',
  job: '#F97316',
};

function getAccentColor(type?: string): string {
  return TYPE_COLORS[type ?? ''] ?? '#3B82F6';
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function clampTitle(title: string): string {
  return title.length > 80 ? `${title.slice(0, 77)}...` : title;
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Rolling';
  const d = new Date(deadline);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `Deadline: ${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// ── Image generator ─────────────────────────────────────────────────────────

export default async function OgImage({
  params,
}: {
  params: { slug: string };
}) {
  const result = await getOpportunityBySlug(params.slug);

  // ── Fallback (opportunity not found) ────────────────────────────────────
  if (result.error) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFBF5',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Left accent bar */}
          <div style={{ width: 12, height: '100%', backgroundColor: '#3B82F6', flexShrink: 0 }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '48px 56px',
              flex: 1,
            }}
          >
            {/* Wordmark */}
            <div style={{ fontSize: 28, fontWeight: 600, color: '#1E40AF' }}>
              YouthAtlas
            </div>

            {/* Title + subtitle */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#1A1A2E', lineHeight: 1.2 }}>
                Discover Opportunities
              </div>
              <div style={{ fontSize: 28, color: '#6B7280', marginTop: 16 }}>
                Scholarships, fellowships, grants and more
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 22, color: '#3B82F6' }}>
              youthatlas.com
            </div>
          </div>
        </div>
      ),
      { ...size },
    );
  }

  // ── Normal OG image ─────────────────────────────────────────────────────
  const opp = result.data;
  const accent = getAccentColor(opp.type);
  const title = clampTitle(opp.title);
  const deadlineStr = formatDeadline(opp.deadline);
  const typeLabel = opp.type.charAt(0).toUpperCase() + opp.type.slice(1);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFBF5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Left accent bar */}
        <div style={{ width: 12, height: '100%', backgroundColor: accent, flexShrink: 0 }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 56px',
            flex: 1,
          }}
        >
          {/* Top: wordmark */}
          <div style={{ fontSize: 28, fontWeight: 600, color: '#1E40AF' }}>
            YouthAtlas
          </div>

          {/* Middle: title + org */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#1A1A2E',
                lineHeight: 1.2,
                maxWidth: 1000,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>
            {opp.organization && (
              <div style={{ fontSize: 28, color: '#6B7280', marginTop: 16 }}>
                {opp.organization}
              </div>
            )}
          </div>

          {/* Bottom row: type badge + deadline + domain */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {/* Type badge */}
              <div
                style={{
                  backgroundColor: accent,
                  color: '#FFFFFF',
                  fontSize: 22,
                  fontWeight: 600,
                  padding: '6px 18px',
                  borderRadius: 999,
                }}
              >
                {typeLabel}
              </div>

              {/* Deadline */}
              <div style={{ fontSize: 24, color: '#6B7280' }}>
                {deadlineStr}
              </div>
            </div>

            {/* Domain */}
            <div style={{ fontSize: 22, color: '#3B82F6' }}>
              youthatlas.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
