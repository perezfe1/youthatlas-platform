// ── Types ─────────────────────────────────────────────────────────────────────

export type ResourceCategory = {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  guideCount: number;
};

export type GuideTag = 'Essential' | 'Popular';

export type ResourceGuide = {
  slug: string;
  category: string;
  title: string;
  description: string;
  readingMinutes: number;
  publishedAt: string; // ISO date string
  tag?: GuideTag;
};

// ── Categories ────────────────────────────────────────────────────────────────

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    slug: 'interview-tips',
    emoji: '🎯',
    title: 'Interview Tips',
    description:
      'Prepare for scholarship panels, fellowship interviews, and virtual screenings.',
    guideCount: 4,
  },
  {
    slug: 'how-to-hustle',
    emoji: '🚀',
    title: 'How to Hustle',
    description:
      'Build your network, personal brand, and momentum — even from scratch.',
    guideCount: 4,
  },
  {
    slug: 'job-searching',
    emoji: '🔍',
    title: 'Job Searching',
    description: 'CVs, cover letters, ATS systems, and remote work strategies.',
    guideCount: 4,
  },
  {
    slug: 'digital-skills',
    emoji: '💻',
    title: 'Digital Skills',
    description:
      'Free certifications, portfolio building, and AI tools for productivity.',
    guideCount: 4,
  },
  {
    slug: 'application-writing',
    emoji: '✍️',
    title: 'Application Writing',
    description:
      'Essays, personal statements, research proposals, and recommendation letters.',
    guideCount: 4,
  },
  {
    slug: 'opportunity-intel',
    emoji: '🧭',
    title: 'Opportunity Intel',
    description:
      'Understand funding types, timelines, legitimacy checks, and regional calendars.',
    guideCount: 4,
  },
];

// ── Guides ────────────────────────────────────────────────────────────────────

