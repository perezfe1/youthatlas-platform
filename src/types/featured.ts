// ── Featured listing types ────────────────────────────────────────────────────

export type FeaturedListing = {
  id: string;
  orgName: string;
  contactEmail: string;
  opportunityTitle: string;
  opportunityUrl: string;
  opportunityDescription: string | null;
  message: string | null;
  isActive: boolean;
  activatedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export type FeaturedSubmission = {
  orgName: string;
  contactEmail: string;
  opportunityTitle: string;
  opportunityUrl: string;
  opportunityDescription?: string;
  message?: string;
};
