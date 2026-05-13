# FastAPI Personal Blog API System

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![CI](https://img.shields.io/github/actions/workflow/status/ZuoXing-0504/FastAPI-Personal-Blog-API-System/ci.yml?branch=main&label=CI)](https://github.com/ZuoXing-0504/FastAPI-Personal-Blog-API-System/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## Overview

This repository is a full-stack personal blog project built for coursework, backend practice, frontend showcase, and internship interview demos.

It includes:

- A FastAPI backend API system
- A Next.js frontend workspace
- MySQL 8.0 data persistence
- Docker Compose one-command startup for the full stack
- Alembic migrations
- Pytest-based backend tests
- GitHub Actions CI

## Tech Stack

### Backend

- Python 3.9+
- FastAPI
- SQLAlchemy ORM
- MySQL 8.0
- PyJWT
- Pydantic
- Alembic

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- Zustand
- Motion

## Project Structure

```text
.
├── alembic
├── app
│   ├── api
│   ├── core
│   ├── crud
│   ├── db
│   ├── exceptions
│   ├── middleware
│   ├── models
│   ├── schemas
│   └── services
├── docker
├── docs
├── frontend
│   ├── public
│   └── src
├── sql
└── tests
```

## Core Features

### Authentication and Authorization

- Register with username, email, and password
- Store encrypted passwords instead of plain text
- Login returns `access_token` and `refresh_token`
- Refresh endpoint rotates refresh tokens
- Logout revokes refresh tokens
- Protected endpoints require a valid access token

### Article Module

- Create, list, retrieve, update, and delete articles
- Only the author can update or delete an article
- Article list supports pagination
- Article list supports category filtering
- Article detail automatically increments view count

### Category Module

- Create categories
- List categories
- Bind articles to categories

### Engineering Features

- Unified response format: `code`, `msg`, `data`
- Global exception handling
- Request validation with friendly error messages
- Request logging with `X-Request-ID`
- Service layer for business logic separation
- Full-stack Docker Compose startup

## Quick Start

If you want the fastest way to run the whole project, use Docker Compose:

```bash
docker compose up -d --build
```

After startup:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- MySQL on host: `127.0.0.1:3307`

Stop all services:

```bash
docker compose down
```

## Run Modes

This repository supports two main ways to run the project.

### Mode 1: Local Development

Use this mode when you are actively writing code and want hot reload.

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

Addresses in local development mode:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:8000`
- Frontend browser-side API base: `/backend`

### Mode 2: Docker One-Command Startup

Use this mode when you want a clean demo environment or full-stack startup with one command.

```bash
docker compose up -d --build
```

Addresses in Docker mode:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- MySQL on host: `127.0.0.1:3307`

Useful Docker commands:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

## API Documentation

After the backend starts:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Frontend Workspace

The frontend code lives in:

- `frontend/`

Its dedicated usage notes are in:

- `frontend/README.md`

## Backend-Only Local Run

If you only want to run the backend locally:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

## Full-Stack Docker Services

The root-level Docker Compose stack includes:

- `db`: MySQL 8.0
- `api`: FastAPI backend
- `frontend`: Next.js frontend

Port mapping:

- Frontend: `3000 -> 3000`
- Backend API: `8000 -> 8000`
- MySQL: `3307 -> 3306`

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

Apply the latest backend schema changes:

```bash
alembic upgrade head
```

## Demo Flow

You can use this project to demonstrate a complete full-stack workflow:

1. Register a user
2. Log in and obtain tokens
3. Browse the frontend homepage
4. Create a category
5. Publish an article
6. Query article list with pagination and category filter
7. Read article detail and verify view count growth
8. Update your own article
9. Delete your own article
10. Use another account to verify author-only permission restrictions
11. Verify anonymous requests are blocked on protected endpoints

## License

This project is licensed under the [MIT License](./LICENSE).
