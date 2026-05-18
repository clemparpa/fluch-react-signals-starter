# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [0.1.0] — 2026-05-18

Initial template release. Covers all bootstrap work from S01 through S14.

### Added

- **Core stack** — Vite 8 + React 19 + TypeScript 6 + pnpm bootstrap (S01), Tailwind CSS v4 with oklch design tokens (S02), shadcn (Base UI variant) with 55 vendored components (S03), `@preact/signals-react` + Babel auto-transform via `@rolldown/plugin-babel` (S04), React Router 7 (data router, SPA mode) with shared layout (S05).
- **Tooling** — Biome 2.x for lint + format + organize imports (S07), Husky + lint-staged pre-commit hooks (S08), Vitest 4 + Testing Library + happy-dom (S09).
- **CI/CD** — GitHub Actions with 5 parallel jobs: lint, typecheck, test, audit, build (S10), Dependabot grouped npm + github-actions updates with patch-level skip (S12).
- **Demo** — Exhaustive Showcase page with 11 sections demonstrating live design tokens (S06).
- **Docs** — Initial README + `designs/active.md` placeholder (S11), full README polish with shields.io badges + Contributing/Community sections (S14).
- **Community** — Code of Conduct (Contributor Covenant 3.0), CONTRIBUTING, SECURITY (Private Vulnerability Reporting), issue and PR templates (S13).

[Unreleased]: https://github.com/clemparpa/fluch-react-signals-starter/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/clemparpa/fluch-react-signals-starter/releases/tag/v0.1.0
