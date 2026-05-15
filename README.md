# FastAPI Personal Blog API System

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![CI](https://img.shields.io/github/actions/workflow/status/ZuoXing-0504/FastAPI-Personal-Blog-API-System/ci.yml?branch=main&label=CI)](https://github.com/ZuoXing-0504/FastAPI-Personal-Blog-API-System/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## Overview

This repository is a full-stack blog project built for:

- backend practice
- frontend showcase
- Docker deployment demos
- internship interview presentation

It combines a production-style FastAPI backend with a modern Next.js frontend.

## Stack

### Backend

- Python 3.9+
- FastAPI
- SQLAlchemy ORM
- MySQL 8.0
- PyJWT
- Pydantic
- Alembic
- Pytest

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- Zustand
- Motion
- Sonner

## Project Structure

```text
.
├─ alembic
├─ app
│  ├─ api
│  ├─ core
│  ├─ crud
│  ├─ db
│  ├─ exceptions
│  ├─ middleware
│  ├─ models
│  ├─ schemas
│  └─ services
├─ docker
├─ docs
├─ frontend
│  ├─ public
│  └─ src
├─ sql
└─ tests
```

## Core Features

### Authentication and Authorization

- Register with username, email, and password
- Store encrypted passwords instead of plain text
- Login returns `access_token` and `refresh_token`
- Refresh endpoint rotates refresh tokens
- Logout revokes refresh tokens
- Protected write operations require a valid JWT access token

### Article Module

- Create, list, retrieve, update, and delete articles
- Only the author can update or delete an article
- List supports pagination and category filtering
- Public detail page increments view count
- Studio edit page reads detail without increasing public view count

### Category Module

- Create categories
- List categories
- Bind articles to categories

### Frontend Experience

- Editorial-style homepage
- Public article list and article detail pages
- Public category showcase page
- Register and login pages wired to the real backend
- Persisted auth session with refresh-token retry
- Protected author studio
- Article CRUD in the studio
- Category management in the studio
- Profile page backed by `/users/me`

### Engineering Features

- Unified response format: `code`, `msg`, `data`
- Global exception handling
- Request validation with friendly errors
- Request logging with `X-Request-ID`
- Service layer for backend business logic
- Docker Compose one-command startup
- Backend tests and CI
- Frontend lint, typecheck, and production build checks

## Quick Start

The fastest way to run the full stack is:

```bash
docker compose up -d --build
```

After startup:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- MySQL on host: `127.0.0.1:3307`

Stop everything:

```bash
docker compose down
```

## Run Modes

### Mode 1: Local Development

Use this when you want hot reload while coding.

Backend:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Local addresses:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:8000`
- Browser-side API base: `/backend`

### Mode 2: Docker One-Command Startup

Use this when you want a clean demo environment.

```bash
docker compose up -d --build
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

## Frontend Page Map

### Public Pages

- `/`
- `/articles`
- `/articles/[id]`
- `/categories`
- `/login`
- `/register`

### Protected Studio Pages

- `/studio`
- `/studio/articles`
- `/studio/articles/new`
- `/studio/articles/[id]/edit`
- `/studio/categories`
- `/studio/profile`

## Demo Flow

This project can now demonstrate a full end-to-end workflow:

1. Start the full stack with Docker Compose
2. Open the homepage and browse the public UI
3. Open the article list and category page
4. Register a new user from the frontend
5. Log in and enter the protected studio
6. Create a category in `/studio/categories`
7. Create a new article in `/studio/articles/new`
8. Return to the public article list and verify it appears
9. Open the public article detail page and verify view count increases
10. Re-open the same article in the studio editor and verify edit reads do not inflate public views
11. Edit your own article
12. Delete your own article
13. Log out and verify protected routes redirect back to `/login`
14. Use another account to verify author-only restrictions

## API Documentation

After the backend starts:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Screenshot Guide

If you want to present this repository in a README, report, or interview deck, these are the most useful screenshots to capture:

### Frontend Screenshots

1. Homepage hero section
2. Public article list with filters
3. Public article detail page
4. Login page
5. Studio dashboard
6. Studio article list
7. New article editor
8. Category management page
9. Profile page

### Backend Screenshots

1. Swagger UI overview
2. Register endpoint example
3. Login response showing token structure
4. Protected article create endpoint
5. Author-only update or delete response
6. Refresh token endpoint

Suggested caption style:

- "Homepage with editorial-style landing section"
- "Protected studio article management page"
- "Swagger UI for FastAPI backend endpoints"
- "JWT login response and refresh-token workflow"

## Testing

Backend checks:

```bash
ruff check .
pytest
```

Frontend checks:

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

## Database Migration

Apply the latest schema:

```bash
alembic upgrade head
```

## Frontend Workspace

Frontend-specific usage notes live in:

- `frontend/README.md`

## License

This project is licensed under the [MIT License](./LICENSE).
