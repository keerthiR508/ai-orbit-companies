import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { ModuleNav } from '@/components/module-nav'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <ModuleNav />
      <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center px-5 py-24 text-center">
        <div className="mb-4 grid size-16 place-items-center rounded-2xl border border-border bg-card/60 text-primary">
          <Search size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Company Not Found</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          The AI company you are looking for does not exist or has been relocated in the index.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft size={14} /> Back to Companies
          </Link>
        </div>
      </div>
      <footer className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        AIORBIT · Global AI Ecosystem Directory & Curation
      </footer>
    </main>
  )
}
