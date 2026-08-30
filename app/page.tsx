import { SiteHeader } from '@/components/site-header'
import { ModuleNav } from '@/components/module-nav'
import { CompaniesView } from '@/components/companies-view'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <ModuleNav />
      <div className="flex-1">
        <CompaniesView />
      </div>
      <footer className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        AIORBIT · Global AI Ecosystem Directory & Curation · Built for developers and researchers
      </footer>
    </main>
  )
}
