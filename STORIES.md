# STORIES — Setup du template `fluch-react-signals-starter`

Backlog ordonné pour passer du repo vide à un template publiable. Chaque story est exécutable indépendamment, dans l'ordre. Cocher au fil de l'eau.

---

## S01 — Bootstrap Vite + TypeScript + pnpm
**But** : avoir un projet Vite/React/TS qui démarre avec `pnpm dev`.

- [ ] `pnpm create vite . --template react-ts` (dans un dossier vide ; déplacer le contenu si besoin pour ne pas écraser `SPEC.md` / `STORIES.md` / `LICENSE` / `README.md`).
- [ ] Switch package manager → pnpm (créer `pnpm-lock.yaml`, supprimer tout `package-lock.json`).
- [ ] Ajouter `engines` (`node >= 22`, `pnpm >= 9`) et `packageManager` dans `package.json`.
- [ ] Créer `.nvmrc` avec `22`.
- [ ] Étendre `tsconfig.json` : `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- [ ] Alias `@` → `src/` dans `tsconfig.json` et plus tard `vite.config.ts`.

**Vérif** : `pnpm dev` lance le serveur, page Vite par défaut s'affiche.

---

## S02 — Tailwind v4 + globals.css initial
**But** : Tailwind v4 opérationnel avec tous les tokens shadcn en oklch.

- [ ] `pnpm add -D tailwindcss @tailwindcss/vite`
- [ ] Ajouter `tailwindcss()` au `vite.config.ts`.
- [ ] Créer `src/styles/globals.css` (cf. SPEC §3.2) : `@import 'tailwindcss'`, `:root` (light) + `.dark` (dark) en **oklch**, puis `@theme inline` qui mappe les vars vers les utilities Tailwind.
- [ ] Importer `globals.css` dans `main.tsx`.

**Vérif** : un `<div className="bg-background text-foreground p-4">` rend les bonnes couleurs ; toggler manuellement la classe `dark` sur `<html>` change le rendu.

---

## S03 — shadcn init (variant Base UI) + composants
**But** : registry shadcn configurée, tous les composants installés.

- [ ] `pnpm dlx shadcn@latest init --help` pour confirmer le flag du variant Base UI ; lancer l'init en sélectionnant Base UI.
- [ ] Vérifier que `components.json` reflète bien Base UI + Tailwind v4.
- [ ] `pnpm dlx shadcn@latest add --all` (ou bouclage sur la liste des composants si `--all` indisponible).

**Vérif** : `src/components/ui/` rempli, `src/lib/utils.ts` créé avec `cn()`.

---

## S04 — Signals + Babel transform
**But** : signals auto-trackés sans wrapper manuel.

- [ ] `pnpm add @preact/signals-react`
- [ ] `pnpm add -D @preact/signals-react-transform`
- [ ] Dans `vite.config.ts`, configurer `@vitejs/plugin-react` (Babel) avec le plugin transform en `mode: 'auto'` (cf. SPEC §3.1).
- [ ] Créer `src/lib/signals.ts` avec `themeMode` + `effect` qui synchronise la classe `dark` sur `<html>`.

**Vérif** : un bouton `<button onClick={() => themeMode.value = themeMode.value === 'dark' ? 'light' : 'dark'}>{themeMode.value}</button>` re-rend tout seul sans `useSignals()` explicite.

---

## S05 — React Router 7 (data router SPA)
**But** : routing `/` et `/showcase`.

- [ ] `pnpm add react-router` (v7).
- [ ] Créer `src/router.tsx` avec `createBrowserRouter([{ path: '/', ... }, { path: '/showcase', ... }])`.
- [ ] `src/App.tsx` rend `<RouterProvider router={router} />`.
- [ ] Créer placeholders `src/pages/home.tsx` et `src/pages/showcase.tsx`.

**Vérif** : navigation entre `/` et `/showcase` fonctionne sans reload.

---

## S06 — Page Showcase (pompée des exemples shadcn)
**But** : `/showcase` exhaustive, alignée sur les tokens.

- [ ] Pour chaque section listée dans SPEC §5 :
  - Récupérer le `*-example.tsx` correspondant via `pnpm dlx shadcn@latest docs <component>` ou fetch du raw GitHub (`apps/v4/registry/bases/base/examples/`).
  - Coller dans une sous-section de `showcase.tsx`, adapter les imports et remplacer les éventuelles données mock.
- [ ] Header : titre "Showcase" + bouton dark/light qui flip `themeMode`.
- [ ] Section Palette : itérer sur la liste des tokens et lire leurs valeurs calculées via `getComputedStyle(document.documentElement).getPropertyValue('--background')` côté client.

**Vérif** : `/showcase` s'affiche, toggle dark/light change les couleurs en live, chaque token est visible au moins une fois.

---

## S07 — Biome (lint + format)
**But** : un seul outil pour lint et format.

- [ ] `pnpm add -D --save-exact @biomejs/biome`
- [ ] `pnpm exec biome init` → `biome.json` avec recommended rules.
- [ ] Scripts `package.json` : `lint` (`biome ci`), `format` (`biome format --write .`), `check` (`biome check --write .`).

**Vérif** : `pnpm lint` passe sur le code généré (corriger les warnings shadcn éventuels, ou les whitelister).

---

## S08 — Husky + lint-staged
**But** : pre-commit propre.

- [ ] `pnpm add -D husky lint-staged`
- [ ] `pnpm exec husky init` → crée `.husky/pre-commit`.
- [ ] Remplir `.husky/pre-commit` : `pnpm exec lint-staged` + `pnpm typecheck`.
- [ ] Ajouter la clé `lint-staged` dans `package.json` : `biome check --write` sur `*.{ts,tsx,js,jsx,json,css}`.
- [ ] Ajouter script `prepare: husky` dans `package.json`.

**Vérif** : un commit qui contient un fichier mal formaté est reformaté + le commit passe ; un fichier avec erreur de types fait échouer le commit.

---

## S09 — Vitest + @testing-library + test d'exemple
**But** : harness de test prêt à l'emploi, avec un test qui passe.

- [ ] `pnpm add -D vitest @vitest/ui happy-dom @testing-library/react @testing-library/jest-dom`
- [ ] Étendre `vite.config.ts` avec la clé `test` (cf. SPEC §3.1) ; ajouter la triple-slash `/// <reference types="vitest" />` si TS râle.
- [ ] Créer `src/test/setup.ts` : `import '@testing-library/jest-dom'` + `afterEach(cleanup)`.
- [ ] Écrire `src/test/showcase.test.tsx` : rendu de la page Showcase via `<MemoryRouter>` (ou data router en mémoire), assertion que le titre "Showcase" est présent, et que cliquer sur le toggle flip la classe `dark` sur `<html>`.
- [ ] Script `package.json` : `test` (`vitest run`), `test:watch` (`vitest`), `test:ui` (`vitest --ui`).

