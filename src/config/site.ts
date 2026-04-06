export const siteConfig = {
  name: 'YouthAtlas',
  tagline: 'Opportunities for young people, updated daily.',
  description:
    'Find scholarships, fellowships, internships, grants, and more. Updated daily with AI-powered matching.',
  url: 'https://youthatlas.com',
  github: {
    platform: 'https://github.com/perezfe1/youthatlas-platform',
    scrapers: 'https://github.com/perezfe1/youthatlas-scrapers',
  },
} as const;

export const navLinks = [
  { label: 'Browse', href: '/opportunities' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/news' },
] as const;
