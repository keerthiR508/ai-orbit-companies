'use client'

import Link from 'next/link'
import { RotateCcw, AlertTriangle } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center px-5 py-24 text-center">
        <div className="mb-4 grid size-16 place-items-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle size={28} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Something went wrong</h1>
        <p className="mt-3 max-w-md text-xs text-muted-foreground">
          {error.message || 'An unexpected error occurred while rendering the AI Companies index.'}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <RotateCcw size={14} /> Try again
          </button>
          <Link
            href="/companies"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Return to Index
          </Link>
        </div>
      </div>
      <footer className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        AIORBIT · Global AI Ecosystem Directory & Curation
      </footer>
    </main>
  )
}
