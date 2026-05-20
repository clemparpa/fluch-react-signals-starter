# Contributing to fluch-react-signals-starter

Thanks for your interest in improving this template! This document covers how to get a working dev environment, the workflow for proposing a change, and the conventions the repo follows.

## Prerequisites

- **Node ≥ 22** (pinned via [.nvmrc](.nvmrc))
- **pnpm ≥ 9** (pinned via `packageManager` in [package.json](package.json))

If you use `nvm`, run `nvm use` once after cloning to pick up the right Node version. If you use `corepack`, `pnpm` will be provisioned automatically when you first run a `pnpm` command in this repo.

## Local setup

```sh
git clone https://github.com/clemparpa/fluch-react-signals-starter.git
cd fluch-react-signals-starter
pnpm install
pnpm dev          # http://localhost:5173 — opens on /showcase
```

The `pnpm install` step also wires up the Husky pre-commit hook (via the `prepare` script). After that, every `git commit` runs `lint-staged` (Biome auto-fix on staged JS/TS/JSON/CSS) and a quick `tsc -b --noEmit` typecheck.

## Workflow

1. **Fork** this repo on GitHub.
2. **Branch** off `main` with a descriptive name:
   ```sh
   git checkout -b feat/short-description
   # or fix/, chore/, docs/, refactor/, test/
   ```
3. **Code**. Keep the change focused — one concern per PR.
4. **Validate locally** with the same five jobs CI runs:
   ```sh
   pnpm lint && pnpm typecheck && pnpm test && pnpm audit --audit-level=high && pnpm build
   ```
   All five must pass. The CI workflow ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs these in parallel on every PR and push to `main`.
5. **Commit** following the convention below.
6. **Open a PR** against `main` using the template ([.github/pull_request_template.md](.github/pull_request_template.md)).

## Commit convention

Two styles coexist in this repo, by intent:

- **Setup stories (S01 → S16)** — format `SXX — <title>`. Used for the bootstrap commits that built the template (visible in `git log`: `0e8b5fa S05 — React Router 7 …`, `d6432a9 S04 — Signals + Babel transform …`). These are append-only — once a story is shipped, its commit lands as-is.
- **Post-release evolutions** — [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
  - `feat:` — new capability
  - `fix:` — bug fix
  - `chore:` — tooling, deps, config (no behavior change)
  - `docs:` — documentation only
  - `refactor:` — code change with no behavior change
  - `test:` — adding or fixing tests

Example: `fix: clear toast queue when route changes`.

## Versioning

This project follows [Semantic Versioning 2.0](https://semver.org/spec/v2.0.0.html). Changes are logged in [CHANGELOG.md](CHANGELOG.md) (format: [Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/)).

- **major** (X.0.0) — breaking template-wide changes (stack swap, removal of a structural dependency). The bar is intentionally high: forks have diverged and forced upgrades are costly.
- **minor** (0.X.0) — new capability (additional tool, new stack layer, new opinionated default).
- **patch** (0.0.X) — bug fix, chore, dependency bump, docs.

Releases are produced by [Changesets](https://github.com/changesets/changesets). Whenever a PR introduces a user-visible change (feature, fix, breaking change), the contributor runs `pnpm changeset` to add a markdown file under `.changeset/` describing the change and its bump level (major/minor/patch). On merge to `main`, the [changesets action](https://github.com/changesets/action) accumulates pending changesets and opens (or updates) a "Version Packages" PR that contains the version bump and CHANGELOG entry. Merging that PR creates the annotated git tag and the GitHub Release automatically.

Chore-only PRs (docs, refactors with no observable change, tests, internal tooling) don't need a changeset.

## Reporting bugs / requesting features

- **Bugs and feature ideas** → open an issue using one of the two structured templates ([.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/)). Blank issues are disabled to keep triage scoped.
- **Questions, ideas, show-and-tell** → use Discussions (linked from the *New issue* page once enabled).
- **Security vulnerabilities** → **do not** open a public issue. Follow [SECURITY.md](SECURITY.md) instead (GitHub Private Vulnerability Reporting).

## Code of Conduct

This project follows the [Contributor Covenant 3](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms. Concerns can be raised to the maintainer (`@clemparpa`) via GitHub.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
