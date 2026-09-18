# Architecture — Grab The Deals

## Layers

1. Domain (`features/*/domain/`) — Pure TypeScript, zero deps
2. Data (`features/*/data/`) — Repositories + Adapters
3. Store (`features/*/store/`) — Zustand using Repositories
4. UI (`features/*/screens/`, `components/`) — React

## Data Flow

UI → Store → Repository (interface) → Adapter (localStorage / future: Supabase)

## Adding a New Feature

1. `domain/entities/` — Entity interfaces
2. `domain/rules/` — Pure business rules
3. `domain/index.ts` — Barrel
4. `data/repositories/<Name>Repository.ts` — Interface
5. `data/adapters/LocalStorage<Name>Adapter.ts` — Implementation
6. `store/<name>.slice.ts` — Zustand using Repository

## Swapping Storage

To switch from localStorage to Supabase:
- Build `Supabase<Name>Adapter.ts` implementing the same Repository interface.
- Change ONE line in the store: `new SupabaseAdapter()` instead of `new LocalStorageAdapter()`.
- No other changes.

## Rules

- Domain MUST be pure TypeScript.
- Repositories MUST be interfaces.
- Stores MUST use Repositories.
- Adapters are swappable.
