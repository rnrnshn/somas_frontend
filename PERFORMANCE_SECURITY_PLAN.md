# Performance, Security, and Best Practices Plan

## Goal

Capture the highest-impact improvements identified from the repo review so we can resume this work later without redoing the analysis.

## Priority Order

1. Eliminate query waterfalls on campaign, dashboard, and beneficiary screens.
2. Fix overly aggressive React Query refetch behavior on expensive queries.
3. Move auth token storage away from `localStorage` if backend support exists.
4. Reduce sensitive offline data stored in `localStorage`.
5. Reduce heavy chart bundle cost on analytics screens.
6. Remove unused dependencies and tighten environment defaults.

## Findings

### 1. Campaign and dashboard query waterfalls

Impact: High

Files:
- `src/app/components/backoffice/campaigns.tsx`
- `src/app/components/backoffice/dashboard.tsx`
- `src/features/campaigns/hooks/use-campaign-queries.ts`
- `src/features/campaigns/api/campaigns-api.ts`
- `src/features/transactions/api/transactions-api.ts`

Problem:
- The campaigns table fetches a list, then fans out into per-campaign detail queries and per-campaign summary queries.
- Each summary query fetches all beneficiaries and all transactions for that campaign.
- Pagination helpers fetch pages sequentially in loops.
- The dashboard repeats the same client-side summary pattern.

Why it matters:
- This creates N+1 request patterns and large client-side aggregation work.
- Performance degrades sharply as campaign count grows.

Recommended fix:
- Add backend summary endpoints for campaign table rows and dashboard campaign performance.
- Return aggregated fields directly in list responses where possible.
- Remove client-side per-row summary reconstruction once server data is available.

Implementation steps:
1. Confirm backend can return campaign summary fields in list/detail APIs.
2. Replace `useCampaignTableSummaryQueries` usage in `campaigns.tsx`.
3. Replace dashboard campaign summary fan-out in `dashboard.tsx`.
4. Delete obsolete client aggregation helpers if no longer needed.

### 2. Beneficiaries page N+1 cascade

Impact: High

Files:
- `src/app/components/backoffice/beneficiaries.tsx`
- `src/features/beneficiaries/hooks/use-beneficiary-queries.ts`
- `src/features/field/api/field-api.ts`

Problem:
- The beneficiary list fetches base rows, then 2 extra queries per beneficiary.
- The field verification tab can add another request per campaign row.
- With `pageSize: 100`, this can become hundreds of requests for one screen.

Why it matters:
- This is likely the worst screen in the app for network overhead and UI latency.

Recommended fix:
- Introduce a server endpoint that returns the exact row shape needed for the directory table.
- Introduce a dedicated field verification list endpoint instead of assembling it from many detail calls.
- Avoid per-row query composition in the component.

Implementation steps:
1. Define required table fields for directory and verification views.
2. Add dedicated query hooks backed by flattened endpoints.
3. Remove `useBeneficiaryRowQueries` from the list screen.
4. Remove per-row verification `useQueries` fan-out.

### 3. Expensive queries refetch too aggressively

Impact: High

Files:
- `src/features/campaigns/hooks/use-campaign-queries.ts`
- `src/app/providers/query-provider.tsx`
- `src/lib/constants/query.ts`

Problem:
- Campaign queries use `refetchOnMount: 'always'` and `refetchOnWindowFocus: true`.
- These settings are applied even though the same queries already have meaningful `staleTime` values.

Why it matters:
- The app replays expensive requests during remounts and tab focus events.
- This multiplies the cost of existing query waterfalls.

Recommended fix:
- Default expensive queries back to cache-aware behavior.
- Only opt into forced refetch where the screen truly requires it.

Implementation steps:
1. Remove `refetchOnMount: 'always'` from campaign list/detail/summary queries unless justified.
2. Remove `refetchOnWindowFocus: true` for expensive query groups.
3. Re-test create/update flows to ensure invalidations still refresh data correctly.

### 4. Auth tokens stored in localStorage

Impact: High

Files:
- `src/lib/auth/token-storage.ts`
- `src/lib/auth/auth-context.tsx`

Problem:
- Access tokens are stored in `window.localStorage`.
- Full user data is also cached in `localStorage`.

