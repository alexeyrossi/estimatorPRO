# Opus Review Prompts

Tailored for this repo:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind 4
- Supabase SSR auth + estimate history
- internal-only estimator with protected engine behavior

## Recommended Prompt

Use this for the default whole-repo audit.

```text
Act as a very senior Cupertino-level engineer reviewing this repository with high standards for product quality, correctness, and operational safety.

Constraints:
- Read-only review only.
- Do not modify files.
- Do not run formatters that rewrite files.
- Do not install dependencies.
- Do not use networked tools.
- Do not update regression baselines or snapshots.
- Treat this as an internal production tool, not a demo.

Repo context:
- Next.js 16 App Router, React 19, TypeScript, Tailwind 4.
- Supabase SSR handles auth/session and estimate-history storage.
- This is an internal moving-estimate tool.
- Anonymous users must not reach working estimate flows.
- Auth must be enforced in server actions, not only route middleware/proxy.
- Estimate engine behavior is protected by unit tests and a regression corpus.
- Engine math/tables are business-sensitive; do not recommend changing them unless you find a concrete bug, invariant break, or test/spec contradiction.

Review scope:
- Whole repository, not just a diff.
- Prioritize real defects over style.
- Look especially at:
  - auth/session handling and fail-open risk
  - route protection vs server-action protection
  - Supabase assumptions, manager isolation, and data exposure
  - input sanitization, trust boundaries, and persistence of saved state
  - parser/engine invariants and raw-vs-normalized behavior drift
  - stale draft, hydration, reducer, and client/server divergence
  - report/PDF/export correctness if user-visible
  - test gaps around risky logic

Read-only commands allowed if useful:
- npm run lint
- npm run test
- npm run build
- optionally npm run bench:hotpath if it helps validate a concern

Output format:
1. Findings first, ordered by severity.
2. Then test gaps and weak spots.
3. Then open questions/assumptions.
4. Then a 5-line executive summary.

Rules for findings:
- Only report issues you can defend technically.
- Prefer fewer, higher-confidence findings over many speculative ones.
- Each finding must include:
  - severity: critical / high / medium / low
  - title
  - why it matters in production
  - evidence with exact file:path:line references
  - concrete failure mode or regression risk
  - minimal fix direction, no patch

If no findings:
- Say "No material findings."
- Still list residual risks and missing validation.
- Respond in Russian.
```

## Alternate Prompt: Fast Review

```text
Act as a very senior Apple-caliber staff engineer doing a strict code review of this repository. Do not modify any files. Do not suggest style nits unless they hide real risk.

Review the whole repo as it exists now. Focus on correctness, security, auth boundaries, data integrity, runtime failures, broken assumptions, edge cases, and missing tests.

You may read files and run read-only checks, but do not write, format, install, migrate, or update snapshots/baselines.

Output only:
1. Findings, ordered by severity.
2. Open questions.
3. Brief summary.

For each finding include: severity, short title, why it matters, exact file path and line(s), and the smallest credible fix direction. If no findings, say so explicitly and list residual risks.
```

## Alternate Prompt: Risk-First Review

```text
Review this repo like a hard-nosed principal engineer preparing it for internal production use. No edits. No style commentary. Hunt only for bugs, auth holes, data leaks, invariant violations, and missing safeguards.

You may run read-only checks. Do not write files or update any baselines.

Return:
1. Top risks only.
2. Why each risk is credible.
3. Exact file:line references.
4. What should be tested next.

If evidence is weak, do not report it.
```

## Defaults

- Review target: whole repo on `main`
- Allowed commands: `npm run lint`, `npm run test`, `npm run build`, optional `npm run bench:hotpath`
- Forbidden actions: edits, formatting writes, installs, migrations, baseline or snapshot updates
- Output language: Russian
- Review style: findings first, evidence-based, no fluff
