# SOMAS Frontend V Backend Integration Plan

## Goal
Implement the existing backend integration from `somas_frontend/` inside `somas_frontend_v/` while preserving the current `somas_frontend_v/` UI as much as possible.

## Short Answer
- A large part of the current backend can be integrated into `somas_frontend_v/` without changing the UI.
- The best-fit areas are authentication, dashboard, campaigns, beneficiaries, transactions, savings, and some settings flows.
- Several admin screens in `somas_frontend_v/` do not appear to have matching backend support yet, so they should be deferred, kept read-only, or treated as placeholders until APIs exist.

## Current State

### Backend-ready app: `somas_frontend/`
Reuse these patterns and modules:
- API client: `somas_frontend/src/lib/api/client.ts`
- token storage: `somas_frontend/src/lib/auth/token-storage.ts`
- auth bootstrap and session state: `somas_frontend/src/lib/auth/auth-context.tsx`
- query provider: `somas_frontend/src/app/providers/query-provider.tsx`
- app provider wiring: `somas_frontend/src/app/providers/app-provider.tsx`
- feature APIs:
  - `somas_frontend/src/features/auth/api/auth-api.ts`
  - `somas_frontend/src/features/campaigns/api/campaigns-api.ts`
  - `somas_frontend/src/features/dashboard/api/dashboard-api.ts`
  - `somas_frontend/src/features/field/api/field-api.ts`
  - `somas_frontend/src/features/users/api/users-api.ts`

### UI prototype app: `somas_frontend_v/`
This app has the preferred UI, but most screens are still local-only:
- no app-level API client
- no token persistence
- no auth bootstrap
- no query or mutation layer
- many screens use hardcoded arrays and local state

Examples:
- simulated login: `somas_frontend_v/src/app/components/backoffice/login.tsx`
- mock dashboard data: `somas_frontend_v/src/app/components/backoffice/dashboard.tsx`
- mock campaigns list: `somas_frontend_v/src/app/components/backoffice/campaigns.tsx`
- mock campaign creation flow: `somas_frontend_v/src/app/components/backoffice/create-campaign.tsx`
- mock field search: `somas_frontend_v/src/app/components/field/search.tsx`

## Feasibility

### Can integrate now with the current backend
- backoffice login
- field login
- current-user session handling
- dashboard metrics
- campaign list and campaign detail
- campaign creation and some campaign actions
- beneficiary list and beneficiary detail
- transaction list and transaction detail
- savings program list and detail
- field beneficiary search and confirmation flows
- parts of settings backed by existing auth and catalog APIs

### Can integrate with adapter work
- `somas_frontend_v` labels and routes that do not exactly match backend naming
- screens that expect richer analytics than the current backend returns
- forms that currently assume UI-only data structures and need mapping to backend payloads
- field flows that are beneficiary-centric in the UI but campaign-beneficiary-centric in the backend

### Not clearly supported by the current backend surface
- reports
- audit
- system events
- SMS templates
- tenant settings
- session management
- security overview
- auth activity
- account status demo
- roles and permissions as full standalone pages

These exist in `somas_frontend_v/src/app/routes.tsx`, but they do not map cleanly to the backend-backed pages currently implemented in `somas_frontend/`.

## Route-by-Route Assessment

