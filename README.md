# fluch-react-signals-starter

Opinionated React 19 SPA template — **Vite + TypeScript + Tailwind v4 + shadcn (Base UI variant) + @preact/signals-react + React Router 7**.

Built as a fork-friendly starting point for AI-driven UI work: signals replace most `useState` boilerplate, shadcn components are vendored under `src/components/ui`, and CI blocks merges on lint / typecheck / test / audit / build.

## Stack

| Layer        | Choice                                           |
| ------------ | ------------------------------------------------ |
| Build        | Vite 8                                           |
| Language     | TypeScript 6                                     |
| UI           | React 19                                         |
| Styling      | Tailwind CSS v4 (oklch tokens, `@theme` block)   |
| Components   | shadcn — Base UI variant (`@base-ui/react`)      |
| State        | `@preact/signals-react` + Babel auto-transform   |
| Routing      | React Router 7 (data router, SPA mode)           |
| Lint/Format  | Biome 2                                          |
| Tests        | Vitest 4 + Testing Library + happy-dom           |
| Git hooks    | Husky + lint-staged                              |
| CI           | GitHub Actions — 5 parallel jobs                 |

## Quickstart

```sh
pnpm install
pnpm dev          # http://localhost:5173 — opens on /showcase
```

Requires **Node ≥ 22** and **pnpm ≥ 9** (versions pinned via [.nvmrc](.nvmrc) and `packageManager` in [package.json](package.json)).

## Scripts

| Command            | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Vite dev server with HMR                          |
| `pnpm build`       | `tsc -b && vite build` — production bundle        |
| `pnpm preview`     | Serve the production build locally                |
| `pnpm test`        | Run Vitest once                                   |
| `pnpm test:watch`  | Vitest in watch mode                              |
| `pnpm test:ui`     | Vitest with the browser UI                        |
| `pnpm typecheck`   | `tsc -b --noEmit`                                 |
| `pnpm lint`        | `biome ci` — no auto-fix, used by CI              |
| `pnpm check`       | `biome check --write .` — auto-fix locally        |
| `pnpm format`      | `biome format --write .`                          |

## Project structure

```text
src/
├── components/ui/   # 55 shadcn (Base UI variant) components — vendored
├── hooks/           # custom React hooks
├── layouts/         # shared layout shells (RootLayout, etc.)
├── lib/             # utilities (cn, …)
├── pages/           # route components (showcase/)
├── styles/          # Tailwind entry + design tokens
├── test/            # Vitest setup + test files
├── App.tsx          # app root (wraps the router)
├── main.tsx         # ReactDOM bootstrap + signals runtime
└── router.tsx       # React Router 7 route definitions
```

## Signals

`@preact/signals-react` is wired through a Babel plugin (`@preact/signals-react-transform`) so components react to signal reads **without** needing the `useSignals()` hook. See [vite.config.ts](vite.config.ts) for the plugin order — `babel` must run **before** `react`.

```tsx
import { signal } from "@preact/signals-react"

const count = signal(0)

export function Counter() {
  return <button onClick={() => count.value++}>{count}</button>
}
```

## CI

`.github/workflows/ci.yml` runs five parallel jobs on every push to `main` and every pull request:

- `lint` — Biome
- `typecheck` — TypeScript
- `test` — Vitest
- `audit` — `pnpm audit --audit-level=high`
- `build` — full production build

Concurrency is set so that a new commit on the same ref cancels the previous run.

## Specs & roadmap

- [SPEC.md](SPEC.md) — full template specification
- [STORIES.md](STORIES.md) — the eleven user stories that produced this repo
- [designs/active.md](designs/active.md) — placeholder for the active design system (overwritten by the `apply-theme` skill)

## Fork this template

This repo is published as a **GitHub template** — click *Use this template* (or `gh repo create --template …`) to start a new project from it. After cloning your fork:

```sh
pnpm install
pnpm dev
```

…and start replacing the showcase page with your own routes.

## License

MIT.
