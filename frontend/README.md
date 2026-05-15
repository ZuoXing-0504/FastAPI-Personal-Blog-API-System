# Frontend Workspace

This directory contains the Next.js frontend for the FastAPI Personal Blog project.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- Zustand
- Motion
- Sonner

## What This Frontend Includes

### Public Experience

- Homepage with editorial-style landing section
- Public article list with category filters
- Public article detail page
- Public category page
- Mobile-friendly navigation

### Auth Experience

- Register page connected to the FastAPI backend
- Login page connected to the FastAPI backend
- Persisted auth session with Zustand
- Automatic access-token refresh retry
- Logout wired to backend token revocation

### Protected Studio

- `/studio` dashboard
- `/studio/articles` article management page
- `/studio/articles/new` create article page
- `/studio/articles/[id]/edit` edit article page
- `/studio/categories` category management page
- `/studio/profile` user profile page

## Route Overview

### Public

- `/`
- `/articles`
- `/articles/[id]`
- `/categories`
- `/login`
- `/register`

### Protected

- `/studio`
- `/studio/articles`
- `/studio/articles/new`
- `/studio/articles/[id]/edit`
- `/studio/categories`
- `/studio/profile`

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Useful scripts:

```bash
npm run lint
npm run typecheck
npm run build
npm run format
```

Default local addresses:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:8000`

In local development mode, the browser talks to the backend through:

- `/backend`

## Docker Mode

This frontend is part of the root-level Docker Compose stack.

From the repository root:

```bash
docker compose up -d --build
```

After startup:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

## Auth Flow Notes

The frontend currently does the following:

1. Registers a user through `/auth/register`
2. Logs in through `/auth/login`
3. Stores `access_token`, `refresh_token`, and user info in persisted Zustand state
4. Retries protected requests through `/auth/refresh` when access tokens expire
5. Clears local state and redirects when refresh fails
6. Calls `/auth/logout` before clearing the local session

## API Integration Notes

The frontend uses:

- `TanStack Query` for server data
- `Zustand` for auth state
- a shared API client for:
  - unified request handling
  - JWT injection
  - refresh retry
  - API error normalization

## Environment Variables

See:

- `frontend/.env.example`

Important variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `INTERNAL_API_BASE_URL`
- `NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS`
