# Leave Management System - Design Document

## Objective

Generate and maintain a production-ready full-stack monorepo scaffold for the Leave Management System, focused on architecture and setup.

## Project Name

Leave Management System

## Important Constraints

- Do not implement business logic.
- Do not implement authentication.
- Do not implement leave management features.
- Do not generate UI pages or designs.
- Do not create mock data.
- Do not create API resolvers or services.
- Do not write application code beyond minimum framework boilerplate required to run.
- There is currently no Figma or UI design available.
- Focus only on architecture, project setup, folder organization, configuration, and reusable boilerplate.

## Tech Stack

### Frontend

- Next.js (latest App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Custom theme support
- Custom fonts
- Apollo Client
- urql
- GraphQL Code Generator ready
- ESLint
- Prettier

### Backend

- NestJS
- GraphQL (Code First)
- Apollo Server
- PostgreSQL
- Prisma ORM
- Config Module
- ValidationPipe
- Docker support

### Database

- PostgreSQL
- Docker Compose

### Monorepo

- Turborepo
- pnpm workspaces

## Shared Packages

```text
packages/
  ui/
    Shared shadcn components
    Theme
    Typography
    Providers

  config/
    Shared ESLint
    Shared TSConfig
    Shared Prettier

  graphql/
    Shared GraphQL types
    Fragments
    Generated Types
    Queries
    Mutations
    Subscriptions

  types/
    Shared DTOs
    Shared interfaces
    Shared enums

  utils/
    Shared helpers
```

## Applications

```text
apps/
  web/
    Next.js application

  api/
    NestJS application
```

## Repository Structure

```text
apps/
packages/
scripts/
.github/
turbo.json
pnpm-workspace.yaml
docker-compose.yml
README.md
```

## Frontend Structure

Include folders for:

```text
app/
components/
features/
graphql/
hooks/
providers/
layouts/
styles/
fonts/
lib/
config/
types/
utils/
```

Create only placeholder files where necessary.

## Backend Structure

Include folders for:

```text
src/
  modules/
  common/
  config/
  database/
  graphql/
  guards/
  interceptors/
  decorators/
  filters/
  middleware/
  pipes/
  providers/
```

Each module should contain only placeholder files.

## Prisma

Create:

```text
prisma/
  schema.prisma
  migrations/
```

No models yet.

## GraphQL

Prepare the project for:

- Apollo
- urql
- GraphQL Code Generator

Do not create any schema. Only configuration placeholders.

## Docker

Create `docker-compose.yml` with:

- PostgreSQL
- volumes
- network

## Environment

Create `.env.example` for:

- Database URL
- JWT placeholders
- GraphQL endpoint
- Application URLs
- Ports

## Configuration

Setup:

- TypeScript
- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint
- EditorConfig
- Turbo configuration
- Workspace configuration
- VSCode settings

## CI Ready

Create `.github/workflows/` with placeholder CI pipeline.

## README Requirements

Generate a professional README including:

- Project overview
- Architecture
- Folder structure
- Getting started
- Scripts
- Environment variables
- Future modules

## Expected Future Features (Placeholders)

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

## Existing Application Details

### Roles

- Admin
- Manager
- Employee

## Role-Based Navigation and Views

### Admin

#### Side Menu

- Availed
- Status
- Leave Approval
- Admin Console
- Admin Reports

#### Views and Pages

- Leaves Availed: who all took the leaves
- Leaves Status: details of individual leave status
- Leave Approval: pending, approved, rejected

#### Admin Console Pages

- Users
- Vendors
- Branches
- Public Holidays
- Leave Types

#### Admin Reports

- Leaves Availed
- Leave Status

### Manager

#### Side Menu

- Leaves Availed
- Leaves Status
- Leave Approval

#### Views and Pages

- Leaves Availed: who all took the leaves
- Leaves Status: details of individual leave status
- Leave Approval: pending, approved, rejected

### Employee

#### Side Menu

- Apply Leave
- Status
- Leave Approval

#### Views and Pages

- Leaves Availed: who all took the leaves
- Leaves Status: details of individual leave status
- Leave Approval: pending, approved, rejected

## Database Tables (Planned)

### Users

- id
- displayName
- email
- role
- branchId
- vendorId
- managerId
- createdAt
- updatedAt
- isDeleted

### Branches

- id
- code
- name
- location
- createdAt
- updatedAt
- isDeleted

### Vendors

- id
- name
- contactName
- contactEmail
- contactPhone
- createdAt
- updatedAt
- isDeleted

### PublicHolidays

- id
- holidayDate
- title
- createdAt
- updatedAt
- isDeleted

### LeaveTypes

- id
- code
- description
- createdAt
- updatedAt
- isDeleted

### LeaveTracker

- id
- userId
- year
- openingLeaveCount
- approvedLeaveCount
- pendingLeaveCount
- cancelledLeaveCount
- rejectedLeaveCount
- createdAt
- updatedAt
- isDeleted

### LeaveApplications

- id
- currentUserId
- approvedUserId
- leaveTypeId
- reason
- fromDate
- toDate
- totalDays
- status
- comments
- createdAt
- updatedAt
- isDeleted

## Seed Data Scope

- Vendors
- Public Holidays
- Leave Types
- Branches

## Final Note

This document is a source-of-truth design and planning artifact for scaffold-first development. Functional implementation should begin only after architecture sign-off and module-level planning.