| `somas_frontend_v` route | Status | Notes |
| --- | --- | --- |
| `/` | Ready | Gateway only. |
| `/backoffice/login` | Ready | Replace simulated auth with `loginBackoffice`. |
| `/backoffice/forgot-password` | Ready | Can use existing auth API. |
| `/backoffice/reset-password` | Ready | Can use existing auth API. |
| `/backoffice/dashboard` | Ready | Wire dashboard endpoints and map data to cards and charts. |
| `/backoffice/campaigns` | Ready | Existing backend-backed campaign list already exists. |
| `/backoffice/campaigns/create` | Adapter | Keep UI flow, replace mock upload and submission with real APIs. |
| `/backoffice/campaigns/:id` | Ready | Existing detail and progress endpoints can support this. |
| `/backoffice/savings` | Adapter | Likely maps to savings programs; naming and shape alignment needed. |
| `/backoffice/savings/create` | Adapter | Likely possible, but form payloads need review. |
| `/backoffice/savings/:id` | Adapter | Detail wiring likely possible with translation helpers. |
| `/backoffice/beneficiaries` | Ready | Existing beneficiary APIs and pages exist. |
| `/backoffice/beneficiaries/profile/:id` | Ready | Existing detail flow likely reusable. |
| `/backoffice/beneficiaries/form/:id` | Adapter | Can likely support create and edit, but schema may differ. |
| `/backoffice/field-verification` | Adapter | Backend is campaign-beneficiary based, not purely beneficiary based. |
| `/backoffice/transactions` | Ready | Existing transaction APIs and pages exist. |
| `/backoffice/disbursements` | Adapter | May be composable from transaction and campaign data. |
| `/backoffice/metrics` | Ready | Can share dashboard or insights data if UX expectations align. |
| `/backoffice/insights` | Ready | Existing insights endpoints exist. |
| `/backoffice/reports` | Unsupported today | No clear backend-backed equivalent found. |
| `/backoffice/sms-templates` | Unsupported today | No matching backend-backed flow found. |
| `/backoffice/users` | Partial | User creation and admin actions exist, but not a full directory. |
| `/backoffice/roles` | Partial | Some role mutation support exists, but not a full dedicated page. |
| `/backoffice/permissions` | Partial | Similar to roles. |
| `/backoffice/audit` | Unsupported today | No clear backend-backed equivalent found. |
| `/backoffice/system-events` | Unsupported today | No clear backend-backed equivalent found. |
| `/backoffice/activity` | Unsupported today | No clear backend-backed equivalent found. |
| `/backoffice/settings` | Partial | Existing backend supports auth actions and catalog admin, not full tenant admin. |
| `/backoffice/tenant-settings` | Unsupported today | No clear backend-backed equivalent found. |
| `/backoffice/sessions` | Unsupported today | No clear backend-backed equivalent found. |
| `/backoffice/security-overview` | Unsupported today | No clear backend-backed equivalent found. |
| `/backoffice/auth-activity` | Unsupported today | No clear backend-backed equivalent found. |
| `/backoffice/account-status-demo` | Unsupported today | Demo-only surface. |
| `/field/login` | Ready | Can wire to `loginField`. |
| `/field/dashboard` | Adapter | UI likely needs data shaping from existing field or dashboard metrics. |
| `/field/search` | Adapter | Backend search requires campaign context today. |
| `/field/status` | Adapter | Depends on offline and sync state design. |
| `/field/beneficiary/:id` | Adapter | Existing backend uses campaign plus campaignBeneficiary identifiers. |

## Main Technical Blockers

### 1. Missing hidden integration layer in `somas_frontend_v/`
Before wiring real data into screens, `somas_frontend_v/` needs shared API, auth, token storage, query or mutation state, protected-route behavior, and loading or error conventions.

### 2. Data-shape mismatch between UI and backend
`somas_frontend_v` screens use display-friendly mock objects, while `somas_frontend/` contracts are more domain-specific. We should add adapter helpers that translate backend responses into the shapes expected by the current UI.

### 3. Product-surface mismatch
Some `somas_frontend_v` pages represent features that do not appear to exist in the current backend-backed app. Those should be deferred, made read-only, or hidden from the first integrated release.

### 4. Internal route gaps in `somas_frontend_v/`
Some components navigate to routes that are not defined yet, including edit flows referenced from `somas_frontend_v/src/app/components/backoffice/campaigns.tsx` and `somas_frontend_v/src/app/components/backoffice/savings.tsx`.

## Recommended Delivery Strategy

### Phase 1: Foundation
- add API client modeled after `somas_frontend/src/lib/api/client.ts`
- add token storage and auth context
- add query provider and app-level provider wiring
- add route guards for backoffice and field sections
- add shared API error handling

### Phase 2: Core flows
- backoffice login
- field login
- dashboard
- campaigns list and detail
- beneficiaries list and detail
- transactions list

### Phase 3: Mutations and forms
- create campaign
- create or edit beneficiary
- savings creation flows
- password reset and account actions
- field confirmation and sync

### Phase 4: Non-core admin surfaces
Review unsupported routes and choose whether to build backend support, simplify UI scope, or keep placeholders outside MVP.

## Proposed MVP Scope
Commit to:
- authentication
- dashboard
- campaigns
- beneficiaries
- transactions
- savings programs
- field search and confirmation
- backend-supported settings actions

Explicitly defer:
- reports
- audit
- system events
- SMS templates
- tenant settings
- sessions
- advanced security pages

## Implementation Rules
- preserve existing visual layout and styling in `somas_frontend_v/`
- move data logic into hooks, adapters, and API modules
- avoid large rewrites of current UI components
- add loading, error, and empty states inside current layouts rather than redesigning them
- keep new modules small and feature-scoped

## First Build Tasks
1. Add auth, token, and API infrastructure to `somas_frontend_v/`.
2. Wire `backoffice/login` and `field/login` to the real backend.
3. Wire dashboard queries using backend adapters.
4. Replace mock campaigns list and detail data.
5. Replace mock beneficiary and transaction data.
6. Decide which unsupported admin routes stay visible in the first integrated version.

## Decision Needed Before Coding Deeply
- Option A: integrate only backend-supported screens and defer the rest.
- Option B: keep every route visible, but mark unsupported pages as placeholder or read-only.
- Option C: expand backend scope before integrating `somas_frontend_v/` broadly.

## Recommendation
Start with Option A. It gives us the fastest path to a real product using the preferred UI, avoids fake functionality, and preserves most of the current `somas_frontend_v/` interface while grounding it in the existing backend.
