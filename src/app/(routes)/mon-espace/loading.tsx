export default function MonEspaceLoading() {
  return (
    <main className="container mx-auto max-w-5xl space-y-8 py-10 px-4">
      <div className="h-10 w-40 animate-pulse rounded bg-muted" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </main>
  );
}


