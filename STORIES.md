# STORIES — Setup du template `fluch-react-signals-starter`

Backlog ordonné pour passer du repo vide à un template publiable. Chaque story est exécutable indépendamment, dans l'ordre. Cocher au fil de l'eau.

---

## S01 — Bootstrap Vite + TypeScript + pnpm ✅
**But** : avoir un projet Vite/React/TS qui démarre avec `pnpm dev`.

- [x] `pnpm create vite . --template react-ts` (dans un dossier vide ; déplacer le contenu si besoin pour ne pas écraser `SPEC.md` / `STORIES.md` / `LICENSE` / `README.md`).
- [x] Switch package manager → pnpm (créer `pnpm-lock.yaml`, supprimer tout `package-lock.json`).
- [x] Ajouter `engines` (`node >= 22`, `pnpm >= 9`) et `packageManager` dans `package.json`.
- [x] Créer `.nvmrc` avec `22`.
- [x] Étendre `tsconfig.json` : `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- [x] Alias `@` → `src/` dans `tsconfig.json` et plus tard `vite.config.ts`.

**Vérif** : `pnpm dev` lance le serveur, page Vite par défaut s'affiche.

---

## S02 — Tailwind v4 + globals.css initial ✅
**But** : Tailwind v4 opérationnel avec tous les tokens shadcn en oklch.

- [x] `pnpm add -D tailwindcss @tailwindcss/vite`
- [x] Ajouter `tailwindcss()` au `vite.config.ts`.
- [x] Créer `src/styles/globals.css` (cf. SPEC §3.2).
- [x] Importer `globals.css` dans `main.tsx`.

> Note : la forme initiale posée en S02 a été enrichie en S03 pour matcher la doc shadcn 4.7 (tw-animate-css, shadcn/tailwind.css, custom-variant dark, tokens chart + sidebar, @layer base, échelle radius xl→4xl).

**Vérif** : un `<div className="bg-background text-foreground p-4">` rend les bonnes couleurs ; toggler manuellement la classe `dark` sur `<html>` change le rendu.

---

## S03 — shadcn init (variant Base UI) + composants ✅
**But** : registry shadcn configurée, tous les composants installés.

- [x] `pnpm dlx shadcn@latest init` (variant Base UI sélectionné au prompt → `"style": "base-nova"` dans `components.json`).
- [x] `pnpm dlx shadcn@latest add --all` → 55 composants dans `src/components/ui/`, hook `use-mobile` dans `src/hooks/`.
- [x] `src/lib/utils.ts` créé manuellement avec `cn()` (la CLI a un bug qui ne l'a pas créé).
- [x] `tsconfig.json` racine : ajout des `paths` (`@/*` → `./src/*`) pour que shadcn résolve l'alias.
- [x] `pnpm-workspace.yaml` : `msw: false` (bloque le warning ERR_PNPM_IGNORED_BUILDS).
- [x] `shadcn` déplacé en devDep.
- [x] Refonte de `globals.css` pour matcher la doc shadcn 4.7 (cf. note S02).
- [x] Patches manuels : `calendar.tsx` (`table` → `month_grid`) et `scroll-area.tsx` (import React inutile).

**Vérif** : `src/components/ui/` rempli (55 composants), `src/lib/utils.ts` créé avec `cn()`, `pnpm typecheck` + `pnpm build` passent.

---

## S04 — Signals + Babel transform ✅
**But** : signals auto-trackés sans wrapper manuel.

- [x] `pnpm add @preact/signals-react` (v3.10.1).
- [x] `pnpm add -D @preact/signals-react-transform` (v0.8.1).
- [x] `pnpm add -D @rolldown/plugin-babel @babel/core @types/babel__core` (nécessaire car `@vitejs/plugin-react` v6 a viré l'option `babel` inline).
- [x] `vite.config.ts` : `babel()` placé **avant** `react()`, plugin référencé avec préfixe `module:` (`'module:@preact/signals-react-transform'`) sinon Babel cherche `@preact/babel-plugin-signals-react-transform` (convention de nommage).
- [x] `src/lib/signals.ts` : `themeMode` signal + `effect` qui synchronise la classe `dark` sur `<html>`.
- [x] `src/App.tsx` : toggle dark/light en header pour valider le re-render automatique (sera migré vers le header de la showcase en S06).

**Vérif** : confirmé en dev et en build prod. Le bundle minifié contient `useSignals(1)` + `try/finally` injectés dans `App()` — aucun import explicite de `useSignals` dans le source. Toggle visuel OK sur `http://localhost:5173`.

---

## S05 — React Router 7 (data router SPA) ✅
**But** : routing `/` et `/showcase`.

- [x] `pnpm add react-router` (v7.15.0). En v7, plus de `react-router-dom` — tout est exporté depuis `react-router`.
- [x] Créer `src/router.tsx` : route parent `path: '/'` avec `element: <RootLayout />` + `children` (`index: true` → Home, `path: 'showcase'` → Showcase). Imports via alias `@/`.
- [x] `src/App.tsx` réduit à `<RouterProvider router={router} />`.
- [x] Créer `src/layouts/root.tsx` : header partagé (titre + NavLink Home/Showcase + toggle dark/light) + `<Outlet />`. Le toggle migre de `App.tsx` vers le layout pour rester visible sur les deux pages.
- [x] Créer `src/pages/home.tsx` (titre + section "Tokens sanity check" reprise de l'ancien App.tsx) et `src/pages/showcase.tsx` (placeholder, sera rempli en S06).

**Vérif** : `pnpm typecheck` + `pnpm build` OK, dev server confirme la nav `/` ↔ `/showcase` sans reload, toggle dark/light testé en navigateur (validé par le user). Inspection du module transformé `/src/layouts/root.tsx` : `_useSignals(1)` + `_effect.f()` bien injectés par le Babel transform sur `RootLayout`.

---

## S06 — Page Showcase (pompée des exemples shadcn) ✅

**But** : `/showcase` exhaustive, alignée sur les tokens.

- [x] Bascule en cours d'exécution : les `*-example.tsx` du registry sont **inutilisables tels quels** (scaffolding interne `Example`/`ExampleWrapper` + `IconPlaceholder` multi-bibliothèques + 600-1000 lignes/fichier). Décision (via AskUserQuestion) : écrire à la main, 3-5 variants/section, en restant strictement aligné sur SPEC §5 (« pompe **ou adapte** »).
- [x] Structure : `src/pages/showcase/index.tsx` + `sections/{palette,typography,spacing-radius,buttons,form,cards,overlays,navigation,feedback,data-display}.tsx` (10 fichiers).
- [x] Header showcase : juste un `<h1>` + sous-titre. Le toggle dark/light reste dans le `RootLayout` (header global) — pas de duplication.
- [x] Section Palette : itère sur les 11 tokens, swatch via `style={{ background: 'var(--token)' }}` (résolu par le navigateur au paint), valeur oklch lue via `getComputedStyle` dans un `useLayoutEffect` redéclenché par `themeMode.value`. La palette reflète donc en live l'état courant de `globals.css` — exactement ce que le futur skill `apply-theme` aura besoin pour valider une modif.
- [x] `<Toaster />` mounté dans `RootLayout` avec `theme={themeMode.value}` (override du `useTheme` next-themes interne de `sonner.tsx`).
- [x] Adaptations API rencontrées : `<Drawer>` (vaul) utilise `asChild`, pas `render` ; `<Accordion>` (base-ui) n'a pas `type`/`collapsible` (utilise `openMultiple` à la place).

**Vérif** : `pnpm typecheck` ✅, `pnpm build` ✅ (764 KB JS / 236 KB gzip, warning chunk-size attendu pour un template avec 55 composants). Toggle testé par le user en navigateur — palette se met à jour en live.

---

## S07 — Biome (lint + format) ✅
**But** : un seul outil pour lint et format.

- [x] `pnpm add -D --save-exact @biomejs/biome` (v2.4.15).
- [x] `pnpm exec biome init` → écrasé ensuite par `biome.json` cible : `indentStyle: space / indentWidth: 2 / lineWidth: 100`, `quoteStyle: double` + `semicolons: asNeeded` (aligne sur le style shadcn existant), `assist.organizeImports: on`, `css.parser.tailwindDirectives: true` (pour `@theme inline` / `@custom-variant` / `@apply` de globals.css), `vcs.useIgnoreFile: true`.
- [x] Scripts `package.json` : `lint` (`biome ci`), `format` (`biome format --write .`), `check` (`biome check --write .`).
- [x] Override ciblé `src/components/ui/**` : désactive 11 règles bruyantes sur le code shadcn généré (a11y/useSemanticElements, useFocusableInteractive, useKeyWithClickEvents, noLabelWithoutControl, useAriaPropsForRole, noRedundantRoles ; correctness/useExhaustiveDependencies ; suspicious/noArrayIndexKey, noDoubleEquals, noDocumentCookie ; security/noDangerouslySetInnerHtml). Formatter reste actif partout.
- [x] Fix code custom (3 cas) : `main.tsx` (biome-ignore noNonNullAssertion sur `document.getElementById("root")!` — pattern Vite), `palette.tsx` (biome-ignore useExhaustiveDependencies — `mode` est le trigger volontaire), `typography.tsx` (`href="https://example.com"` au lieu de `href="#"` pour `useValidAnchor`).
- [x] `biome check --write .` a reformaté 72 fichiers — passage en double quotes sur le code custom, organize imports partout.

**Vérif** : `pnpm lint` (= `biome ci`) passe clean (83 fichiers, 0 erreur, 0 warning) ; `pnpm typecheck` ✅ ; `pnpm build` ✅ (764 KB JS, identique à S06 — aucun impact bundle).

---

## S08 — Husky + lint-staged ✅
**But** : pre-commit propre, compatible aussi quand le template est utilisé en sous-dossier d'un monorepo.

- [x] `pnpm add -D husky lint-staged` (v9.1.7 + v17.0.4).
- [x] `pnpm exec husky init` → crée `.husky/pre-commit` (sample remplacé) + `.husky/_/` (stubs internes ignorés via `.husky/_/.gitignore = *`, auto-généré). Le seul fichier `.husky/` tracké est `pre-commit`.
- [x] `.husky/pre-commit` : `pnpm exec lint-staged` + `pnpm typecheck` (séquentiel, fail-fast).
- [x] Clé `lint-staged` dans `package.json` : `"*.{ts,tsx,js,jsx,json,css}": "biome check --write --no-errors-on-unmatched"`. Le flag `--no-errors-on-unmatched` évite que biome exit non-zero si lint-staged lui passe un fichier hors de son scope.
- [x] **Tactique monorepo** : au lieu de `"prepare": "husky"` (qui pollue le repo parent en monorepo), on pose `"prepare": "node scripts/prepare.js"`. Le script (~10 lignes) check `existsSync('.git')` à la racine du package : si oui → exec husky (standalone), sinon → exit-0 silencieux (monorepo ou clone sans .git). Pattern Vercel/Stackblitz, cross-platform.

**Vérif** : testé bout-en-bout via `bash .husky/pre-commit` après stage d'un fichier jetable :
- Single quotes → reformaté en double quotes par lint-staged, re-stagé auto, typecheck pass ✅
- Type error volontaire (`const x: number = "..."`) → typecheck fail (TS2322), exit 2 ✅
- Skip monorepo confirmé : `node scripts/prepare.js` depuis `/tmp/test-no-git/` log le skip et exit 0 ✅

**Piège rencontré** : ne JAMAIS lancer `pnpm exec husky --version` — husky 9 CLI traite `--version` comme un argument de path (pas un flag) et configure `core.hooksPath` à `--version/_`, ce qui casse les hooks (post-checkout fait planter `git restore`). Récup : relancer `pnpm exec husky` (sans args) restaure `core.hooksPath = .husky/_`.

---

## S09 — Vitest + @testing-library + test d'exemple ✅
**But** : harness de test prêt à l'emploi, avec un test qui passe.

- [x] `pnpm add -D vitest @vitest/ui happy-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event` (versions installées : vitest 4.1.6, @vitest/ui 4.1.6, happy-dom 20.9.0, @testing-library/react 16.3.2, @testing-library/jest-dom 6.9.1, @testing-library/user-event 14.6.1)
- [x] Étendre `vite.config.ts` avec la clé `test` (cf. SPEC §3.1) ; triple-slash **`/// <reference types="vitest/config" />`** (pas `"vitest"` seul — Vitest 4.x élargit `UserConfig` via le sous-chemin `/config`).
- [x] Créer `src/test/setup.ts` : `import "@testing-library/jest-dom/vitest"` + `afterEach(cleanup)` + reset du signal `themeMode` (state module-level qui leakerait entre `it()`).
- [x] Écrire `src/test/showcase.test.tsx` : rendu via `createMemoryRouter(routes, { initialEntries: ["/showcase"] })` (routes importées de `src/router.tsx`, extraites en export nommé). Deux tests : titre "Showcase" présent + toggle theme flip la classe `dark` sur `<html>` (assertion bidirectionnelle light→dark→light).
- [x] Scripts `package.json` : `test` (`vitest run`), `test:watch` (`vitest`), `test:ui` (`vitest --ui`).

**Vérif** : `pnpm test` passe (2 tests verts), `pnpm typecheck` / `pnpm lint` / `pnpm build` aussi.

**Notes finales** :
- **Refactor mineur de `src/router.tsx`** : extraction du tableau `routes: RouteObject[]` en export nommé pour permettre au test de construire un `createMemoryRouter` sur la même arborescence sans duplication. `createBrowserRouter(routes)` reste l'export pour la prod.
- **Triple-slash** : `/// <reference types="vitest/config" />` (pas `vitest` tout court). Sans le sous-chemin `/config`, TS ne sait pas que la clé `test` existe sur `UserConfig` et `tsc` plante avec TS2769.
- **`@testing-library/jest-dom/vitest`** (pas `/auto` ni racine) : l'entry officielle Vitest qui étend `expect` + types matchers.
- **Reset signal** : `themeMode` est un signal singleton du module `src/lib/signals.ts`. L'`afterEach` global remet à `"light"` — sans ça, le 2e `it()` démarrerait en `dark`.
- **Babel transform** : Vitest réutilise la config Vite donc `@preact/signals-react-transform` tourne aussi en test. `themeMode.value` dans le JSX du toggle reste réactif comme en prod.
- **`vitest run` vs `vitest`** : `run` = single-pass pour CI ; `vitest` (watch) pour dev itératif.

---

## S10 — GitHub Actions CI ✅
**But** : lint + typecheck + test + audit bloquent en CI.

- [x] Créer `.github/workflows/ci.yml` : **5 jobs** en parallèle (4 SPEC + bonus `build`), déclenchés sur `push` (main) et `pull_request`.
- [x] Chaque job : checkout, setup pnpm (`pnpm/action-setup@v4`, lit `packageManager` du package.json), setup Node 22 (via `node-version-file: .nvmrc`, cache pnpm), `pnpm install --frozen-lockfile`, command propre au job (`pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm audit --audit-level=high` / `pnpm build`).

**Vérif** : tous les jobs passent **localement** (`pnpm lint && pnpm typecheck && pnpm test && pnpm audit --audit-level=high && pnpm build`). Validation CI réelle = push une branche de test + ouvrir une PR + observer les 5 checks via `gh pr checks --watch`.

**Notes finales** :
- **5 jobs** au lieu des 4 SPEC : ajout d'un `build` (`pnpm build` = `tsc -b && vite build`) comme filet contre les régressions de bundling Vite (CSS / asset imports invisibles à `tsc --noEmit` seul). Utile pour un template que les forks vont cloner et builder direct.
- **Concurrency** : `group: ci-${{ github.workflow }}-${{ github.ref }}` + `cancel-in-progress: true`. Pousser un nouveau commit sur une PR (ou main) annule le run précédent → économie de minutes CI.
- **pnpm version** : lue automatiquement du champ `packageManager: pnpm@11.0.8` (package.json) par `pnpm/action-setup@v4`. Pas besoin de pinner dans le YAML — une seule source de vérité.
- **Node version** : lue de `.nvmrc` via `actions/setup-node@v4` avec `node-version-file: .nvmrc`. Même logique de source unique.
- **Ordre des steps** : `checkout` → `pnpm/action-setup` → `setup-node` (avec `cache: pnpm`) → `install` → command. Inverser pnpm/node casse le caching (setup-node ne trouve pas `pnpm` pour résoudre le store path).
- **`permissions: contents: read`** top-level : least-privilege pour le GITHUB_TOKEN. Aucun job n'a besoin d'écrire (pas de release, pas de commit auto).
- **PR forkées safe** : trigger `pull_request` (pas `pull_request_target`) → checkout sur le SHA de la PR, pas du target. Pas de secrets exposés.
- **Duplication assumée** : le bloc setup est dupliqué × 5 (pas de composite action). Lisibilité > DRY sur 5 jobs identiques.

---

## S11 — Finalisation : designs/active.md, README, sanity check ✅
**But** : repo prêt à être utilisé comme template GitHub.

- [x] Créer `designs/active.md` avec un placeholder minimaliste (titre "Active design" + note expliquant que le skill `apply-theme` modifiera ce fichier).
- [x] Réécrire `README.md` (en anglais — convention OSS) : présentation, stack tableau, quickstart, scripts, structure, signals, CI, liens SPEC/STORIES, mention "fork this template".
- [x] Vérifier `.gitignore` (couvre `node_modules`, `dist`, `.env*`, `coverage`, `.vite/`, `.pnpm-store`, `.DS_Store`, etc.) — déjà OK depuis S01, rien à ajouter.
- [x] Sanity check **local** : `pnpm lint && pnpm typecheck && pnpm test && pnpm audit --audit-level=high && pnpm build` passent tous (check from-scratch dans un clone propre = à faire côté user).
- [x] Supprimer le reliquat `--version/` à la racine (artefact filesystem du bug husky en S08, non tracké git).
- [x] Commit final + push. **Flag "Template repository"** : à activer manuellement par l'user dans Settings GitHub.

**Notes finales** :
- **README en anglais** : choix volontaire — langue standard de l'open-source pour qu'un fork étranger soit lisible immédiatement. SPEC/STORIES restent en français (docs internes au design du template).
- **`designs/active.md`** : court placeholder qui pointe vers `src/index.css` (tokens oklch shadcn par défaut) en attendant qu'un skill `apply-theme` futur le remplisse vraiment.
- **`--version/`** : reliquat de S08 (`pnpm exec husky --version` qui crée un dossier nommé `--version` au lieu d'afficher la version). Non tracké en git, mais polluait `ls`. Supprimé.
- **Sanity check from-scratch** : pas fait dans cette story (juste local). User a confirmé qu'il le ferait lui-même plus tard pour validation finale.

---

## S12 — Dependabot (bonus, hors SPEC initiale) ✅
**But** : garder le template (et ses forks) à jour automatiquement, sans noyer le user sous les PRs.

- [x] Créer `.github/dependabot.yml` avec **2 ecosystems** :
  - **`npm`** (couvre `pnpm-lock.yaml` nativement depuis 2024) sur `directories: ["/"]`, cadence **weekly**, `open-pull-requests-limit: 5`, **grouping** en 2 paquets : `development-dependencies` (type `development`) et `production-dependencies` (type `production`) → 2 PRs/semaine max au lieu de 30 PRs unitaires.
  - **`github-actions`** sur `directory: "/"`, cadence **weekly**, pour bumper `actions/checkout`, `actions/setup-node`, `pnpm/action-setup` quand de nouvelles majeures sortent.
- [x] Commentaire en tête du fichier expliquant l'**ajustement monorepo** : changer `directories: ["/"]` en `directories: ["/apps/front", ...]` quand le template est intégré dans un monorepo.
- [x] Ajouter une section **"Monorepo integration"** dans `README.md` qui couvre l'ajustement de `directories`, la déduplication du `github-actions` ecosystem, le merge des workflows CI, et la précision pnpm-workspace lockfile racine.
- [x] Validation `dependabot.yml` localement : YAML parse OK via `python3 -c "import yaml; yaml.safe_load(...)"`. Validation schéma = côté GitHub après push.

**Vérif** :
- Local : YAML parse OK + sanity CI complète (`pnpm lint && pnpm typecheck && pnpm test && pnpm audit --audit-level=high && pnpm build`) tous verts.
- Côté GitHub après push : onglet *Insights → Dependency graph → Dependabot* affiche la config détectée + 1re passe sans erreur. PRs initiales possibles dans les heures qui suivent (rattrapage), puis cadence weekly.
- CI 5 jobs reste verte sur le push S12.

**Notes finales** :
- **`directories: ["/"]`** (pluriel, format glob) volontairement choisi pour `npm` — conversion monorepo plus naturelle (`["/apps/front"]`). Pour `github-actions` on garde `directory: "/"` (singulier) car le scope est toujours le repo entier (`.github/workflows/`).
- **Grouping nommé** `production-dependencies` / `development-dependencies` apparaît dans le titre des PRs (`chore(deps): bump the production-dependencies group …`). Lisibilité immédiate.
- **Pas de validation locale du schéma Dependabot** : aucune CLI officielle. La syntaxe YAML est vérifiée localement, mais le schéma (clés valides, types) ne l'est que côté GitHub. Workaround : si erreur, GitHub affiche un encart rouge dans l'onglet Dependabot avec le diagnostic.
- **`audit` CI et Dependabot complémentaires** : audit = vulnérabilités urgentes déclenchées à chaque push/PR (réactif). Dependabot = updates de routine (proactif, weekly). Pas de redondance, ils couvrent deux phases du cycle.
- **PRs initiales en rafale** : au tout 1er run après détection, Dependabot rattrape les bumps en retard et peut ouvrir 1-2 PRs hors planning. Attendu, normal.
- **Pre-commit hook S08** : `lint-staged` glob (`*.{ts,tsx,js,jsx,json,css}`) ne matche pas `.yml`/`.md`, donc skip propre comme pour S10/S11. Seul `tsc -b --noEmit` du hook tourne.
- **Filtre patch updates** : ajout post-livraison d'un `ignore: [{dependency-name: "*", update-types: ["version-update:semver-patch"]}]` sur l'ecosystem `npm`. Raison : le 1er run a ouvert 3 PRs patch-only (`vite 8.0.12→8.0.13`, etc.) qui sont du bruit pur (les patches sont bundlés dans le minor suivant). Reste actif : minor + major. `github-actions` ecosystem n'est pas touché (presque tous ses bumps sont des majors, faible volume).

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
