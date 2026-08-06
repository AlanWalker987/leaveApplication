# Leave Management System Monorepo Scaffold

Production-ready monorepo foundation for a Leave Management System.

This repository provides architecture, project setup, and scalable folder organization only.
It intentionally excludes business logic, authentication flows, feature implementation, UI pages/design systems, mock data, and API domain behavior.

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (configuration scaffold)
- Custom theme and custom font placeholders
- Apollo Client and urql setup placeholders
- GraphQL Code Generator ready
- ESLint and Prettier

### Backend

- NestJS
- GraphQL (Code First scaffold)
- Apollo Server integration scaffold
- PostgreSQL
- Prisma ORM
- Config Module
- Global ValidationPipe
- Docker support

### Monorepo

- Turborepo
- pnpm workspaces

## Architecture

- apps/web: Next.js application shell and frontend structure.
- apps/api: NestJS API shell and backend structure.
- packages/ui: shared UI package (shadcn-oriented placeholders, theme, typography, providers).
- packages/config: shared lint/format/typescript config assets.
- packages/graphql: shared GraphQL artifacts and codegen setup placeholders.
- packages/types: shared DTO/interface/enum placeholder contracts.
- packages/utils: shared utility placeholder exports.
- docker: future container runtime assets by service.
- scripts: repository-level setup and automation scripts.
- .github/workflows: CI pipeline placeholders.

## Repository Structure

```text
.
├── apps/
│   ├── web/                      # Next.js application scaffold
│   │   ├── app/                  # App Router entry layout/page only
│   │   ├── components/           # Web-only components placeholder
│   │   ├── features/             # Feature module placeholders
│   │   ├── graphql/              # Client operations/codegen placeholders
│   │   ├── hooks/                # Custom hooks placeholder
│   │   ├── providers/            # App provider composition placeholder
│   │   ├── layouts/              # Reusable layout shell placeholder
│   │   ├── styles/               # Styling architecture placeholder
│   │   ├── fonts/                # Custom fonts placeholder
│   │   ├── lib/                  # Client libraries setup (Apollo/urql)
│   │   ├── config/               # Web runtime config placeholder
│   │   ├── types/                # Web-specific types placeholder
│   │   └── utils/                # Web utility placeholder
│   └── api/                      # NestJS application scaffold
│       ├── src/
│       │   ├── modules/          # Feature module placeholders
│       │   ├── common/           # Shared backend abstractions placeholder
│       │   ├── config/           # Typed config placeholder
│       │   ├── database/         # DB bootstrap/service placeholder
│       │   ├── graphql/          # GraphQL setup placeholders
│       │   ├── guards/           # Guard placeholders
│       │   ├── interceptors/     # Interceptor placeholders
│       │   ├── decorators/       # Decorator placeholders
│       │   ├── filters/          # Filter placeholders
│       │   ├── middleware/       # Middleware placeholders
│       │   ├── pipes/            # Pipe placeholders
│       │   └── providers/        # Provider placeholders
│       └── prisma/
│           ├── schema.prisma     # Prisma datasource/generator only
│           └── migrations/       # Migration directory placeholder
├── packages/
│   ├── ui/                       # Shared UI package placeholders
│   ├── config/                   # Shared ESLint/TSConfig/Prettier
│   ├── graphql/                  # Shared GraphQL artifacts/codegen
│   ├── types/                    # Shared DTOs/interfaces/enums
│   └── utils/                    # Shared helper placeholders
├── scripts/                      # Setup/automation scripts
├── .github/
│   └── workflows/                # CI workflow placeholders
├── .vscode/                      # Workspace editor settings
├── docker-compose.yml            # PostgreSQL + volumes + network
├── turbo.json                    # Turborepo task graph
└── pnpm-workspace.yaml           # Workspace package mapping
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker Desktop (for PostgreSQL)

### Installation

```bash
pnpm install
```

### Configure Environment Files

Create app-specific env files:

```bash
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local
```

### Start Infrastructure

```bash
docker compose up -d
```

Default local PostgreSQL host port is `5433` in this setup.

### Start Development Apps

```bash
pnpm dev
```

## Useful Scripts

- pnpm dev: run all app dev tasks through Turborepo.
- pnpm build: build all workspace targets.
- pnpm lint: lint all workspace targets.
- pnpm typecheck: run TypeScript checks across the workspace.
- pnpm format: check formatting.
- pnpm format:write: apply formatting.

## Environment Variables

Use separate env files per app:

- apps/api/.env (copy from apps/api/.env.example)
- apps/web/.env.local (copy from apps/web/.env.example)

API env includes:

- Database URL
- JWT placeholders
- API port

Web env includes:

- NEXT_PUBLIC_GRAPHQL_ENDPOINT

## GraphQL Readiness

Scaffold includes:

- Apollo Client placeholder configuration.
- urql client placeholder configuration.
- GraphQL Code Generator placeholders in apps/web and packages/graphql.

No schema, resolver, mutation, query, subscription logic, or domain operations are implemented.

## CI Readiness

GitHub Actions placeholder pipeline:

- install dependencies
- lint
- typecheck
- build

## Future Modules (Placeholders)

- Employee Module
- Department Module
- Leave Module
- Approval Module
- Holiday Module
- Attendance Module
- Notification Module
- Audit Logs
- Reports
- Roles
- Permissions
- Dashboard

## Notes

This is a foundation scaffold for enterprise-scale evolution. Expand each placeholder boundary by module while preserving package and architectural separation.
