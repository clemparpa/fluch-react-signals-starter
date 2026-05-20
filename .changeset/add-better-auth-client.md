---
"fluch-react-signals-starter": minor
---

Add better-auth client (sign-in / sign-up / session) on a new `/auth` page. The template ships only the client — point `VITE_AUTH_BASE_URL` at a running better-auth backend (see `.env.example`). Without a backend, `/auth` renders a red alert banner instead of crashing. Adds `src/lib/auth-client.ts`, `src/pages/auth.tsx`, `src/vite-env.d.ts`, a Vitest cover for the disconnected state, and an Authentication section in the README.
