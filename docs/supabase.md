# Supabase assumptions

This project assumes Supabase is used for:

- auth/session via `@supabase/ssr`
- estimate history storage

## Expected table

Table: `estimates`

Suggested columns:

- `id` uuid primary key
- `manager_id` uuid not null
- `client_name` text not null
- `final_volume` numeric null
- `net_volume` numeric null
- `truck_space_cf` numeric null
- `inputs_state` jsonb not null
- `created_at` timestamptz default now()

## `inputs_state` shape

JSON payload is expected to contain:

- `inputs`
- `normalizedRows`
- `inventoryMode`
- `overrides`

## RLS assumption

Internal rule:

- signed-in users can use estimate/admin flows
- history rows are still isolated per manager

Recommended policy shape:

- `select/update/delete` only where `manager_id = auth.uid()`
- `insert` only where `manager_id = auth.uid()`

## App expectation

App code assumes:

- save/load/delete/history filter by `manager_id`
- auth session is available in middleware/proxy and server actions
- missing auth should fail closed
