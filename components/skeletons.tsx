export function TableSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="w-full animate-pulse">
      <div className="hidden border-b border-border/60 pb-3 md:grid md:grid-cols-11 gap-3 px-3">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="h-3 rounded bg-muted/60" />
        ))}
      </div>
      <div className="divide-y divide-border/40">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-4 md:grid md:grid-cols-11 md:gap-3 px-3">
            <div className="flex items-center gap-3 md:col-span-3">
              <div className="size-9 shrink-0 rounded-md bg-muted/70" />
              <div className="flex flex-col gap-2 w-32">
                <div className="h-4 w-24 rounded bg-muted/70" />
                <div className="h-3 w-36 rounded bg-muted/40" />
              </div>
            </div>
            <div className="hidden md:block h-3.5 w-16 rounded bg-muted/50" />
            <div className="hidden md:block h-3.5 w-14 rounded bg-muted/60" />
            <div className="hidden md:block h-3.5 w-14 rounded bg-muted/40" />
            <div className="hidden md:block h-3.5 w-8 rounded bg-muted/40" />
            <div className="hidden md:block h-3.5 w-8 rounded bg-muted/40" />
            <div className="hidden md:block h-3.5 w-20 rounded bg-muted/50" />
            <div className="hidden md:block h-3.5 w-8 rounded bg-muted/40" />
            <div className="hidden md:block h-3.5 w-8 rounded bg-muted/40" />
            <div className="hidden md:flex items-center gap-2">
              <div className="size-6 rounded bg-muted/40" />
              <div className="size-6 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col rounded-lg border border-border/60 bg-card/40 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="size-11 rounded-lg bg-muted/70" />
            <div className="flex gap-1">
              <div className="size-7 rounded bg-muted/40" />
              <div className="size-7 rounded bg-muted/40" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="h-4 w-32 rounded bg-muted/70" />
            <div className="h-3 w-48 rounded bg-muted/40" />
            <div className="h-3 w-40 rounded bg-muted/30" />
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
            <div className="h-3.5 w-16 rounded bg-muted/50" />
            <div className="h-3.5 w-14 rounded bg-muted/50" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-8">
      <div className="h-4 w-28 rounded bg-muted/60" />
      <div className="flex flex-col gap-4 border-b border-border/60 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex gap-4 items-center">
          <div className="size-20 rounded-xl bg-muted/70" />
          <div className="flex flex-col gap-2.5">
            <div className="h-8 w-48 rounded bg-muted/70" />
            <div className="h-4 w-72 rounded bg-muted/40" />
            <div className="h-3 w-40 rounded bg-muted/30" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded bg-muted/60" />
          <div className="h-9 w-24 rounded bg-muted/60" />
          <div className="h-9 w-28 rounded bg-muted/80" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="border border-border/60 bg-card/30 p-4 rounded-md">
            <div className="h-3 w-16 rounded bg-muted/40" />
            <div className="mt-3 h-6 w-20 rounded bg-muted/70" />
          </div>
        ))}
      </div>
    </div>
  )
}
