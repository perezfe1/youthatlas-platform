import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resources | YouthAtlas',
  description:
    'Guides for young opportunity seekers: how to find the right opportunity, write strong essays, understand funding types, and stay organized during application season.',
};

// ── Resource data ────────────────────────────────────────────────────────────

const RESOURCES = [
  {
    title: 'How to Find the Right Opportunity',
    body: `Most life-changing opportunities go undiscovered — not because they don't exist, but because they're scattered across hundreds of different websites, institutional portals, and social media pages. A fully-funded fellowship in Berlin might only be posted on a single university page. A research grant for young scientists might live on a government site that's nearly impossible to search.

The key is using structured tools that aggregate these listings in one place. On YouthAtlas, you can filter by opportunity type (scholarship, fellowship, grant, internship, competition), region, funding status, and deadline. If you're looking for fully-funded programs, that filter alone will surface opportunities where tuition, housing, and a stipend are all covered — saving you hours of reading fine print.

Pay close attention to deadlines. Many prestigious fellowships have application windows that open months before the due date, and some operate on rolling admissions — meaning the earlier you apply, the better your chances. Set calendar reminders for anything you're interested in. Check back weekly, because new opportunities are indexed every day.`,
  },
  {
    title: 'Writing a Strong Application Essay',
    body: `The most common mistake in application essays is being too general. Saying "I'm passionate about making a difference" tells a reviewer nothing. What they want to know is: why you, why now, and why this specific program.

Start by researching the organization behind the opportunity. What is their mission? What kind of candidates have they selected in the past? Your essay should make it clear that you understand what they're looking for and that your background is a genuine fit — not a generic match.

Use the "why you, why now, why this program" framework. "Why you" is your unique background, skills, or experiences. "Why now" is what's happening in your life or field that makes this the right moment. "Why this program" is the specific reason this opportunity (not just any opportunity) matters to you.

Be specific. Instead of "I've always cared about education," write about the tutoring program you started in your second year that reached 40 students. Concrete examples of past impact are far more persuasive than abstract claims. And always have someone else read your essay before submitting — a fresh pair of eyes catches what you can't.`,
  },
  {
    title: 'Understanding Funding Types',
    body: `Not all opportunities are created equal, and understanding the differences between funding types will help you apply more strategically.

Scholarships are typically academic awards — they may cover tuition partially or fully, and many are renewable each year as long as you maintain a certain GPA. They're the most common type of funding for undergraduate and graduate students.

Fellowships are different. They're usually project-based or research-focused, often come with a stipend (monthly living allowance), and frequently include a cohort experience — meaning you'll be part of a selected group working on similar themes. Fellowships tend to be more competitive but also more transformative.

Grants are funding for a specific project or initiative. They're common in research, social entrepreneurship, and development work. Unlike scholarships, grants usually require a proposal outlining what you'll do with the money and how you'll measure impact.

Internships provide hands-on work experience. They can be paid or unpaid, and range from corporate placements to NGO fieldwork. The best internships lead to full-time offers or strong references.

Competitions are prize-based opportunities — pitch competitions, hackathons, essay contests, and innovation challenges. Even if you don't win, the prestige of being a finalist can open doors. Think carefully about which type matches your current goals before applying.`,
  },
  {
    title: 'Staying Organized During Application Season',
    body: `Application season can be overwhelming. Between deadlines, requirements, and multiple essay drafts, it's easy to lose track. The most successful applicants treat it like a project management exercise.

Start by creating a simple spreadsheet. Track: opportunity name, deadline, required documents, essay prompts, submission status, and any follow-up actions. Color-code by urgency — red for deadlines within two weeks, yellow for one month, green for further out.

Apply to 5 to 10 opportunities at a time rather than going one by one. This lets you batch similar tasks: write all your personal statements in one week, request all your recommendation letters at once, and gather transcripts early. Many programs ask for overlapping documents, so having everything ready saves significant time.

Gather your core documents before you start: an up-to-date CV, official transcripts, two to three letters of recommendation (ask early — recommenders need lead time), and a polished personal statement that can be adapted. Having these on hand means you can submit applications in days instead of weeks.

YouthAtlas sends a weekly email digest every Monday with the latest listings and approaching deadlines. Subscribe to stay on top of what's new without having to check manually every day.`,
  },
] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function ResourceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl font-semibold text-[#1A1A2E]">{title}</h2>
      <div className="mt-4 space-y-3 text-slate-600 leading-relaxed">
        {body.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">
        Resources for Young Opportunity Seekers
      </h1>
      <p className="mt-6 text-slate-600 leading-relaxed">
        Finding and winning scholarships, fellowships, and grants takes more than just knowing where
        to look. These guides are written by the YouthAtlas team to help you navigate the process
        from discovery to application.
      </p>

      <div className="mt-10 space-y-8">
        {RESOURCES.map((resource) => (
          <ResourceCard key={resource.title} title={resource.title} body={resource.body} />
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="mt-12 rounded-xl bg-blue-50 p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-[#1A1A2E]">
          Ready to start exploring?
        </h2>
        <p className="mt-2 text-slate-600">Browse 800+ opportunities updated daily.</p>
        <div className="mt-6">
          <Link
            href="/opportunities"
            className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Browse Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
