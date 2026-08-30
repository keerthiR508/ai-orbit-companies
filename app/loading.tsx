import { SiteHeader } from '@/components/site-header'
import { ModuleNav } from '@/components/module-nav'
import { DetailSkeleton } from '@/components/skeletons'

export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <ModuleNav />
      <div className="mx-auto w-full max-w-[1240px] flex-1 px-5 py-8">
        <DetailSkeleton />
      </div>
    </main>
  )
}
