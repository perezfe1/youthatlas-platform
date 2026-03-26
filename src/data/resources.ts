// ── Types ─────────────────────────────────────────────────────────────────────

export type ResourceCategory = {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  guideCount: number;
};

export type ResourceGuide = {
  slug: string;
  category: string;
  title: string;
  description: string;
  readingMinutes: number;
  publishedAt: string; // ISO date string
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
    description:
      'CVs, cover letters, ATS systems, and remote work strategies.',
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

// ── Guides (metadata only — no content yet) ───────────────────────────────────

export const RESOURCE_GUIDES: ResourceGuide[] = [
  // interview-tips
  {
    slug: 'how-to-prepare-for-a-scholarship-interview',
    category: 'interview-tips',
    title: 'How to Prepare for a Scholarship Interview',
    description:
      'A step-by-step framework for researching the panel, crafting your story, and answering tough questions with confidence.',
    readingMinutes: 6,
    publishedAt: '2026-03-01',
  },
  {
    slug: 'common-fellowship-interview-questions',
    category: 'interview-tips',
    title: 'Common Fellowship Interview Questions (and How to Answer Them)',
    description:
      'The 15 questions that come up most often in fellowship interviews — with sample responses and what evaluators actually want to hear.',
    readingMinutes: 8,
    publishedAt: '2026-03-05',
  },
  {
    slug: 'virtual-interview-setup-guide',
    category: 'interview-tips',
    title: 'The Virtual Interview Setup Guide',
    description:
      'Lighting, background, audio, and eye contact tips to make a strong impression on video calls.',
    readingMinutes: 4,
    publishedAt: '2026-03-10',
  },
  {
    slug: 'body-language-and-presence-in-interviews',
    category: 'interview-tips',
    title: 'Body Language and Presence in Interviews',
    description:
      'How posture, pacing, and tone affect how interviewers perceive your confidence and leadership potential.',
    readingMinutes: 5,
    publishedAt: '2026-03-15',
  },

  // how-to-hustle
  {
    slug: 'building-a-linkedin-profile-from-scratch',
    category: 'how-to-hustle',
    title: 'Building a LinkedIn Profile From Scratch',
    description:
      'How to create a compelling LinkedIn profile as a student or early-career professional with limited experience.',
    readingMinutes: 5,
    publishedAt: '2026-03-01',
  },
  {
    slug: 'how-to-cold-email-mentors-and-professionals',
    category: 'how-to-hustle',
    title: 'How to Cold Email Mentors and Professionals',
    description:
      'Templates and principles for reaching out to people you admire — and actually getting a response.',
    readingMinutes: 5,
    publishedAt: '2026-03-05',
  },
  {
    slug: 'personal-brand-for-students',
    category: 'how-to-hustle',
    title: 'Personal Brand for Students',
    description:
      'How to present yourself online so that opportunities start finding you instead of the other way around.',
    readingMinutes: 6,
    publishedAt: '2026-03-10',
  },
  {
    slug: 'building-momentum-with-no-connections',
    category: 'how-to-hustle',
    title: 'Building Momentum With No Connections',
    description:
      'Practical steps for getting started when you have no network, no resume, and no idea where to begin.',
    readingMinutes: 7,
    publishedAt: '2026-03-15',
  },

  // job-searching
  {
    slug: 'how-to-write-a-cv-that-gets-noticed',
    category: 'job-searching',
    title: 'How to Write a CV That Gets Noticed',
    description:
      'Format, length, keywords, and the mistakes that get CVs rejected before anyone reads them.',
    readingMinutes: 6,
    publishedAt: '2026-03-01',
  },
  {
    slug: 'cover-letter-guide-for-entry-level-roles',
    category: 'job-searching',
    title: 'Cover Letter Guide for Entry-Level Roles',
    description:
      'A practical formula for writing cover letters that are specific, confident, and actually get read.',
    readingMinutes: 5,
    publishedAt: '2026-03-05',
  },
  {
    slug: 'understanding-ats-systems',
    category: 'job-searching',
    title: 'Understanding ATS Systems',
    description:
      'What applicant tracking systems are, how they filter resumes, and how to write for both machines and humans.',
    readingMinutes: 5,
    publishedAt: '2026-03-10',
  },
  {
    slug: 'finding-remote-work-as-a-student',
    category: 'job-searching',
    title: 'Finding Remote Work as a Student',
    description:
      'The best platforms, job types, and strategies for landing remote roles while still in school.',
    readingMinutes: 6,
    publishedAt: '2026-03-15',
  },

  // digital-skills
  {
    slug: 'best-free-certifications-for-students',
    category: 'digital-skills',
    title: 'Best Free Certifications for Students in 2026',
    description:
      'Google, Meta, HubSpot, Coursera, and more — which free certifications actually add value to your applications.',
    readingMinutes: 6,
    publishedAt: '2026-03-01',
  },
  {
    slug: 'how-to-build-a-portfolio-with-no-work-experience',
    category: 'digital-skills',
    title: 'How to Build a Portfolio With No Work Experience',
    description:
      'Use personal projects, open-source contributions, and volunteer work to build a portfolio that demonstrates real skills.',
    readingMinutes: 6,
    publishedAt: '2026-03-05',
  },
  {
    slug: 'ai-tools-for-students-and-job-seekers',
    category: 'digital-skills',
    title: 'AI Tools for Students and Job Seekers',
    description:
      'How to use ChatGPT, Notion AI, and other tools to research opportunities, draft applications, and manage your search.',
    readingMinutes: 5,
    publishedAt: '2026-03-10',
  },
  {
    slug: 'data-skills-every-young-professional-needs',
    category: 'digital-skills',
    title: 'Data Skills Every Young Professional Needs',
    description:
      'Spreadsheets, SQL basics, and data visualization — the minimum data literacy that sets candidates apart.',
    readingMinutes: 5,
    publishedAt: '2026-03-15',
  },

  // application-writing
  {
    slug: 'how-to-write-a-personal-statement',
    category: 'application-writing',
    title: 'How to Write a Personal Statement',
    description:
      'Structure, voice, and the difference between a personal statement that blends in and one that stands out.',
    readingMinutes: 7,
    publishedAt: '2026-03-01',
  },
  {
    slug: 'writing-scholarship-essays-that-win',
    category: 'application-writing',
    title: 'Writing Scholarship Essays That Win',
    description:
      'How to answer "Why do you deserve this scholarship?" in a way that is honest, specific, and memorable.',
    readingMinutes: 6,
    publishedAt: '2026-03-05',
  },
  {
    slug: 'how-to-ask-for-a-recommendation-letter',
    category: 'application-writing',
    title: 'How to Ask for a Recommendation Letter',
    description:
      'Timing, framing, and what to give your recommender so they can write something genuinely strong.',
    readingMinutes: 4,
    publishedAt: '2026-03-10',
  },
  {
    slug: 'research-proposals-for-fellowship-applications',
    category: 'application-writing',
    title: 'Research Proposals for Fellowship Applications',
    description:
      'How to write a research proposal even if you have never done research — structure, scope, and what reviewers look for.',
    readingMinutes: 7,
    publishedAt: '2026-03-15',
  },

  // opportunity-intel
  {
    slug: 'understanding-scholarship-vs-fellowship-vs-grant',
    category: 'opportunity-intel',
    title: 'Understanding Scholarship vs. Fellowship vs. Grant',
    description:
      'What each funding type means, what they pay for, and which ones to prioritize based on your goals.',
    readingMinutes: 4,
    publishedAt: '2026-03-01',
  },
  {
    slug: 'how-to-spot-fake-scholarships',
    category: 'opportunity-intel',
    title: 'How to Spot Fake Scholarships',
    description:
      'Red flags, legitimacy checks, and the official sources you should always verify against.',
    readingMinutes: 4,
    publishedAt: '2026-03-05',
  },
  {
    slug: 'application-timeline-planning-guide',
    category: 'opportunity-intel',
    title: 'Application Timeline Planning Guide',
    description:
      'When to start applying, how to manage multiple deadlines, and how to build a personal opportunity calendar.',
    readingMinutes: 5,
    publishedAt: '2026-03-10',
  },
  {
    slug: 'regional-opportunity-calendars',
    category: 'opportunity-intel',
    title: 'Regional Opportunity Calendars',
    description:
      'When major scholarships, fellowships, and competitions open by region — Africa, Asia, Latin America, Europe, and more.',
    readingMinutes: 5,
    publishedAt: '2026-03-15',
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
