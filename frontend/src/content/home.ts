import {
  Blocks,
  BookOpenText,
  DatabaseZap,
  Layers3,
  LucideIcon,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export type FeaturedArticle = {
  id: number;
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
};

export type CategoryShowcase = {
  name: string;
  description: string;
  articleCount: string;
};

export type ProjectHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const showcaseStats = [
  { value: "JWT", label: "access + refresh token auth" },
  { value: "CRUD", label: "article and category workflow" },
  { value: "Docker", label: "full-stack one-command startup" },
];

export const featuredArticles: FeaturedArticle[] = [
  {
    id: 1,
    title:
      "Building a personal blog backend that actually feels production-ready",
    summary:
      "From JWT rotation to author-only article updates, this project focuses on the engineering details that make a student backend more convincing in interviews.",
    category: "Engineering",
    author: "Zuo Xing",
    publishedAt: "May 2026",
    readTime: "7 min read",
    featured: true,
  },
  {
    id: 2,
    title:
      "Designing clean API boundaries with FastAPI, schemas, and service layers",
    summary:
      "A practical breakdown of how request validation, response contracts, and service-level business logic keep the codebase easier to extend.",
    category: "Backend",
    author: "Zuo Xing",
    publishedAt: "May 2026",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "From local development to Docker Compose full-stack startup",
    summary:
      "The project now supports frontend, backend, and MySQL startup with one command, so demos are faster and environment drift is reduced.",
    category: "DevOps",
    author: "Zuo Xing",
    publishedAt: "May 2026",
    readTime: "4 min read",
  },
];

export const featuredCategories: CategoryShowcase[] = [
  {
    name: "Backend",
    description:
      "API design, authentication, data modeling, and backend architecture notes.",
    articleCount: "08 planned posts",
  },
  {
    name: "Learning",
    description:
      "Study notes, implementation summaries, and lessons learned while building projects.",
    articleCount: "06 planned posts",
  },
  {
    name: "Engineering",
    description:
      "Testing, migrations, deployment, CI, and the craft behind project polish.",
    articleCount: "05 planned posts",
  },
  {
    name: "Career",
    description:
      "Interview-oriented project thinking, portfolio presentation, and growth logs.",
    articleCount: "04 planned posts",
  },
];

export const projectHighlights: ProjectHighlight[] = [
  {
    title: "Structured API contracts",
    description:
      "Unified response envelopes and Pydantic validation make the backend easier to consume and reason about from the frontend.",
    icon: BookOpenText,
  },
  {
    title: "Refresh token flow",
    description:
      "Access and refresh token rotation is already in place, so the frontend can later adopt a smoother authenticated session flow.",
    icon: RefreshCw,
  },
  {
    title: "Author-only permissions",
    description:
      "The article workflow is ready for real ownership boundaries, which is ideal for a lightweight studio dashboard.",
    icon: ShieldCheck,
  },
  {
    title: "Service-oriented backend",
    description:
      "Business logic has been pulled out of route handlers, which makes future frontend-driven features easier to align with backend behavior.",
    icon: Layers3,
  },
  {
    title: "Migration-friendly database design",
    description:
      "Alembic migrations and a clean data model make the project feel much closer to an actual engineering workflow.",
    icon: DatabaseZap,
  },
  {
    title: "Full-stack Docker startup",
    description:
      "Frontend, API, and MySQL can now boot together, which makes demos and onboarding far more reliable.",
    icon: Blocks,
  },
];
