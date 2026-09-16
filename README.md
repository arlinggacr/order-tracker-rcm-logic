# order-tracker-rcm-logic

Backend service built with [Bun](https://bun.sh/), [Elysia](https://elysiajs.com/), and [Drizzle ORM](https://orm.drizzle.team/).

## Requirements

- Bun 1.2+

## Setup

```sh
bun install
cp .env.example .env
bun run db:push
```

## Development

```sh
bun run dev
```

The API is available at `http://localhost:3000`. Use `GET /health` for a health check.

## Database

Supabase PostgreSQL is used for persistence. Set `DATABASE_URL` to your Supabase connection URI from **Project Settings > Database > Connection string**. Use the session pooler connection string for serverless or frequently-created connections.

```sh
bun run db:generate
bun run db:migrate
```

The schema lives in `src/db/schema.ts` and generated migrations are stored in `drizzle/`.

## Architecture

Business features live under `src/modules`. Each module follows this dependency direction:

`module -> controller -> service -> repository`

The module composes the dependencies, the controller defines HTTP routes, the service owns business logic, and the repository handles database access.

Each layer has its own directory inside a module:

```text
src/modules/health/
├── controller/health.controller.ts
├── repository/health.repository.ts
├── service/health.service.ts
└── health.module.ts
```

The application currently includes `auth` and `orders` modules with the same structure. Auth stores a Bun-generated password hash in `users.password_hash`; plaintext passwords are never persisted.

Auth endpoints return a JWT access token:

- `POST /auth/register`
- `POST /auth/login`

Tokens expire after one day. Set `JWT_SECRET_KEY` in `.env` to a long, random secret.
