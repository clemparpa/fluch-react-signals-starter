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

## S13 — OSS community files (bonus, hors SPEC initiale)
**But** : doter le repo des fichiers de gouvernance attendus par les contributeurs OSS, pour faire passer le score "Community Standards" de GitHub à 100 %.

- [x] `CONTRIBUTING.md` (racine) : workflow PR (fork → branch → PR vers `main`), commande unique de validation locale (`pnpm lint && pnpm typecheck && pnpm test && pnpm audit --audit-level=high && pnpm build` — 5 jobs comme CI), convention de commit (style `SXX — ...` pour stories de setup, conventional commits `feat:` / `fix:` / `chore:` / `docs:` / `refactor:` / `test:` pour évolutions post-livraison), section "Adding a story" pointant vers SPEC.md / STORIES.md, section reporting bugs/features pointant vers ISSUE_TEMPLATE/ + SECURITY.md.
- [x] `CODE_OF_CONDUCT.md` (racine) : **Contributor Covenant 3.0** (et non 2.1 — la v3 est sortie entre temps, copiée intégralement depuis le site officiel). Contact = `@clemparpa` sur GitHub. Aucun email exposé.
- [x] `SECURITY.md` (racine) : reporting via GitHub Private Vulnerability Reporting (lien direct vers `/security/advisories/new`), politique de support = seul `main` (HEAD), SLA acknowledgement < 7 jours, out-of-scope explicite (vulns de deps → upstream, `pnpm audit` couvre le high-severity).
- [x] `.github/ISSUE_TEMPLATE/bug_report.yml` : format YAML moderne, `labels: ["bug"]`, `title: "[Bug] "`, champs structurés (description, steps, expected, actual, Node version, pnpm version, OS dropdown, additional context), checkbox "I have searched existing issues".
- [x] `.github/ISSUE_TEMPLATE/feature_request.yml` : `labels: ["enhancement"]`, `title: "[Feature] "`, champs motivation/solution/alternatives/context, même checkbox de pré-recherche.
- [x] `.github/ISSUE_TEMPLATE/config.yml` : `blank_issues_enabled: false` + `contact_links` vers Discussions (404 attendue tant que S14 n'est pas livré) et `/security/advisories/new`.
- [x] `.github/pull_request_template.md` : version détaillée (Summary, Motivation, Changes, How to test, Breaking changes, Screenshots, Checklist de 4 cases) — choix user, pas la version courte.

**Vérif** :
- `pnpm lint && pnpm typecheck && pnpm test && pnpm audit --audit-level=high && pnpm build` toujours verts (aucun fichier de code touché).
- Côté GitHub après push : *Insights → Community Standards* coche tous les items (description, README, CoC, contributing, license, issue templates, PR template).
- Bouton *New issue* propose les 2 templates au lieu du formulaire vierge.
- Onglet *Security* du repo affiche le lien *Report a vulnerability*.

**Notes** :
- **Contributor Covenant 3.0 (pas 2.1)** : la v3 a été publiée mi-2025 par l'Organization for Ethical Source ; structure remaniée (Encouraged / Restricted Behaviors, enforcement ladder explicite). Aucune raison de rester sur 2.1 pour un repo neuf. Texte sous CC BY-SA 4.0, attribution conservée.
- **Filtre API content policy** : la rédaction automatique du CoC v3 a été bloquée plusieurs fois par le content filter (exemples explicites de comportements). Workaround utilisé : texte officiel copié manuellement par le user, puis seuls les deux placeholders `[NOTE: ...]` adaptés (canal de reporting → `@clemparpa` + lien PVR, suppression de la note de personnalisation de l'enforcement ladder qui n'a pas lieu d'être ici).
- **Contact 100 % GitHub-native** : décision user de n'exposer aucun email public (CoC + SECURITY.md). Tout passe par le handle `@clemparpa` ou par GitHub Private Vulnerability Reporting. Privacy maximum, fonctionnement standard côté GitHub.
- **PR template détaillé** : choix user (vs version courte 4-5 cases). Plus de friction par PR mais oblige les contributeurs externes à expliciter motivation/tests/breaking. Cohérent avec un repo template (forks fréquents, peu de PRs upstream).
- **Auto-labels actifs** : `bug` et `enhancement` posés via la clé YAML `labels:` du template d'issue. Aucune config supplémentaire nécessaire — GitHub crée les labels au premier usage s'ils n'existent pas.
- **Dépendance S14** : 3 liens dans le repo renvoient une 404 tant que les Settings GitHub ne sont pas configurés en S14 :
  1. `https://github.com/clemparpa/fluch-react-signals-starter/discussions` (config.yml + futur README) → activer *Discussions* dans Settings → General → Features.
  2. `https://github.com/clemparpa/fluch-react-signals-starter/security/advisories/new` (SECURITY.md + config.yml + CoC) → activer *Private Vulnerability Reporting* dans Settings → Security & analysis.
  3. *Insights → Community Standards* affichera 100 % uniquement une fois ces deux activations faites + topics + description repo (S14).
- **Aucun fichier de code touché** : 7 fichiers ajoutés (`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/{bug_report,feature_request,config}.yml`). CI verte sur les 5 jobs après ajout.

---

## S14 — README polish + Settings GitHub checklist (bonus, hors SPEC initiale)
**But** : rendre le repo accueillant au premier coup d'œil et finaliser les métadonnées GitHub.

- [x] Badges en tête du README (après le titre, avant la description) : CI status natif GitHub Actions, License MIT, Node ≥22, pnpm ≥9, "Use this template" (badge cliquable vers le generator). Style shields.io flat. Badge Dependabot skippé (pas d'équivalent officiel).
- [x] Section **Contributing** dans le README (avant License) : pointe vers `CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/`, et `SECURITY.md` pour les vulns.
- [x] Section **Community** : lien Discussions (404 jusqu'à activation Settings), Code of Conduct, contact maintainer `@clemparpa`.
- [x] Ordre conventionnel OSS appliqué : badges → description courte → Quickstart → Stack → Scripts → Structure → Signals → CI → Specs/roadmap → Fork → Monorepo → Contributing → Community → License (Quickstart remonté avant Stack ; Contributing + Community insérés avant License).
- [ ] **Checklist d'actions Settings côté GitHub** (manuelles côté user, traçables en checkboxes) :
  - [ ] Activer **Template repository** (Settings → General).
  - [ ] Renseigner *Description* + *Website* (panneau About en tête du repo).
  - [ ] Ajouter topics : `react`, `vite`, `vite-template`, `tailwind`, `tailwindcss-v4`, `shadcn`, `base-ui`, `signals`, `preact-signals`, `typescript`, `react-router`, `template`.
  - [ ] Activer **Discussions** (Settings → General → Features).
  - [ ] Activer **Private Vulnerability Reporting** (Settings → Security & analysis).
  - [ ] Vérifier la branch protection rule sur `main` : 5 checks CI required (lint / typecheck / test / audit / build), require linear history, require PR before merge, no force push, no deletions. Si CODEOWNERS ajouté en S16 : ajouter "Require review from Code Owners".

**Vérif** :
- README rendu (CommonMark) : badges affichés en tête, liens Contributing/Security cliquables.
- Page du repo : panneau *About* montre description + topics + flag *Template repository*.
- Une PR factice avec un fichier mal formaté est bloquée par la branch protection.

**Notes** :

- **Côté code (livré dans cette story)** : refonte complète de `README.md` (5 badges shields.io flat + CI natif sous le titre, Quickstart remonté avant Stack, deux nouvelles sections Contributing et Community insérées juste avant License). Aucun fichier de code applicatif touché. Les 4 checkboxes README sont cochées ; les 6 checkboxes Settings restent ouvertes (manuelles côté user dans l'UI GitHub).
- **Style badges** : shields.io `style=flat` (défaut). CI badge reste natif GitHub Actions (SVG dynamique sur `main`). Badge Dependabot écarté faute de standard officiel.
- **Maintainer contact** : `@clemparpa` GitHub uniquement, zéro email exposé (cohérence avec S13).
- **3 liens 404 que cette story prépare** : Discussions (`/discussions`), PVR (`/security/advisories/new`), Use-this-template (`/generate`). Ils deviennent fonctionnels une fois les actions Settings cochées dans l'UI.
- **Actions Settings GitHub (manuelles côté user)** : (1) Settings → General → cocher *Template repository*, renseigner Description + Website, activer Discussions ; (2) panneau *About* → topics listés ci-dessus ; (3) Settings → Security & analysis → activer **Private vulnerability reporting** ; (4) Settings → Branches → branch protection sur `main` avec les 5 checks CI required (lint / typecheck / test / audit / build), require linear history, require PR before merge, no force push, no deletions.
- **Critère d'acceptation final** (post-Settings) : *Insights → Community Standards* affiche 100 %, le bouton "Use this template" apparaît dans le header du repo, et une PR factice mal formatée est bloquée par la branch protection.

---

## S15 — Release process : CHANGELOG + tags semver + GitHub Releases (bonus, hors SPEC initiale)
**But** : tracker explicitement les évolutions du template pour que les forks puissent re-puller des versions identifiées et que les contributeurs sachent ce qui a changé.

- [x] `CHANGELOG.md` à la racine, format **Keep a Changelog 1.1** + **SemVer 2.0** : section `## [Unreleased]` (sous-rubriques Added / Changed / Fixed / Removed), puis section `## [0.1.0] — <date>` rétroactive listant l'ensemble des stories **S01 → S14** (couvre tout l'état du repo au moment de la première release, y compris S13 community files et S14 README polish livrés après la rédaction initiale de S15).
- [x] Mettre `package.json#version` à `0.1.0` (probablement à `0.0.0` aujourd'hui, défaut Vite).
- [x] Documenter dans `CONTRIBUTING.md` la politique de versioning : **major** = breaking template-wide (changement de stack, suppression d'une dép. structurante) — la barre est volontairement haute car les forks ont divergé ; **minor** = nouvelle capacité (ajout outil/stack) ; **patch** = fix / chore.
- [x] Tag annoté `v0.1.0` sur le dernier commit de S15 (= commit qui ajoute CHANGELOG + bump version) : `git tag -a v0.1.0 -m "Initial template release" && git push origin v0.1.0`.
- [x] Créer la GitHub Release `v0.1.0` via `gh release create v0.1.0 --notes-file <extrait CHANGELOG>` (ou UI) — reprendre les notes 0.1.0 du CHANGELOG.
- [x] Ajouter un badge version au README (juste après les autres badges en tête, format shields.io dynamique `github/v/release/clemparpa/fluch-react-signals-starter?logo=github`) — il affiche `v0.1.0` automatiquement dès que la GitHub Release est publiée.
- [x] **Décision automation vs. manuel** : seed 0.1.0 manuel (les commits S01→S14 n'ont pas de changesets associés), puis **Changesets (`@changesets/cli` + `changesets/action@v1`)** pour 0.2.0+ — `.changeset/config.json` (default + `commit: false`, `access: "restricted"`, `baseBranch: "main"`) + workflow `.github/workflows/release.yml` (`version: pnpm changeset version`, `publish: pnpm changeset tag` — pas de publish npm puisque `private: true`). À chaque PR avec changement user-visible, le contributeur exécute `pnpm changeset` pour ajouter un `.changeset/<hash>.md` (bump level + résumé). Au merge sur `main`, l'action accumule les changesets et ouvre une "Version Packages" PR contenant le bump CHANGELOG + bump `package.json#version` ; merge → tag annoté + GitHub Release créés auto.

**Vérif** :
- `git tag --list` montre `v0.1.0`.
- Onglet *Releases* du repo affiche `v0.1.0` avec les notes formatées.
- Le badge version du README affiche `v0.1.0` (peut nécessiter un hard-refresh du proxy d'images GitHub après publication de la Release).

**Notes** :

- **Date 0.1.0** : `2026-05-18`.
- **Style CHANGELOG** : Keep a Changelog 1.1 + SemVer 2.0. Pour 0.1.0, groupement thématique dans `### Added` (Core stack / Tooling / CI/CD / Demo / Docs / Community) avec story-tag en référence, plutôt qu'une ligne par story — plus lisible pour un end-user qui découvre le repo. Liens de comparaison `[Unreleased]` et `[0.1.0]` en bas du fichier.
- **Automation** : seed 0.1.0 manuel (S01→S14 sans changesets) ; **Changesets** prend le relais pour 0.2.0+. Fichiers ajoutés : `@changesets/cli` en devDependency, `.changeset/config.json` (default généré par `pnpm changeset init`, conserve `commit: false` + `access: "restricted"` cohérent avec `private: true`), `.changeset/README.md` (doc standard), `.github/workflows/release.yml` (permissions `contents: write` + `pull-requests: write`, utilise `changesets/action@v1` avec `version: pnpm changeset version` + `publish: pnpm changeset tag` — `tag` plutôt que `publish` car pas de publish npm). Décision révisée vs. spec initiale ("100 % manuel") puis re-révisée vs. plan ("release-please") — l'user a finalement opté pour Changesets (qu'il connaît déjà sur un autre projet) parce qu'il préfère le contrôle déclaratif (1 changeset par PR avec notes user-facing rédigées explicitement) plutôt que la dérivation auto depuis les commit messages.
- **Format CHANGELOG** : 0.1.0 utilise Keep a Changelog 1.1 (sections Added/Changed/Fixed/Removed). À partir de 0.2.0, Changesets ajoutera ses propres entrées au format `## X.Y.Z` + sous-sections `### Major/Minor/Patch Changes`. Mix volontaire et documenté : pas de migration rétroactive du seed 0.1.0.
- **Position du badge version dans README** : 6e position, juste après "Use this template", en `![Version](https://img.shields.io/github/v/release/clemparpa/fluch-react-signals-starter?logo=github)`. Le badge sera 404 (image cassée) tant que la GitHub Release `v0.1.0` n'est pas publiée — c'est attendu. Une fois la Release créée, un hard-refresh du proxy `camo.githubusercontent.com` peut être nécessaire pour voir l'image s'afficher.
- **2 checkboxes restantes** (tag annoté + GitHub Release) : exécutées **après** le commit S15 et son push sur main, dans la foulée (cf. `git tag -a v0.1.0 ... && git push origin v0.1.0` puis `gh release create v0.1.0 --notes-file <extrait>`).
- **Dépendance Dependabot** (hors scope S15) : les commits Dependabot actuels sont du style `Bump <dep>` (pas Conventional Commits) → ne déclencheront pas release-please. Solution future = ajouter `commit-message.prefix: "chore"` dans `.github/dependabot.yml`. À traiter en story dédiée ou patch post-S15.

---

## S17 — better-auth (client SPA, serveur hors scope) (bonus, hors SPEC initiale)
**But** : câbler le **client** `better-auth` (sign-up / sign-in / session) dans le template, en laissant le serveur d'auth à la charge de l'user. Cohérent avec la vocation "starter SPA" — le backend reste un template séparé (ex. le template backend perso du maintainer), branché via une variable d'env.

- [ ] Installer la dépendance : `pnpm add better-auth`.
- [ ] Créer `src/lib/auth-client.ts` :
  ```ts
  import { createAuthClient } from "better-auth/react"
  export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  })
  export const { signIn, signUp, signOut, useSession } = authClient
  ```
  Le re-export nommé limite la surface d'import côté pages.
- [ ] Ajouter `.env.example` à la racine avec la variable `VITE_AUTH_BASE_URL=http://localhost:8000` + un commentaire au-dessus expliquant que **le template ne livre aucun serveur** — c'est à l'user de pointer ici un backend better-auth (son propre serveur, le template backend perso, ou une autre instance compat).
- [ ] Page démo `src/pages/auth.tsx` (route `/auth` ajoutée à `src/router.tsx`) :
  - Deux cartes shadcn (`Card`) côte-à-côte : **Sign in** (email + password) et **Sign up** (name + email + password).
  - Formulaires avec composants shadcn (`Input`, `Label`, `Button`) + `useSignal()` pour l'état local des champs.
  - **Bandeau d'alerte affiché en haut de page, toujours visible** :
    - Si `import.meta.env.VITE_AUTH_BASE_URL` est `undefined` ou vide → `Alert variant="destructive"` : *"No auth backend configured. Set `VITE_AUTH_BASE_URL` in your `.env` to point at a running better-auth server."*
    - Sinon → `Alert` info : *"Auth backend: `<VITE_AUTH_BASE_URL value>`"* — l'URL est affichée littéralement à l'écran pour rendre le couplage explicite et débuggable d'un coup d'œil.
  - Sous les deux cartes : bloc "Current session" qui lit `useSession()` (loading / signed-in user + bouton Sign out / not signed in).
- [ ] Ajouter un lien `/auth` dans le header du layout `src/layouts/root.tsx` à côté du lien Showcase — accessible depuis n'importe quelle page.
- [ ] Section **Authentication** dans le README, insérée juste après la section Signals : explique le découplage frontend / backend (le template ne ship que le client), le rôle de `VITE_AUTH_BASE_URL`, et pointe vers la doc officielle [better-auth.com](https://better-auth.com) pour monter un serveur. Mentionner explicitement que tester `/auth` sans backend = bandeau rouge + formulaires en erreur réseau attendue.

**Vérif** :
- `pnpm dev` sans `.env` (ou `VITE_AUTH_BASE_URL` vide) : la page `/auth` rend les formulaires + bandeau rouge — pas de crash, pas d'écran blanc.
- Avec un backend better-auth lancé sur la baseURL configurée : sign-up → user créé côté serveur, session établie, `useSession()` affiche le user dans le bloc inférieur, bouton Sign out fonctionnel.
- `pnpm typecheck` + `pnpm build` verts (le client `better-auth` est entièrement typé).

**Notes** (à compléter une fois implémenté) : TBD.

---

## S18 — `@fluch/signal-store` (state management) (bonus, hors SPEC initiale)
**But** : ajouter `@fluch/signal-store` au template avec un exemple minimal qui démontre la composition `withState` + `withComputed` + `withMethods`. Cohérent avec le choix Signals déjà fait en S04 — le store est une couche de composition au-dessus, qui rend `withState`/`withComputed` réactifs sans Provider ni hook.

- [ ] Installer les dépendances core : `pnpm add @fluch/signal-store @preact/signals-core rxjs`.
  - `@preact/signals-core` est déjà tiré transitivement par `@preact/signals-react` (S04), mais le déclarer en direct est plus propre (visibilité dans `package.json`).
  - `rxjs` est requis par `rxMethod` (cf. `references/core.md`) — installé même si l'exemple v1 du template ne s'en sert pas, pour ne pas obliger l'user à le rajouter dès qu'il touche aux side-effects async.
- [ ] Créer `src/stores/counter.ts` : exemple minimal `signalStore(withState, withComputed, withMethods)` (compteur avec `count`, dérivés `double` + `isPositive`, méthodes `increment` / `decrement` / `reset`) — repris quasi-mot pour mot de la section "Complete example" du SKILL.md du package (cf. `skills/@fluch-signal-store/SKILL.md`).
- [ ] Câbler la démo dans la **Showcase** (page existante S06) : nouvelle section "Signal Store" avec 3 boutons (increment / decrement / reset) et l'affichage live des 3 valeurs (`count.value` / `double.value` / `isPositive.value`). Le Babel transform Signals (S04) rend la subscription auto — **pas de hook**, juste lire `.value` dans le JSX.
- [ ] Section **State management** dans le README, juste après la section Signals : positionne `@preact/signals-react` (réactivité fine, S04) vs `@fluch/signal-store` (composition de state). Pointe vers `skills/@fluch-signal-store/SKILL.md` + `skills/@fluch-signal-store/references/` pour la suite (entities, React Provider scopé, RxJS side-effects, Redux DevTools).

**Vérif** :
- `pnpm dev` : la Showcase affiche la section Signal Store, les 3 valeurs sont live, les 3 boutons mutent l'état sans re-render manuel ni `useState`.
- `pnpm typecheck` : aucune erreur, l'inférence du store est complète (autocomplete sur `store.count.value`, `store.double.value`, `store.increment()`, etc.).
- `pnpm build` : OK. Coût indicatif : ~3 kb gzip d'après le SKILL.md.

**Notes** (à compléter une fois implémenté) : TBD.

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

---

## S16 — Governance avancée : CODEOWNERS + FUNDING (optionnelle)
**But** : verrouiller la gouvernance sur les zones sensibles et offrir un canal de sponsoring. **Story optionnelle** : à n'exécuter que si le projet attire des contributeurs externes (signal : 3+ PRs externes/mois) ou si le maintainer active GitHub Sponsors.

- [ ] `.github/CODEOWNERS` : règle catch-all `* @<maintainer-handle>` au départ. Affiner plus tard (`/src/components/ui/ @design`, `/.github/ @devops`) seulement quand il y a des co-maintainers — sinon c'est du bruit.
- [ ] Activer en branch protection rule sur `main` : **Require review from Code Owners**. Effet : aucune PR ne merge sans l'aval du maintainer désigné.
- [ ] `.github/FUNDING.yml` : déclarer les plateformes (`github: <handle>`, `ko_fi: …`, `custom: [url]`). **Pré-requis** : avoir un compte GitHub Sponsors configuré, sinon le bouton "Sponsor" n'apparaît pas.

**Vérif** :
- PR test : le maintainer est auto-request en reviewer.
- Bouton "Sponsor" affiché en tête du repo si FUNDING.yml + compte Sponsor valides.

**Notes** (à compléter une fois implémenté) : TBD.
