import type { FeaturedListing } from '@/types/featured';

// ── Component ─────────────────────────────────────────────────────────────────

type FeaturedCardProps = {
  listing: FeaturedListing;
};

export function FeaturedCard({ listing }: FeaturedCardProps) {
  return (
    <div className="flex min-h-[180px] flex-col rounded-lg border border-slate-200 border-l-4 border-l-amber-400 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Top: Featured badge */}
      <div className="flex items-start justify-between">
        <h3 className="line-clamp-2 flex-1 pr-3 font-display text-lg font-semibold text-[#1A1A2E]">
          <a
            href={listing.opportunityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            {listing.opportunityTitle}
          </a>
        </h3>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
          ⭐ Featured
        </span>
      </div>

      {/* Org name */}
      <p className="mt-1 text-sm text-text-secondary">{listing.orgName}</p>

      {/* Description */}
      {listing.opportunityDescription && (
        <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
          {listing.opportunityDescription}
        </p>
      )}

      {/* CTA */}
      <div className="mt-auto pt-3">
        <a
          href={listing.opportunityUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
}
