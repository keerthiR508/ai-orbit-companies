import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ExternalLink,
  Sparkles,
  Building2,
  Globe,
  Calendar,
  Layers,
  Users,
  Cpu,
  Wrench,
  TrendingUp,
  ShieldCheck
} from 'lucide-react'
import { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { ModuleNav } from '@/components/module-nav'
import { BookmarkButton } from '@/components/bookmark-button'
import { ShareCompanyButton } from '@/components/share-company-button'
import { getCompany, getCompanies, formatNumber, formatValuation } from '@/lib/companies'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompany(slug)
  if (!company) {
    return {
      title: 'Company Not Found — AIORBIT'
    }
  }
  return {
    title: `${company.name} — AIORBIT Companies`,
    description: company.description
  }
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params
  const company = await getCompany(slug)

  if (!company) notFound()

  const relatedResult = await getCompanies({ category: company.sector, limit: 4 })
  const related = relatedResult.companies
    .filter((item) => item.slug !== company.slug)
    .slice(0, 3)

  const valPerEmployee =
    company.employees > 0
      ? Math.round((company.valuation * 1000) / company.employees)
      : 0

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <ModuleNav />

      <div className="mx-auto w-full max-w-[1240px] flex-1 px-5 py-8">
        {/* Navigation Breadcrumb */}
        <Link
          href="/companies"
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={14} /> Back to Companies
        </Link>

        {/* Company Header Hero */}
        <section className="flex flex-col gap-6 border-b border-border/70 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className={`logo logo-${company.logoTone} size-20 shrink-0 text-2xl shadow-xl rounded-xl`}
            >
              {company.initials}
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {company.name}
                </h1>

                {company.verified && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-xs font-medium text-primary"
                    title="Verified AI Enterprise"
                  >
                    <Check size={12} />
                    <span>Verified</span>
                  </span>
                )}

                {company.aiNative && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Sparkles size={11} />
                    AI Native
                  </span>
                )}

                {company.profitable && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    Profitable
                  </span>
                )}
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {company.tagline}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Globe size={13} /> {company.country}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> Founded {company.founded}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers size={13} /> {company.sector}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <BookmarkButton slug={company.slug} />
            <ShareCompanyButton slug={company.slug} name={company.name} />
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98]"
            >
              <span>Visit Website</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        {/* 7 Key Stats Metrics Grid */}
        <section className="grid gap-3 py-8 sm:grid-cols-2 lg:grid-cols-7">
          {[
            { label: 'Valuation', value: formatValuation(company.valuation), icon: TrendingUp },
            { label: 'Employees', value: formatNumber(company.employees), icon: Users },
            { label: 'Val / Employee', value: formatValuation(valPerEmployee), icon: Building2 },
            { label: 'Models', value: formatNumber(company.models), icon: Cpu },
            { label: 'Tools & APIs', value: formatNumber(company.tools), icon: Wrench },
            { label: 'AI Native', value: company.aiNative ? 'Yes' : 'No', icon: Sparkles },
            { label: 'Profitable', value: company.profitable ? 'Yes' : 'No', icon: ShieldCheck }
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="group rounded-lg border border-border/70 bg-card/35 p-4 transition hover:border-primary/40 hover:bg-card/60"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-mono">
                  {label}
                </p>
                <Icon size={13} className="text-muted-foreground/60 group-hover:text-primary transition-colors" />
              </div>
              <p className="mt-2.5 text-xl font-bold text-foreground tracking-tight">{value}</p>
            </div>
          ))}
        </section>

        {/* Two column details & company information drawer */}
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="flex flex-col gap-9">
            {/* About */}
            <section className="rounded-xl border border-border/70 bg-card/25 p-6">
              <h2 className="mb-3 text-base font-semibold text-foreground">
                About {company.name}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {company.description}
              </p>

              {/* Tags / Categories */}
              <div className="mt-5 flex flex-wrap gap-2">
                {company.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </section>

            {/* Products & Models */}
            <section>
              <h2 className="mb-4 text-base font-semibold text-foreground">
                Products & Models
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {company.products.map((product) => (
                  <a
                    key={product}
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col justify-between rounded-lg border border-border/70 bg-card/30 p-4 text-sm font-medium transition hover:border-primary/60 hover:bg-card/60"
                  >
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {product}
                    </span>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Official Product</span>
                      <ExternalLink size={13} className="group-hover:text-primary transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Specs Table */}
          <aside className="h-fit rounded-xl border border-border/70 bg-card/30 p-6">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Company Overview
            </h2>
            <dl className="flex flex-col divide-y divide-border/50 text-xs">
              {[
                ['Company Type', company.type],
                ['Headquarters', company.country],
                ['Founded Year', String(company.founded)],
                ['Primary Sector', company.sector],
                ['Total Models', formatNumber(company.models)],
                ['Total Tools', formatNumber(company.tools)],
                ['Website', company.website.replace('https://', '')]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* Related Companies */}
        {related.length > 0 && (
          <section className="mt-14 border-t border-border/70 pt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Related {company.sector} Companies
              </h2>
              <Link
                href={`/companies?category=${encodeURIComponent(company.sector)}`}
                className="text-xs text-primary hover:underline"
              >
                View all in {company.sector} →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  href={`/companies/${item.slug}`}
                  key={item.slug}
                  className="group flex items-center justify-between rounded-lg border border-border/70 bg-card/30 p-4 transition hover:border-primary/50 hover:bg-card/60"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`logo logo-${item.logoTone} size-10 text-xs rounded-lg`}
                    >
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold">{formatValuation(item.valuation)}</p>
                    <p className="text-[10px] text-muted-foreground">{item.models} models</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        AIORBIT · Global AI Ecosystem Directory & Curation · Built for developers and researchers
      </footer>
    </main>
  )
}