**Vérif** : `pnpm test` passe.

---

## S10 — GitHub Actions CI
**But** : lint + typecheck + test + audit bloquent en CI.

- [ ] Créer `.github/workflows/ci.yml` : 4 jobs en parallèle, déclenchés sur `push` (main) et `pull_request`.
- [ ] Chaque job : checkout, setup pnpm (`pnpm/action-setup@v4`), setup Node 22 avec cache pnpm, install, command propre au job (`pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm audit --audit-level=high`).

**Vérif** : pousser une PR de test, vérifier que les 4 checks tournent et passent.

---

## S11 — Finalisation : designs/active.md, README, sanity check
**But** : repo prêt à être utilisé comme template GitHub.

- [ ] Créer `designs/active.md` avec un placeholder minimaliste (titre "Active design" + note expliquant que le skill `apply-theme` modifiera ce fichier).
- [ ] Réécrire `README.md` : présentation rapide, `pnpm install && pnpm dev`, liens vers `SPEC.md` et `STORIES.md`, mention "template — fork moi".
- [ ] Vérifier `.gitignore` (couvre `node_modules`, `dist`, `.env.local`, `coverage`, `.vite`, etc.).
- [ ] Sanity check global : dans un dossier propre, `pnpm install && pnpm dev` ouvre `/showcase` proprement ; `pnpm test && pnpm lint && pnpm typecheck && pnpm audit --audit-level=high` passent tous.
- [ ] Commit final + push, marquer le repo comme "Template repository" dans les settings GitHub.

---

## Verification finale

Après S01→S11, le template est valide ssi **toutes** ces commandes passent dans un clone propre :

```sh
pnpm install
pnpm dev            # serveur OK, /showcase rend les composants, toggle dark/light marche
pnpm build          # build prod OK
pnpm test           # showcase.test.tsx passe
pnpm lint           # biome ci OK
pnpm typecheck      # tsc --noEmit OK
pnpm audit --audit-level=high   # OK
```

Bonus :
- Un commit avec un fichier mal formaté est reformaté par le pre-commit.
- Une PR factice déclenche les 4 jobs GitHub Actions et tous passent au vert.
