---
"fluch-react-signals-starter": minor
---

Add `@fluch/signal-store` (state management) on top of `@preact/signals-react`. New `src/stores/counter.ts` shows `signalStore(withState + withComputed + withMethods)` composition, surfaced live on `/showcase` (top section). README gets a new "State management" section pointing at the vendored `skills/@fluch-signal-store/` cheat-sheets. Adds `@fluch/signal-store@^1.1.1`, `@preact/signals-core@^1.14.2`, and `rxjs@^7.8.2` (the latter is required by `rxMethod` for cancellable async — installed up front so forks don't have to add it later).
