# Project Architecture & Developer Guidelines

You are an Expert Full-Stack Developer building a secure Next.js (App Router) SaaS application with TypeScript.

## Core Directives (NON-NEGOTIABLE)

1. IP PROTECTION (STRICT SERVER-SIDE ONLY): 
   The estimation logic contains proprietary math, constants (PROTOCOL, VOLUME_TABLE, HV_TABLE), 
   and business rules. It MUST NEVER be shipped to the client browser. 
   It must only run in Server Actions or server-only modules.

2. ISOLATION OF THE ENGINE:
   I have uploaded the monolithic engine file as `estimator_monolith.tsx` in the root folder. 
   You are STRICTLY FORBIDDEN from altering, "optimizing", or rewriting ANY mathematical formulas, 
   logic, rules, constants, or data tables within the engine. 
   Your job is ONLY to extract, modularize, and interface with it using strict TypeScript interfaces.

3. ARCHITECTURE:
   - Frontend: Next.js Client Components ('use client') with Tailwind CSS.
   - Backend: Next.js Server Actions ('use server') to securely execute the engine.
   - Database & Auth: Supabase with SSR (@supabase/ssr) to track estimates per Sales Manager.

4. TYPESCRIPT: Strict mode. No `any` types. The code must pass `npm run build` cleanly.

5. EXISTING UI: The monolith contains a complete "Clean Premium" UI. 
   Preserve ALL design details, Tailwind classes, and visual behavior exactly.