# Estimator

Internal moving-estimate tool on Next.js App Router + Supabase SSR.

## What it does

- parses raw inventory text
- runs proprietary estimate engine on server only
- lets signed-in internal users review/admin-adjust quotes
- saves estimate history per manager

## Core rules

- engine math/tables are off-limits unless explicitly requested
- this tool is internal only
- all signed-in users can access admin/override UI
- anonymous users should not reach working estimate flows

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind 4
- Supabase SSR auth/storage

## Env

Create `.env.local` from `.env.example`.

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Runtime env validation now fails fast if either is missing.

## Local run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality gates

```bash
npm run lint
npm test
npm run build
npm run bench:hotpath
```

## Test layout

- `tests/unit/*.test.mjs` small boundary/state/helper tests
- `tests/regression/cases/*.json` quote behavior corpus
- `tests/regression/cases/gold-*.json` business-critical baselines

Regression rule:

- add new real quote patterns as case files
- do not update baselines unless behavior change is intentional
- gold updates require explicit allow flag

## Architecture

- `lib/engine/*`: estimate engine pipeline
- `lib/estimatePolicy.ts`: shared boundary policy for client + server
- `app/actions/estimate.ts`: server actions
- `components/dashboard/*`: dashboard container/header/history UI
- `lib/estimateReport.ts` + `lib/estimatePdf.ts`: export logic

## Supabase

See [docs/supabase.md](/Users/alexrossi/Desktop/codex-estimator3-5/docs/supabase.md).

## CI

CI workflow lives at [`.github/workflows/ci.yml`](/Users/alexrossi/Desktop/codex-estimator3-5/.github/workflows/ci.yml) and should run:

- lint
- test
- build

## Notes for future changes

- protect engine behavior with regression corpus first
- keep auth checks inside server actions, not only route middleware
- keep boundary rules centralized in `lib/estimatePolicy.ts`
