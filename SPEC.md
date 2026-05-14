# Spec — Template `fluch-react-signals-starter`

Template React prêt à l'emploi pour bootstraper un projet stylé via un agent IA. Le repo template est l'environnement dans lequel l'agent va appliquer un thème shadcn généré depuis un `DESIGN.md`.

## 1. Stack figée

| Brique | Choix | Justification |
|---|---|---|
| Build | **Vite 5+** | Léger, HMR rapide, pas de SSR inutile |
| Plugin React | **`@vitejs/plugin-react`** (Babel) | Nécessaire pour injecter le transform Signals — SWC n'exécute pas de plugin Babel |
| Framework | **React 19** | Stable, compat Base UI et Signals via Babel transform |
| Routing | **React Router 7 — data router SPA** (`createBrowserRouter`) | Framework mode incompatible avec le Babel transform de Signals (le plugin `reactRouter()` remplace `@vitejs/plugin-react` et n'expose pas d'option `babel`). Data router suffit pour un SPA pur. |
| State | **`@preact/signals-react`** ≥ 2.3.0 + **`@preact/signals-react-transform`** | API minimale, pas de Provider, transform Babel auto. v3+ de signals-react a retiré l'auto-tracking via internals React 19 → le transform Babel est la seule voie auto. |
| CSS | **Tailwind CSS v4** + **`@tailwindcss/vite`** | Config CSS-first (`@theme`), HMR natif |
| Composants | **shadcn/ui (variant Base UI)** | Base UI plus complet que Radix (Combobox, Drawer…), API proche, stable depuis déc 2025 |
| Lang | TypeScript strict étendu | `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch` |
| Package manager | **pnpm** ≥ 9 | — |
| Runtime | **Node ≥ 22** | Fixé via `engines` + `.nvmrc` |
| Lint + Format | **Biome** | Un seul outil pour les deux, rapide |
| Tests | **Vitest** + `happy-dom` + `@testing-library/react` | happy-dom plus rapide que jsdom |
| Pre-commit | **Husky** + **lint-staged** | `biome check --write` + `pnpm typecheck` |
| CI | **GitHub Actions** | lint + typecheck + test + audit en parallèle |
| Audit deps | `pnpm audit --audit-level=high` | bloque en CI sur high/critical |

## 2. Structure du repo

```
fluch-react-signals-starter/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   └── pre-commit
├── src/
│   ├── components/
│   │   └── ui/                  # composants shadcn (variant Base UI), via `shadcn add --all`
│   ├── pages/
│   │   ├── showcase.tsx         # vue exhaustive — cible visuelle du skill apply-theme
│   │   └── home.tsx             # placeholder pour l'app de l'user
│   ├── lib/
│   │   ├── utils.ts             # cn() helper (généré par shadcn init)
│   │   └── signals.ts           # signals partagés (ex: themeMode)
│   ├── styles/
│   │   └── globals.css          # ★ cible d'écriture du skill apply-theme
│   ├── test/
│   │   ├── setup.ts             # @testing-library/jest-dom + cleanup
│   │   └── showcase.test.tsx    # test d'exemple
│   ├── router.tsx
│   ├── App.tsx
│   └── main.tsx
├── designs/
│   └── active.md                # placeholder ; modifié par le futur skill apply-theme (source de vérité du thème)
├── public/
├── components.json              # config shadcn (variant Base UI, Tailwind v4)
├── biome.json
├── vite.config.ts               # inclut la config Vitest via la clé `test`
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── .nvmrc
├── README.md
└── STORIES.md                   # backlog de setup du template
```

## 3. Fichiers clés

### 3.1 `vite.config.ts`
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['@preact/signals-react-transform', { mode: 'auto' }]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

### 3.2 `src/styles/globals.css` (forme initiale — cible du skill apply-theme)

Tokens **en oklch** (format shadcn v4 actuel). `:root` pour light, `.dark` pour dark, et `@theme inline` qui expose ces vars à Tailwind v4.

```css
@import 'tailwindcss';

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}
```

### 3.3 `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

> Le flag/clé exacte pour sélectionner le variant Base UI sera confirmée à l'exécution via `pnpm dlx shadcn@latest init --help` puis figée ici. La doc shadcn évolue, on prend la sortie de la CLI comme source de vérité.

### 3.4 `src/lib/signals.ts`

```ts
import { effect, signal } from '@preact/signals-react'

export const themeMode = signal<'light' | 'dark'>('light')

if (typeof window !== 'undefined') {
  effect(() => {
    document.documentElement.classList.toggle('dark', themeMode.value === 'dark')
  })
}
```

### 3.5 `src/router.tsx` (data router SPA)

```tsx
import { createBrowserRouter } from 'react-router'
import Home from './pages/home'
import Showcase from './pages/showcase'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/showcase', element: <Showcase /> },
])
```

