export const NEWS_POSTS = [
  {
    slug: 'youthatlas-open-source-2026',
    title: 'YouthAtlas Is Now Open Source',
    date: 'May 25, 2026',
    excerpt:
      'We\'re opening our codebase to the public — so anyone can see how YouthAtlas works, contribute improvements, and build on what we\'ve made.',
    body: `From today, the YouthAtlas platform is open source. You can find the full codebase at github.com/perezfe1/youthatlas-platform.

We made this decision for a simple reason: we're a nonprofit, and our mission is equitable access to opportunity. Keeping our code closed added no value and contradicted everything we're trying to do. If another organization wants to build something similar for a different audience or region, they should be able to learn from what we've built.

What's in the repo? Everything that powers youthatlas.com — the Next.js frontend, the opportunity browsing and filtering system, the search logic, the user profile and personalization features, the weekly digest infrastructure, the web push notification system, and the full security setup. The AI-powered scraping pipeline that feeds the database is in a separate public repo at github.com/perezfe1/youthatlas-scrapers.

A few things we learned worth sharing: ISR caching on Vercel cuts serverless compute costs dramatically. Supabase's pgvector extension makes semantic search genuinely accessible for small teams. Running scrapers on GitHub Actions rather than always-on servers saves real money and complexity.

If you're a developer, nonprofit technologist, or just curious about how the platform works, take a look. Issues and pull requests are welcome. If you're an organization thinking about building something similar, feel free to reach out at hello@youthatlas.com — we're happy to talk through the architecture.

YouthAtlas remains free, nonprofit, and mission-driven. Opening the code doesn't change what it is — it just means more people can see that.`,
  },
  {
    slug: 'summer-2026-opportunities',
    title: 'Summer 2026: The Opportunities You Should Be Applying to Right Now',
    date: 'May 19, 2026',
    excerpt:
      'June and July deadlines are closing fast. Here are the fellowship, scholarship, and internship categories to prioritize this month.',
    body: `If you've been meaning to apply for something and haven't started yet, this is your window. Summer 2026 has a dense cluster of deadlines in June and July — and several of the most competitive programs close earlier than most people expect.

Here's where to focus your energy right now.

**Fellowships closing in June**
Summer-cohort fellowships are actively in final rounds. Many programs that start in September or October close applications in May and June. If you're interested in a leadership fellowship, a policy fellowship, or a research fellowship, check the deadline immediately — this category moves faster than any other. Search "fellowship" on YouthAtlas filtered by deadline to see what's still open.

**Summer internships — the late window**
Not all internship programs follow the January-to-March recruiting cycle. Smaller NGOs, think tanks, and regional organizations often post summer internships in April and May. These tend to be less competitive because fewer people know about them. They can also be more substantive — smaller organizations give interns real work. Filter for "internship" on YouthAtlas and sort by deadline to find programs still accepting applications.

**Research and conference grants**
If you're a graduate student or early-career researcher, June is prime season for conference travel grants and summer research funding. Many academic societies and foundations fund conference attendance and short research projects on a rolling basis. These applications are often shorter than fellowship applications — a research summary, a budget, and a CV.

**Fully-funded programs**
The "fully funded" filter on YouthAtlas is worth using deliberately this month. Programs that cover all costs — tuition, travel, housing, and a stipend — are often the most impactful ones to apply for, especially if finances are a barrier. Filter for fully funded and sort by deadline to find what's still open.

A practical note: the biggest mistake applicants make is underestimating how long the supporting materials take. Recommendation letters need at least two weeks of lead time. Transcripts can take a week to arrive. A strong essay needs multiple drafts. If a deadline is four weeks away, you should start today.

Browse what's open at youthatlas.com/opportunities and sort by deadline to build your list.`,
  },
  {
    slug: 'youthatlas-launch-2025',
    title: 'YouthAtlas Launches: 600+ Opportunities for Young People in One Place',
    date: 'November 15, 2025',
    excerpt:
      'We built YouthAtlas because finding life-changing opportunities shouldn\'t depend on who you know or where you grew up.',
    body: `Every year, thousands of scholarships, fellowships, internships, grants, and competitions are offered to young people around the world. Many are fully funded. Many are open to applicants from any country. And most of them go undiscovered by the very people they were designed to help.

The problem isn't a lack of opportunities — it's fragmentation. A fellowship posted on one university's website never reaches the student in another country who would be a perfect fit. A grant for young social entrepreneurs sits buried on page three of a government portal. The information exists, but it's scattered across hundreds of sources with no central index.

That's why we built YouthAtlas. Our platform aggregates opportunities from trusted sources across the web and presents them in one clean, searchable, filterable format. You can browse by type (scholarship, fellowship, grant, internship, competition), by region, by funding status, or by deadline. You can save opportunities you're interested in and come back to them later.

Behind the scenes, YouthAtlas is powered by AI scrapers that run every single day. They crawl established opportunity aggregators, extract structured data from each listing, validate it, remove duplicates, and store everything in our database. Every morning, the platform is fresher than it was the night before.

We also distribute the best new opportunities through our Telegram channel (@youthatlas1), where over a thousand young people receive daily alerts. And every Monday, subscribers receive a curated weekly email digest with the top listings of the week.

YouthAtlas is completely free and always will be. It's a project of Prospera Development Foundation, a registered 501(c)(3) nonprofit. We believe opportunity access is a public good — and we're building the infrastructure to prove it. Explore the platform at youthatlas.com and see what you've been missing.`,
  },
  {
    slug: 'how-we-find-opportunities',
    title: 'How YouthAtlas Finds and Vets Opportunities Every Day',
    date: 'January 8, 2026',
    excerpt:
      'Our AI-powered pipeline discovers hundreds of new opportunities daily — here\'s exactly how it works.',
    body: `One of the most common questions we get is: "How do you find all these opportunities?" The answer is a custom-built AI pipeline that runs automatically every day at 4 AM UTC.

Here's how it works. We maintain a set of scrapers — automated programs that visit trusted opportunity aggregator websites daily. These aren't random sites; they're established platforms like YouthOp, Opportunities for Youth, OpportunityDesk, AfterSchool Africa, and ScholAds that have been curating opportunities for years. Our scrapers visit each source, identify new or updated listings, and extract the raw content.

Next comes extraction and validation. Each raw listing is processed by an AI model (Google Gemini 2.5 Flash) that extracts structured data: title, organization, description, eligibility, deadline, funding status, regions, opportunity type, and more. This structured data is then validated against a strict schema — if any required field is missing or malformed, the listing is flagged for human review rather than published with incorrect information.

Deduplication is critical. The same opportunity often appears on multiple source sites. Our pipeline uses a three-layer dedup system: URL matching (catches exact reposts), content hashing (catches identical text with different URLs), and fuzzy title matching (catches slight variations in how the same opportunity is named across sites).

Every validated opportunity also gets an embedding — a mathematical representation of its content generated by OpenAI's text-embedding model. These embeddings power our semantic search. When you search for "climate research funding," you'll find opportunities about environmental science, sustainability grants, and conservation fellowships — even if they don't contain the exact words you typed.

When we label something as "fully funded," it means tuition, housing, and a stipend are covered based on the listing's own description. We don't editorialize or inflate — what you see is what the source reported, structured and made searchable.

The result: 800+ vetted opportunities, updated every single day, searchable by meaning — not just keywords.`,
  },
  {
    slug: 'spring-2026-opportunities',
    title: 'Top Opportunities to Apply for This Spring 2026',
    date: 'March 3, 2026',
    excerpt:
      'Fellowships, scholarships, and internships with deadlines in the next 60 days — curated by the YouthAtlas team.',
    body: `Spring is one of the busiest seasons in the opportunity calendar. Fellowship programs are recruiting their next cohorts, summer internship applications are in full swing, and research grant deadlines cluster between March and May. If you've been meaning to apply for something, now is the time.

Here's what to look for this season. Fellowship programs — especially those with summer or fall start dates — tend to close their applications in March and April. These are some of the most transformative opportunities available: fully-funded cohort experiences that combine professional development, mentorship, and project work. If you've been eyeing a fellowship, check its deadline now.

Summer internships are actively recruiting. Many organizations, from international NGOs to tech companies to government agencies, post their internship openings between January and April for summer placements. Paid internships at reputable organizations fill quickly, so early applications have an advantage.

Research grants and academic scholarships also peak in spring. If you're a graduate student or early-career researcher, this is the window to apply for project funding, conference travel grants, and dissertation fellowships. Many of these require a research proposal, so start drafting early.

To find what's open right now, head to YouthAtlas and sort by deadline. You can filter by opportunity type to see only fellowships, only internships, or only grants. Use the "fully funded" filter if you need programs that cover all costs. And if you've set your preferences in your profile, the platform will highlight opportunities tagged "For you" based on your interests and region.

Don't wait until the last week. Recommendation letters take time. Transcripts need to be ordered. Essays need revision. Give yourself at least two weeks before any deadline. Browse the current listings at youthatlas.com/opportunities and start building your application list today.`,
  },
] as const;
