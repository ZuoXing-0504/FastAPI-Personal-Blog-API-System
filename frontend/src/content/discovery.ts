export type PublicCategory = {
  slug: string;
  name: string;
  description: string;
  articleCount: number;
};

export type PublicArticle = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  viewCount: number;
  body: string[];
  takeaways: string[];
};

export const publicCategories: PublicCategory[] = [
  {
    slug: "backend",
    name: "Backend",
    description:
      "API design, authentication, data modeling, and practical service structure notes.",
    articleCount: 4,
  },
  {
    slug: "engineering",
    name: "Engineering",
    description:
      "Testing, migrations, deployment, observability, and the parts that make a project feel real.",
    articleCount: 3,
  },
  {
    slug: "learning",
    name: "Learning",
    description:
      "Build logs, implementation retrospectives, and notes from turning ideas into working software.",
    articleCount: 2,
  },
  {
    slug: "career",
    name: "Career",
    description:
      "Project framing, interview thinking, and how to present technical work more clearly.",
    articleCount: 2,
  },
];

export const publicArticles: PublicArticle[] = [
  {
    id: 1,
    slug: "backend-blog-production-ready",
    title:
      "Building a personal blog backend that actually feels production-ready",
    summary:
      "A student project becomes more convincing once authentication, migrations, testing, and deployment habits are treated as first-class concerns.",
    category: "engineering",
    author: "Zuo Xing",
    publishedAt: "May 14, 2026",
    readTime: "7 min read",
    viewCount: 126,
    body: [
      "A backend project starts feeling more serious when you stop treating authentication, migrations, and ownership rules as optional decoration. They are not extras. They are often the first signals that tell an interviewer whether you understand software as a system instead of a demo.",
      "In this blog project, the value does not come from CRUD alone. It comes from how the CRUD is framed. Articles belong to authors, refresh tokens rotate instead of living forever, and the database evolves through migrations rather than accidental table drift.",
      "That shift in mindset is what makes a personal project easier to talk about. You are no longer saying, 'I built login and articles.' You are saying, 'I designed a small but coherent content platform with clear boundaries and deployable structure.'",
    ],
    takeaways: [
      "Project credibility comes from behavior, not feature count.",
      "Ownership rules and token flows are strong interview talking points.",
      "Migrations and deployment readiness change how the project is perceived.",
    ],
  },
  {
    id: 2,
    slug: "fastapi-service-boundaries",
    title:
      "Designing clean API boundaries with FastAPI, schemas, and service layers",
    summary:
      "A practical look at separating validation, persistence, and business logic without overcomplicating a small project.",
    category: "backend",
    author: "Zuo Xing",
    publishedAt: "May 13, 2026",
    readTime: "5 min read",
    viewCount: 98,
    body: [
      "FastAPI makes it easy to move quickly, but it is also easy to let route handlers grow into a place where validation, persistence, permission checks, and business decisions all mix together. That works for a while, and then every new requirement feels heavier than it should.",
      "Service layers help because they give your code a middle ground. Schemas define the contract, routes handle transport, CRUD handles persistence, and services carry the core decisions. The result is not enterprise ceremony. It is a cleaner place for the real logic to live.",
      "For student projects, this matters because you can explain it clearly. You can point to one layer for request validation, another for token parsing, and another for article ownership checks. That makes your architecture legible to both yourself and the interviewer.",
    ],
    takeaways: [
      "Routes should coordinate, not own all business logic.",
      "Schemas, CRUD, and services each solve different problems.",
      "Readable architecture is easier to explain under interview pressure.",
    ],
  },
  {
    id: 3,
    slug: "docker-compose-demo-stack",
    title: "From local development to one-command Docker Compose startup",
    summary:
      "How frontend, backend, and MySQL were wired into a cleaner demo workflow with fewer environment surprises.",
    category: "engineering",
    author: "Zuo Xing",
    publishedAt: "May 13, 2026",
    readTime: "4 min read",
    viewCount: 84,
    body: [
      "Local development is great for iteration, but demos often fail because machines drift. A missing dependency, a different database port, or a forgotten environment variable can turn a project presentation into troubleshooting.",
      "That is why one-command startup matters. Docker Compose gives the project a predictable shape: frontend, API, and MySQL can come up together with the same defaults every time. It lowers setup friction and makes the repository easier for someone else to trust.",
      "For portfolio work, that matters almost as much as code quality. A project that other people can boot reliably feels more complete, more considerate, and much closer to real engineering practice.",
    ],
    takeaways: [
      "Reliable startup is part of product polish.",
      "Compose reduces environment drift across machines.",
      "A demo-friendly repo is more persuasive than a repo that only works on one laptop.",
    ],
  },
  {
    id: 4,
    slug: "jwt-refresh-token-flow",
    title: "Why refresh token rotation makes your auth flow feel more complete",
    summary:
      "A lightweight explanation of how access token expiry, refresh endpoints, and logout revocation fit together.",
    category: "backend",
    author: "Zuo Xing",
    publishedAt: "May 12, 2026",
    readTime: "6 min read",
    viewCount: 102,
    body: [
      "Short-lived access tokens improve security, but they also create a usability problem if every expiry sends users back to the login page. Refresh tokens exist to smooth that edge while keeping session behavior explicit.",
      "The important part is rotation. A refresh token should not be treated like an immortal key. If each refresh replaces the previous token and logout revokes the chain, the session model becomes easier to reason about and easier to defend in discussion.",
      "Even in a small project, this is worth implementing. It turns authentication from a checkbox feature into a workflow with real constraints, and that changes the level of the conversation around your backend.",
    ],
    takeaways: [
      "Refresh tokens solve a usability problem, not just a security one.",
      "Rotation and revocation make the session model more realistic.",
      "Small auth details often become high-value interview discussion points.",
    ],
  },
  {
    id: 5,
    slug: "category-driven-content-structure",
    title:
      "Using category-driven information architecture to make technical blogs easier to browse",
    summary:
      "Good categories do more than group content. They give your project navigation a stronger sense of intent.",
    category: "learning",
    author: "Zuo Xing",
    publishedAt: "May 12, 2026",
    readTime: "4 min read",
    viewCount: 59,
    body: [
      "Readers rarely arrive at a project already knowing what matters most to them. Some want architecture, some want implementation detail, and some want the story of how the project improved over time. Categories help you respect those different entry points.",
      "On the frontend, categories create rhythm. They stop the list page from feeling like a wall of equally weighted cards. On the backend, they give filtering and query design a real job to do beyond theoretical completeness.",
      "That dual value is what makes category design more than a cosmetic feature. It becomes part of both information architecture and API usefulness.",
    ],
    takeaways: [
      "Categories improve both navigation and backend filtering.",
      "Good grouping makes content feel easier to approach.",
      "Information architecture is part of product design, not an afterthought.",
    ],
  },
  {
    id: 6,
    slug: "backend-project-for-interviews",
    title: "How to present a backend project better in interviews",
    summary:
      "The difference between listing features and telling a story about architecture, tradeoffs, and polish.",
    category: "career",
    author: "Zuo Xing",
    publishedAt: "May 11, 2026",
    readTime: "5 min read",
    viewCount: 77,
    body: [
      "A strong project explanation is rarely a feature inventory. It is usually a sequence of design choices: why this stack was selected, what business rules were enforced, where complexity was introduced deliberately, and what would be improved next.",
      "That is especially true for student backends. Many projects implement similar modules, so your edge comes from clarity. If you can explain service boundaries, token rotation, or author-only permissions without getting lost, the same code looks much stronger.",
      "The frontend now helps that story too. Instead of presenting the backend as isolated endpoints, the project reads more like a product someone can browse and understand.",
    ],
    takeaways: [
      "Project storytelling should focus on decisions, not only features.",
      "Clarity is a competitive advantage when many candidates build similar CRUD systems.",
      "A presentable frontend increases the perceived maturity of the backend.",
    ],
  },
  {
    id: 7,
    slug: "testing-real-value-student-projects",
    title: "Why tests matter even in a student project",
    summary:
      "The value is not just correctness. Tests also make your project easier to explain, extend, and trust.",
    category: "engineering",
    author: "Zuo Xing",
    publishedAt: "May 10, 2026",
    readTime: "5 min read",
    viewCount: 64,
    body: [
      "Tests in a student project are often treated as optional because the project feels small. In reality, that is exactly when they are most useful. A few well-chosen tests protect the pieces that are easiest to break while refactoring.",
      "They also sharpen your understanding of the API. When you automate login, author permission checks, or article CRUD, you are forced to think about what the contract really is and which behaviors matter most.",
      "That makes tests valuable far beyond correctness. They become part of how the project explains itself and part of how you gain confidence to keep improving it.",
    ],
    takeaways: [
      "Tests are leverage, especially in small evolving projects.",
      "Automation reveals the real API contract.",
      "Confidence during refactor is one of the biggest practical payoffs.",
    ],
  },
  {
    id: 8,
    slug: "building-while-learning",
    title: "Learning backend by shipping something visible",
    summary:
      "A short reflection on why building one polished project teaches more than hopping across many unfinished demos.",
    category: "learning",
    author: "Zuo Xing",
    publishedAt: "May 9, 2026",
    readTime: "3 min read",
    viewCount: 51,
    body: [
      "There is a difference between reading about backend concepts and shipping them into one visible system. When you build a project end to end, tradeoffs become concrete instead of abstract.",
      "You feel the cost of poor naming, weak structure, and missing validation immediately. At the same time, you also see how satisfying it is when the pieces line up: schema, route, service, database, and UI all reinforcing each other.",
      "That is why a polished single project can teach more than many half-finished exercises. It creates pressure in the right places and gives you one strong artifact to improve over time.",
    ],
    takeaways: [
      "Shipping teaches differently than isolated exercises.",
      "Integrated projects reveal structural weaknesses faster.",
      "One polished project can become a long-term learning asset.",
    ],
  },
  {
    id: 9,
    slug: "author-permissions-explained",
    title: "Author-only permissions are a small feature with big credibility",
    summary:
      "A simple ownership rule can say a lot about whether a project understands real business constraints.",
    category: "backend",
    author: "Zuo Xing",
    publishedAt: "May 8, 2026",
    readTime: "4 min read",
    viewCount: 70,
    body: [
      "Author-only permissions are small on the surface, but they signal something important: the project understands that not every authenticated user should be allowed to do everything.",
      "That single rule gives article updates and deletes more realism. It also forces cleaner dependency design, because the current user must be resolved and checked in a reliable, reusable way.",
      "In interview settings, these moments matter. They show that your backend is not just passing data around; it is enforcing rules that map to real product expectations.",
    ],
    takeaways: [
      "Simple permission checks add strong credibility.",
      "Authentication and authorization are related but different concerns.",
      "Business rules are often the most memorable parts of a student project.",
    ],
  },
  {
    id: 10,
    slug: "resume-ready-project-readme",
    title: "Turning a project README into a portfolio asset",
    summary:
      "Documentation is part of product design. It changes how quickly someone understands your work and your engineering maturity.",
    category: "career",
    author: "Zuo Xing",
    publishedAt: "May 7, 2026",
    readTime: "4 min read",
    viewCount: 43,
    body: [
      "A README is not just documentation. It is often the first product surface anyone sees. If it is vague, noisy, or incomplete, even solid code can feel smaller than it is.",
      "Good project documentation does three things well: it explains what the project is, how to run it, and why its design choices matter. When those three pieces are present, the repository becomes easier to explore and easier to trust.",
      "That is why polishing documentation is not separate from engineering. It is part of the same act of making your work understandable to other people.",
    ],
    takeaways: [
      "Documentation shapes first impressions as strongly as code.",
      "A good README should explain purpose, startup, and design choices.",
      "Communication quality is part of engineering quality.",
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return publicCategories.find((category) => category.slug === slug);
}

export function getArticleById(id: number) {
  return publicArticles.find((article) => article.id === id);
}

export function getRelatedArticles(currentArticle: PublicArticle, limit = 2) {
  return publicArticles
    .filter(
      (article) =>
        article.id !== currentArticle.id &&
        article.category === currentArticle.category,
    )
    .slice(0, limit);
}
