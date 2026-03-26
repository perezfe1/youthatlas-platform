import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/resources');

export type GuideFrontmatter = {
  title: string;
  description: string;
  readingMinutes: number;
  publishedAt: string;
  tag?: 'Essential' | 'Popular';
};

export type GuideContent = {
  frontmatter: GuideFrontmatter;
  content: string;
};

export function getGuideContent(
  categorySlug: string,
  guideSlug: string,
): GuideContent | null {
  const filePath = path.join(CONTENT_DIR, categorySlug, `${guideSlug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    frontmatter: data as GuideFrontmatter,
    content,
  };
}

export function guideContentExists(
  categorySlug: string,
  guideSlug: string,
): boolean {
  const filePath = path.join(CONTENT_DIR, categorySlug, `${guideSlug}.mdx`);
  return fs.existsSync(filePath);
}