export const RESOURCE_GUIDES: ResourceGuide[] = [
  // ── interview-tips ──
  {
    slug: 'how-to-prepare-for-scholarship-interviews',
    category: 'interview-tips',
    title: 'How to Prepare for Scholarship Interviews',
    description:
      'A step-by-step guide to researching, rehearsing, and showing up ready for any scholarship interview.',
    readingMinutes: 5,
    publishedAt: '2026-03-25',
    tag: 'Essential',
  },
  {
    slug: 'virtual-interview-setup',
    category: 'interview-tips',
    title: 'Virtual Interview Setup & Etiquette',
    description:
      'Nail your Zoom or Teams interview with the right setup, lighting, and presence.',
    readingMinutes: 4,
    publishedAt: '2026-03-25',
  },
  {
    slug: 'what-selection-panels-look-for',
    category: 'interview-tips',
    title: 'What Selection Panels Actually Look For',
    description:
      'Go beyond rehearsed answers — understand the criteria that determine who gets selected.',
    readingMinutes: 6,
    publishedAt: '2026-03-25',
    tag: 'Popular',
  },
  {
    slug: 'star-method-behavioral-questions',
    category: 'interview-tips',
    title: 'The STAR Method for Behavioral Questions',
    description:
      "A simple framework for answering 'Tell me about a time when...' questions with confidence.",
    readingMinutes: 4,
    publishedAt: '2026-03-25',
  },

  // ── how-to-hustle ──
  {
    slug: 'cold-emailing-mentors-and-organizations',
    category: 'how-to-hustle',
    title: 'Cold Emailing: Reach Mentors & Organizations',
    description:
      "How to write emails that get responses — even when no one knows your name.",
    readingMinutes: 5,
    publishedAt: '2026-03-25',
    tag: 'Popular',
  },
  {
    slug: 'linkedin-presence-zero-experience',
    category: 'how-to-hustle',
    title: 'Building a LinkedIn Presence with Zero Experience',
    description:
      "You don't need a job title to build a professional presence online.",
    readingMinutes: 6,
    publishedAt: '2026-03-25',
  },
  {
    slug: 'turning-rejections-into-opportunities',
    category: 'how-to-hustle',
    title: 'Turning Rejections into Future Opportunities',
    description:
      "Every 'no' can become a connection, a lesson, or a better application.",
    readingMinutes: 4,
    publishedAt: '2026-03-25',
  },
  {
    slug: 'side-projects-strengthen-applications',
    category: 'how-to-hustle',
    title: 'Side Projects That Strengthen Applications',
    description:
      'Show initiative with projects that prove you can create, not just consume.',
    readingMinutes: 5,
    publishedAt: '2026-03-25',
    tag: 'Essential',
  },

  // ── job-searching ──
  {
    slug: 'tailor-cv-international-opportunities',
    category: 'job-searching',
    title: 'Tailor Your CV for International Opportunities',
    description:
      "One CV doesn't fit all — here's how to adapt yours for global roles.",
    readingMinutes: 6,
    publishedAt: '2026-03-25',
    tag: 'Essential',
  },
  {
    slug: 'cover-letter-frameworks',
    category: 'job-searching',
    title: 'Cover Letter Frameworks That Work',
    description:
      'Stop writing generic cover letters. Use a framework that connects you to the role.',
    readingMinutes: 5,
    publishedAt: '2026-03-25',
    tag: 'Popular',
  },
  {
    slug: 'navigating-applicant-tracking-systems',
    category: 'job-searching',
    title: 'Navigating Applicant Tracking Systems',
    description:
      "Your application might be filtered out before a human sees it. Here's how to get through.",
    readingMinutes: 4,
    publishedAt: '2026-03-25',
  },
  {
    slug: 'remote-job-strategies-emerging-markets',
    category: 'job-searching',
    title: 'Remote Job Strategies for Emerging Markets',
    description:
      'Land remote roles from anywhere — with strategies built for non-US applicants.',
    readingMinutes: 5,
    publishedAt: '2026-03-25',
  },

  // ── digital-skills ──
  {
    slug: 'free-certifications-worth-getting',
    category: 'digital-skills',
    title: 'Free Certifications Actually Worth Getting',
    description:
      'Not all free certs are created equal. These ones employers and panels recognize.',
    readingMinutes: 5,
    publishedAt: '2026-03-25',
    tag: 'Popular',
  },
  {
    slug: 'portfolio-website-no-code',
    category: 'digital-skills',
    title: 'Build a Portfolio Website with No-Code Tools',
    description:
      "A personal site makes you memorable. Here's how to build one in an afternoon.",
    readingMinutes: 7,
    publishedAt: '2026-03-25',
    tag: 'Essential',
  },
  {
    slug: 'ai-tools-productivity',
    category: 'digital-skills',
    title: 'AI Tools That Boost Your Productivity',
    description:
      "Use AI to work faster without cutting corners — here's what actually helps.",
    readingMinutes: 5,
    publishedAt: '2026-03-25',
  },
  {
    slug: 'digital-literacy-modern-job-market',
    category: 'digital-skills',
    title: 'Digital Literacy for the Modern Job Market',
    description:
      'The baseline digital skills every young professional needs in 2026.',
    readingMinutes: 4,
    publishedAt: '2026-03-25',
  },

  // ── application-writing ──
  {
    slug: 'winning-scholarship-essay',
    category: 'application-writing',
    title: 'How to Write a Winning Scholarship Essay',
    description:
      "The essay is where you stand out. Here's a framework to write one that does.",
    readingMinutes: 7,
    publishedAt: '2026-03-25',
    tag: 'Essential',
  },
  {
    slug: 'personal-statement-frameworks',
    category: 'application-writing',
    title: 'Personal Statement Frameworks',
    description:
      'Three proven structures for writing personal statements that connect.',
    readingMinutes: 6,
    publishedAt: '2026-03-25',
    tag: 'Popular',
  },
  {
    slug: 'research-proposal-basics',
    category: 'application-writing',
    title: 'Research Proposal Basics for Fellowships',
    description:
      "Demystify the research proposal — even if you've never written one.",
    readingMinutes: 5,
    publishedAt: '2026-03-25',
  },
  {
    slug: 'common-application-mistakes',
    category: 'application-writing',
    title: 'Common Application Mistakes to Avoid',
    description:
      "Don't lose on technicalities. These mistakes are easy to make and easy to fix.",
    readingMinutes: 4,
    publishedAt: '2026-03-25',
  },

  // ── opportunity-intel ──
  {
    slug: 'fully-funded-vs-partially-funded',
    category: 'opportunity-intel',
    title: 'Fully-Funded vs. Partially-Funded: What It Means',
    description:
      "Decode funding jargon so you know exactly what you're applying for.",
    readingMinutes: 4,
    publishedAt: '2026-03-25',
    tag: 'Essential',
  },
  {
    slug: 'how-to-spot-legitimate-opportunity',
    category: 'opportunity-intel',
    title: 'How to Spot a Legitimate Opportunity',
    description:
      "Scams target ambitious young people. Here's how to tell what's real.",
    readingMinutes: 5,
    publishedAt: '2026-03-25',
    tag: 'Popular',
  },
  {
    slug: 'regional-opportunity-calendars',
    category: 'opportunity-intel',
    title: 'Regional Opportunity Calendars',
    description:
      'Know when to apply for what — organized by region and deadline season.',
    readingMinutes: 6,
    publishedAt: '2026-03-25',
  },
  {
    slug: 'making-the-most-after-you-win',
    category: 'opportunity-intel',
    title: 'Making the Most of It After You Win',
    description:
      "Getting selected is step one. Here's how to maximize the experience.",
    readingMinutes: 5,
    publishedAt: '2026-03-25',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getCategoryBySlug(slug: string): ResourceCategory | undefined {
  return RESOURCE_CATEGORIES.find((c) => c.slug === slug);
}

export function getGuidesByCategory(categorySlug: string): ResourceGuide[] {
  return RESOURCE_GUIDES.filter((g) => g.category === categorySlug);
}

export function getGuideBySlug(
  categorySlug: string,
  guideSlug: string,
): ResourceGuide | undefined {
  return RESOURCE_GUIDES.find(
    (g) => g.category === categorySlug && g.slug === guideSlug,
  );
}

export function getPrevNextGuides(
  categorySlug: string,
  currentSlug: string,
): { prev: ResourceGuide | null; next: ResourceGuide | null } {
  const guides = getGuidesByCategory(categorySlug);
  const idx = guides.findIndex((g) => g.slug === currentSlug);
  return {
    prev: idx > 0 ? (guides[idx - 1] ?? null) : null,
    next: idx < guides.length - 1 ? (guides[idx + 1] ?? null) : null,
  };
}
