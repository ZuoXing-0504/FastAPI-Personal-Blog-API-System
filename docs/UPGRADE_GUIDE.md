# Project Upgrade Guide

## Overview

This project has been upgraded from a demo-style FastAPI CRUD project to a more formal backend service with:

- service layer separation
- access token + refresh token authentication
- refresh token persistence and rotation
- request id middleware and application logging
- Docker multi-service startup
- Alembic database migrations
- automated tests and CI checks

## New Architecture

The backend now follows this flow:

1. `endpoint` receives request parameters
2. `dependency` resolves the current user and database session
3. `service` handles business rules
4. `crud` reads and writes database models
5. `schema` validates input and shapes output

New service modules:

- `app/services/auth.py`
- `app/services/article.py`
- `app/services/category.py`

## Refresh Token Design

### Access token

- used to access protected APIs
- short lifetime
- contains `type=access`

### Refresh token

- used only for token refresh and logout
- long lifetime
- contains `type=refresh` and a unique `jti`
- persisted in the `refresh_tokens` table
- rotated on every refresh request
- revoked on logout

### New authentication endpoints

- `POST /api/v1/auth/login`
  - returns `access_token` and `refresh_token`
- `POST /api/v1/auth/refresh`
  - rotates the refresh token and returns a new token pair
- `POST /api/v1/auth/logout`
  - revokes the current refresh token

## Logging

The project now includes request logging with request ids.

### Features

- generates or forwards `X-Request-ID`
- writes request method, path, status code, and duration
- logs business exceptions, validation exceptions, database exceptions, and unexpected exceptions
- supports file logging through environment variables

### Related files

- `app/core/logging.py`
- `app/middleware/request_context.py`
- `app/exceptions/handlers.py`

## Docker Services

The Docker deployment now includes:

- `db`: MySQL 8.0
- `api`: FastAPI backend

### Improvements

- waits for MySQL readiness before starting the API
- runs `alembic upgrade head` on container startup
- enables file logging in `/app/logs`
- adds API health check

### Start command

```bash
docker compose up --build
```

### Stop command

```bash
docker compose down
```

## Migration Notes

New migration:

- `alembic/versions/20260511_0002_add_refresh_tokens_table.py`

New table:

- `refresh_tokens`

## Test Coverage

The test suite now verifies:

- registration
- login token pair generation
- refresh token rotation
- logout revocation
- protected endpoint access control
- article CRUD and ownership checks
- request id response header

Run locally:

```bash
pytest
ruff check .
```

## Recommended Demo Flow

1. Register a user
2. Log in and get `access_token` and `refresh_token`
3. Call `GET /api/v1/users/me` with the access token
4. Create a category
5. Publish an article
6. Read article detail and observe `view_count + 1`
7. Refresh token pair with `/api/v1/auth/refresh`
8. Log out with `/api/v1/auth/logout`
9. Retry refresh and observe `401`
