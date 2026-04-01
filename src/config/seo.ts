import type { OpportunityType, Region } from '@/types/opportunity';

// ── Slug maps ─────────────────────────────────────────────────────────────────

/** URL slug (plural) → OpportunityType DB value */
export const TYPE_SLUG_MAP: Record<string, OpportunityType> = {
  scholarships: 'scholarship',
  fellowships:  'fellowship',
  grants:       'grant',
  internships:  'internship',
  conferences:  'conference',
  competitions: 'competition',
  training:     'training',
} as const;

/** URL slug → Region DB value */
export const REGION_SLUG_MAP: Record<string, Region> = {
  africa:         'africa',
  asia:           'asia',
  europe:         'europe',
  'latin-america':  'latin_america',
  'north-america':  'north_america',
  'middle-east':    'middle_east',
  oceania:        'oceania',
  global:         'global',
} as const;

/** URL slug → human-readable display label */
export const REGION_DISPLAY: Record<string, string> = {
  africa:         'Africa',
  asia:           'Asia',
  europe:         'Europe',
  'latin-america':  'Latin America',
  'north-america':  'North America',
  'middle-east':    'Middle East',
  oceania:        'Oceania',
  global:         'Global',
} as const;

// ── Per-type SEO data ─────────────────────────────────────────────────────────

export type TypeSeoData = {
  pluralLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introTemplate: string; // use {count} as placeholder
};

const TYPE_SEO: Record<string, TypeSeoData> = {
  scholarships: {
    pluralLabel: 'Scholarships',
    metaTitle: 'Scholarships for Students 2025–2026 — YouthAtlas',
    metaDescription:
      'Find and apply to scholarships worldwide. Updated daily with opportunities for undergraduate, graduate, and international students.',
    h1: 'Scholarships for Students',
    introTemplate:
      'Browse {count} scholarships currently accepting applications from students worldwide.',
  },
  fellowships: {
    pluralLabel: 'Fellowships',
    metaTitle: 'Fellowship Opportunities 2025–2026 — YouthAtlas',
    metaDescription:
      'Discover fellowships for researchers, professionals, and emerging leaders. Fully funded programs, leadership tracks, and academic fellowships.',
    h1: 'Fellowship Opportunities',
    introTemplate:
      'Browse {count} fellowships open to researchers, graduates, and young professionals.',
  },
  grants: {
    pluralLabel: 'Grants',
    metaTitle: 'Grants for Students and Researchers 2025–2026 — YouthAtlas',
    metaDescription:
      'Find grants for students, researchers, entrepreneurs, and NGOs. Browse funding opportunities from government agencies, foundations, and universities.',
    h1: 'Grants for Students & Researchers',
    introTemplate:
      'Browse {count} grants available to students, researchers, and organizations worldwide.',
  },
  internships: {
    pluralLabel: 'Internships',
    metaTitle: 'Internships for Students 2025–2026 — YouthAtlas',
    metaDescription:
      'Find internships at international organizations, NGOs, and top companies. Paid and unpaid internships for students and recent graduates.',
    h1: 'Internships for Students',
    introTemplate:
      'Browse {count} internships at international organizations, NGOs, and companies worldwide.',
  },
  conferences: {
    pluralLabel: 'Conferences',
    metaTitle: 'Student and Youth Conferences 2025–2026 — YouthAtlas',
    metaDescription:
      'Discover conferences for students and young professionals. Model UN, leadership summits, academic conferences, and youth forums worldwide.',
    h1: 'Conferences for Students & Youth',
    introTemplate:
      'Browse {count} conferences and summits for students and young professionals worldwide.',
  },
  competitions: {
    pluralLabel: 'Competitions',
    metaTitle: 'Student Competitions & Awards 2025–2026 — YouthAtlas',
    metaDescription:
      'Find competitions, hackathons, essay contests, and awards for students and young innovators worldwide.',
    h1: 'Competitions & Awards for Students',
    introTemplate:
      'Browse {count} competitions, hackathons, and awards open to students worldwide.',
  },
  training: {
    pluralLabel: 'Training Programs',
    metaTitle: 'Training Programs for Youth 2025–2026 — YouthAtlas',
    metaDescription:
      'Find training programs, bootcamps, and professional development courses for students and young professionals worldwide.',
    h1: 'Training Programs for Youth',
    introTemplate:
      'Browse {count} training programs and professional development opportunities worldwide.',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getTypeSeoData(typeSlug: string): TypeSeoData | null {
  return TYPE_SEO[typeSlug] ?? null;
}

export function getRegionLabel(regionSlug: string): string {
  return REGION_DISPLAY[regionSlug] ?? regionSlug;
}

export type ComboSeoData = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introTemplate: string;
};

export function getComboSeoData(
  typeSlug: string,
  regionSlug: string,
): ComboSeoData | null {
  const typeSeo = TYPE_SEO[typeSlug];
  if (!typeSeo) return null;

  const { pluralLabel } = typeSeo;

  if (regionSlug === 'fully-funded') {
    return {
      metaTitle: `Fully Funded ${pluralLabel} 2025–2026 — YouthAtlas`,
      metaDescription: `Find fully funded ${pluralLabel.toLowerCase()} that cover tuition, accommodation, travel, and living expenses. Updated daily.`,
      h1: `Fully Funded ${pluralLabel}`,
      introTemplate: `Browse {count} fully funded ${pluralLabel.toLowerCase()} that cover all major expenses.`,
    };
  }

  const regionLabel = REGION_DISPLAY[regionSlug];
  if (!regionLabel) return null;

  return {
    metaTitle: `${pluralLabel} in ${regionLabel} 2025–2026 — YouthAtlas`,
    metaDescription: `Find ${pluralLabel.toLowerCase()} open to students and professionals in ${regionLabel}. Updated daily with new opportunities.`,
    h1: `${pluralLabel} in ${regionLabel}`,
    introTemplate: `Browse {count} ${pluralLabel.toLowerCase()} available to applicants in ${regionLabel}.`,
  };
}
