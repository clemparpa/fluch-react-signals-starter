## Summary
<!-- 1–3 sentences: what does this PR change, and why? -->

## Motivation
<!-- Which problem does it solve, or which capability does it add? -->
<!-- Link the related issue if applicable, e.g. Closes #123. -->

## Changes
<!-- Bullet list of concrete changes (files, modules, public API). -->
-

## How to test
<!-- Reproducible steps from a clean clone. -->
1.

## Breaking changes
<!-- "None" if nothing. Otherwise: describe impact + migration path. To be reflected in CHANGELOG.md (see S15). -->
None.

## Screenshots
<!-- For UI changes: before / after. Otherwise delete this section. -->

## Checklist
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm audit --audit-level=high && pnpm build` all pass locally
- [ ] Docs updated where relevant (README, SPEC, STORIES)
- [ ] Commit convention respected (see [CONTRIBUTING.md](../CONTRIBUTING.md))
- [ ] No generated artifacts committed (`dist/`, `node_modules/`)
