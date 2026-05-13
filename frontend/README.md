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

In local development mode, the frontend uses a rewrite proxy and accesses the backend through:

- Browser-side API base: `/backend`

## Docker Mode

This frontend is also part of the root-level Docker Compose stack.

From the repository root:

```bash
docker compose up -d --build
```

After startup:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

## Environment Variables

See:

- `frontend/.env.example`

Important variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `INTERNAL_API_BASE_URL`
- `NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS`