### 3.6 `tsconfig.json` (extraits stricts en plus du `strict: true`)

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
    // … reste standard Vite/React
  }
}
```

### 3.7 `biome.json`

Config par défaut Biome 2.x : `formatter.enabled: true`, `linter.enabled: true`, recommended rules, organize imports activé.

### 3.8 `.husky/pre-commit`

```sh
pnpm exec lint-staged
pnpm typecheck
```

`lint-staged` dans `package.json` :

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx,json,css}": ["biome check --write"]
}
```

### 3.9 `.github/workflows/ci.yml`

4 jobs en parallèle sur push/PR : `lint` (`biome ci`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `audit` (`pnpm audit --audit-level=high`). Setup Node 22 + pnpm via `pnpm/action-setup`.

## 4. Composants shadcn — install au boot

`pnpm dlx shadcn@latest init` (variant Base UI), puis `pnpm dlx shadcn@latest add --all` pour installer tous les composants en une fois. Plus de liste manuelle à maintenir.

Pour la showcase, **pomper les exemples du registry shadcn** (variant Base UI) plutôt que d'écrire chaque section de zéro :

- Source : `apps/v4/registry/bases/base/examples/*-example.tsx` dans `shadcn-ui/ui`.
- Récupération : `pnpm dlx shadcn@latest docs <component>` puis fetch des fichiers, ou via la registry directement.

## 5. Page Showcase — contenu

La page `/showcase` est la **cible visuelle** que le skill `apply-theme` cherche à modifier. Elle doit couvrir tous les tokens pour qu'une modif sur `globals.css` soit immédiatement perceptible.

Sections, dans l'ordre :

1. **Header** : titre "Showcase" + toggle dark/light (via `themeMode` signal).
2. **Palette** : swatches pour chaque token (`background`, `foreground`, `primary`, `secondary`, `accent`, `muted`, `destructive`, `border`, `ring`, `card`, `popover`) en light ET dark côte à côte. Affiche le nom du token + sa valeur oklch.
3. **Typography** : h1→h6, paragraphe, small, code inline, blockquote, lien. Famille sans + mono.
4. **Spacing & Radius** : démo visuelle des radii (`--radius-sm`, `-md`, `-lg`) sur boxes.
5. **Buttons** : matrice variants × sizes.
6. **Form** : `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `RadioGroup`, `Switch`, `Slider` — avec labels et états (default, disabled, error).
7. **Cards** : card vide, card avec header, card avec form inline.
8. **Overlays** : `Dialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`.
9. **Navigation** : `Tabs`, `Accordion`, `DropdownMenu` (avec sous-menu).
10. **Feedback** : `Alert` (4 variantes), `Sonner` (toast — bouton de déclenchement), `Progress`, `Skeleton`.
11. **Data display** : `Badge`, `Avatar`, `Separator` (h+v).

Chaque section pompe ou adapte le `*-example.tsx` correspondant du registry Base UI.

## 6. Contrat du futur skill `apply-theme`

Hors scope de la spec template, mais on fige le contrat pour orienter la structure :

- **Input** : `designs/active.md` (schéma open-design 9 sections).
- **Output** : réécriture complète de `src/styles/globals.css` uniquement. Touche pas au reste.
- **Mappings indicatifs** :
  - Section "Color" → vars `--background`, `--foreground`, `--primary`… **en oklch** (format shadcn v4).
  - Section "Typography" → `--font-sans`, `--font-mono`, éventuellement `--font-display`.
  - Section "Spacing & Grid" → `--radius` + éventuels overrides Tailwind via `@theme`.
  - Section "Motion" → durations en CSS vars custom (`--duration-fast`, `--duration-base`).
- **Garantie** : ne casse jamais la page `/showcase`. Les noms de tokens shadcn restent constants.

## 7. Outillage CI & qualité

- **Pre-commit** (Husky + lint-staged) : `biome check --write` sur les fichiers staged, puis `tsc --noEmit` global. Pas de bypass.
- **CI** (GitHub Actions) — 4 jobs en parallèle sur PR et push `main` :
  - `lint` : `biome ci`
  - `typecheck` : `tsc --noEmit`
  - `test` : `vitest run`
  - `audit` : `pnpm audit --audit-level=high`
- **Scripts `package.json`** : `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `audit`, `prepare` (husky).

## 8. Risques et points à valider en cours d'exécution

1. **shadcn CLI — flag pour variant Base UI** : la clé exacte (`--base base` ? `--style base` ? autre ?) sera confirmée via `--help` au moment du run et figée dans `components.json` après coup.
2. **React 19 + Base UI + Signals transform** : combinaison à valider sur un `Dialog` + `Combobox` (composants les plus sensibles aux subtilités de rendu).
3. **`shadcn add --all`** : confirmer que le flag existe encore et qu'il installe bien la variante Base UI sélectionnée à l'init.
4. **Pomp des `*-example.tsx`** : certains exemples peuvent référencer des assets/données mock (faker, images) qu'il faudra remplacer ou installer.

## 9. Ordre de mise en place

Voir [STORIES.md](STORIES.md) à la racine — découpé en stories ordonnées et indépendamment exécutables.
