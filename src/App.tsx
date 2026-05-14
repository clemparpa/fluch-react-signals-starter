function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            fluch-react-signals-starter
          </h1>
          <p className="text-muted-foreground">
            Template React + Vite + Tailwind v4 + shadcn (Base UI) + signals.
          </p>
        </header>

        <section className="rounded-lg border border-border bg-card text-card-foreground p-6 space-y-3">
          <h2 className="text-xl font-medium">Tokens sanity check</h2>
          <p className="text-sm text-muted-foreground">
            Cette card utilise <code className="font-mono">bg-card</code>,
            <code className="font-mono"> text-card-foreground</code>,
            <code className="font-mono"> border-border</code> et
            <code className="font-mono"> rounded-lg</code>. Toggle la classe
            <code className="font-mono"> dark</code> sur
            <code className="font-mono"> &lt;html&gt;</code> via les devtools
            pour vérifier le dark mode.
          </p>
          <div className="flex gap-2">
            <div className="rounded-sm bg-primary text-primary-foreground px-3 py-1 text-sm">
              primary
            </div>
            <div className="rounded-sm bg-secondary text-secondary-foreground px-3 py-1 text-sm">
              secondary
            </div>
            <div className="rounded-sm bg-accent text-accent-foreground px-3 py-1 text-sm">
              accent
            </div>
            <div className="rounded-sm bg-destructive text-destructive-foreground px-3 py-1 text-sm">
              destructive
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
