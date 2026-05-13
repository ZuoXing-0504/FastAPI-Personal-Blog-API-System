# FastAPI Personal Blog API System

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![CI](https://img.shields.io/github/actions/workflow/status/ZuoXing-0504/FastAPI-Personal-Blog-API-System/ci.yml?branch=main&label=CI)](https://github.com/ZuoXing-0504/FastAPI-Personal-Blog-API-System/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## Overview

This repository is a FastAPI-based personal blog backend project designed for coursework, backend practice, and internship interview demos. It focuses on common backend engineering capabilities instead of only basic CRUD.

The project includes:

- User registration and login
- JWT access token authentication
- Refresh token rotation and logout revocation
- Author-only article update and delete permissions
- Category management and article-category binding
- Pagination, category filtering, and article view count
- Unified response format and global exception handling
- Pydantic request validation
- Alembic database migrations
- Pytest API tests
- Docker Compose deployment
- GitHub Actions CI

## Tech Stack

- Python 3.9+
- FastAPI
- MySQL 8.0
- SQLAlchemy ORM
- Pydantic
- PyJWT
- Alembic
- Pytest
- Docker / Docker Compose

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
- Article list supports filtering by category
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

## API Documentation

After the service starts:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Local Run

1. Create and activate a virtual environment.
2. Install dependencies.
3. Create MySQL database.
4. Configure `.env`.
5. Run Alembic migrations.
6. Start the service.

Example:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

## Docker Run

Start the full stack:

```bash
docker compose up -d --build
```

Current Docker mapping in this repository:

- API: `127.0.0.1:8000`
- MySQL container: host `3307` -> container `3306`

Stop services:

```bash
docker compose down
```

## Testing

Run automated checks locally:

```bash
ruff check .
pytest
```

## Database Migration

Apply the latest schema changes:

```bash
alembic upgrade head
```

## Demo Flow

You can use this project to demonstrate a complete backend workflow:

1. Register a user
2. Log in and obtain tokens
3. Create a category
4. Publish an article
5. Query article list with pagination and category filter
6. Read article detail and verify view count growth
7. Update your own article
8. Delete your own article
9. Use another account to verify author-only permission restrictions
10. Verify anonymous requests are blocked on protected endpoints

## License

This project is licensed under the [MIT License](./LICENSE).