Why it matters:
- Any successful XSS would expose the bearer token immediately.

Recommended fix:
- Prefer `HttpOnly`, `Secure`, `SameSite` cookies managed by the backend.
- Keep only minimal non-sensitive client state locally.

Implementation steps:
1. Confirm backend can issue secure cookie-based auth.
2. Update auth API/client behavior to rely on cookies.
3. Remove token persistence from `token-storage.ts`.
4. Minimize or remove persisted user object storage.

### 5. Offline queue stores sensitive data in localStorage

Impact: Medium

Files:
- `src/features/field/lib/offline-queue.ts`
- `src/features/field/types/field.ts`

Problem:
- Offline drafts store beneficiary names, coordinates, timestamps, and media URLs in plaintext local storage.
- There is no expiry, cleanup policy, or schema/version validation beyond the key name.

Why it matters:
- Shared or lost devices can expose sensitive field data.

Recommended fix:
- Store only the minimum data needed to resume sync.
- Add version validation and expiry handling.
- Consider IndexedDB if the payload grows or needs better control.

Implementation steps:
1. Review which fields are strictly required for offline sync.
2. Remove unnecessary persisted fields.
3. Add schema/version validation on read.
4. Add expiry or age-based cleanup.

### 6. Chart-heavy routes still have large bundles

Impact: Medium

Files:
- `src/app/components/backoffice/dashboard.tsx`
- `src/app/components/backoffice/insights.tsx`
- `src/app/components/ui/chart.tsx`

Problem:
- The production build shows very large chart-related chunks, especially around Recharts.

Why it matters:
- Dashboard and insights screens are slower to load and parse once opened.

Recommended fix:
- Keep chart-heavy views lazily loaded.
- Consider dynamic import boundaries inside analytics routes for heavy chart sections.
- Reduce unused chart primitives and duplicated chart wrappers where possible.

Implementation steps:
1. Measure which charts are actually used on first paint.
2. Split non-critical chart sections behind lazy boundaries.
3. Review whether some charts can be simplified or deferred.

### 7. Unused dependencies increase maintenance and audit surface

Impact: Medium

Files:
- `package.json`

Problem:
- MUI packages appear in dependencies but are not imported in `src/`.

Why it matters:
- Unused packages increase install time, upgrade burden, and security audit noise.

Recommended fix:
- Remove dependencies that are no longer used.

Implementation steps:
1. Confirm `@mui/*` is truly unused.
2. Remove unused packages.
3. Reinstall and rebuild.

### 8. API base URL fallback is too permissive

Impact: Low

Files:
- `src/lib/api/client.ts`

Problem:
- The app silently falls back to `http://localhost:3333` when `VITE_API_BASE_URL` is missing.

Why it matters:
- This is acceptable for local dev, but it is safer to fail fast outside development.

Recommended fix:
- Restrict the fallback to development mode or throw when the env var is missing in non-dev environments.

Implementation steps:
1. Gate the localhost fallback behind development checks.
2. Throw a clear error in non-dev if the base URL is missing.

## Suggested Execution Plan

### Phase 1: Highest impact

1. Replace campaign table and dashboard client-side summary fan-out.
2. Replace beneficiary list and field verification fan-out.
3. Remove forced refetch settings from expensive query groups.

### Phase 2: Security hardening

1. Move auth off `localStorage` if backend support exists.
2. Minimize offline queue payload and add expiry/schema validation.
3. Tighten API base URL handling.

### Phase 3: Bundle and maintenance cleanup

1. Split or defer heavy chart sections.
2. Remove unused dependencies.
3. Rebuild and compare chunk sizes.

## Validation Checklist

- `npm run build`
- Verify campaigns list still loads correctly.
- Verify dashboard metrics and campaign performance still match backend data.
- Verify beneficiaries directory and field verification tabs still behave correctly.
- Verify create/edit/status update flows still invalidate and refresh correctly.
- Verify login/logout/session bootstrap behavior after auth storage changes.
- Verify field offline sync still works after queue changes.

## Notes

- This repo is a Vite React app, not a Next.js app, so the Vercel guidance was applied as general React performance guidance.
- The highest-value work is reducing request count and removing client-side aggregation, not adding more memoization.
- `npm run build` was successful at the time of this review.
