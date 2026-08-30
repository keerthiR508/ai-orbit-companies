'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { BookmarkButton } from '@/components/bookmark-button'
import { formatNumber, formatValuation, type Company } from '@/lib/company-format'

type Props = {
  companies: Company[]
}

export function CompanyTable({ companies }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  const share = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/companies/${slug}`)
      setCopied(slug)
      setTimeout(() => setCopied(null), 1600)
    } catch {}
  }

  return (
    <div className="w-full">
      {/* Desktop and Tablet Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-border/70 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-3 py-3 font-semibold">Company</th>
              <th className="px-3 py-3 font-semibold">Country</th>
              <th className="px-3 py-3 font-semibold">Valuation</th>
              <th className="px-3 py-3 font-semibold">Val / Emp</th>
              <th className="px-3 py-3 font-semibold">AI Native</th>
              <th className="px-3 py-3 font-semibold">Profitable</th>
              <th className="px-3 py-3 font-semibold">Sector</th>
              <th className="px-3 py-3 font-semibold text-center">Models</th>
              <th className="px-3 py-3 font-semibold text-center">Tools</th>
              <th className="px-3 py-3 font-semibold text-center">Share</th>
              <th className="px-3 py-3 font-semibold text-center">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {companies.map((company) => {
              const valPerEmp =
                company.employees > 0
                  ? Math.round((company.valuation * 1000) / company.employees)
                  : 0

              return (
                <tr
                  key={company.slug}
                  className="group transition hover:bg-card/70"
                >
                  <td className="px-3 py-3.5">
                    <Link
                      href={`/companies/${company.slug}`}
                      className="flex min-w-[200px] items-center gap-3"
                    >
                      <div
                        className={`logo logo-${company.logoTone} size-9 shrink-0 text-[10px] rounded-md`}
                      >
                        {company.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1 font-medium text-sm text-foreground transition-colors group-hover:text-primary">
                          <span className="truncate">{company.name}</span>
                          {company.verified && (
                            <span className="grid size-3.5 place-items-center rounded-full bg-primary text-primary-foreground shrink-0">
                              <Check size={9} />
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                          {company.tagline}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-3 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    {company.country}
                  </td>

                  <td className="px-3 py-3.5 text-xs font-semibold text-foreground whitespace-nowrap">
                    {formatValuation(company.valuation)}
                  </td>

                  <td className="px-3 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    {formatValuation(valPerEmp)}
                  </td>

                  <td className="px-3 py-3.5 text-xs whitespace-nowrap">
                    {company.aiNative ? (
                      <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  <td className="px-3 py-3.5 text-xs whitespace-nowrap">
                    {company.profitable ? (
                      <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  <td className="px-3 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-[11px]">
                      {company.sector}
                    </span>
                  </td>

                  <td className="px-3 py-3.5 text-xs text-center font-mono text-muted-foreground whitespace-nowrap">
                    {formatNumber(company.models)}
                  </td>

                  <td className="px-3 py-3.5 text-xs text-center font-mono text-muted-foreground whitespace-nowrap">
                    {formatNumber(company.tools)}
                  </td>

                  <td className="px-3 py-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => share(company.slug, e)}
                      aria-label={`Share ${company.name}`}
                      className="inline-flex size-7 items-center justify-center rounded-md border border-border/50 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                      title="Share link"
                    >
                      {copied === company.slug ? (
                        <Check size={13} className="text-primary" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </td>

                  <td className="px-3 py-3.5 text-center whitespace-nowrap">
                    <BookmarkButton slug={company.slug} iconOnly />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col divide-y divide-border/60 md:hidden">
        {companies.map((company) => (
          <Link
            href={`/companies/${company.slug}`}
            key={company.slug}
            className="flex items-center justify-between gap-3 py-4 transition hover:bg-card/50 px-1"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`logo logo-${company.logoTone} size-10 shrink-0 text-xs rounded-lg`}
              >
                {company.initials}
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-sm font-semibold">
                  <span className="truncate">{company.name}</span>
                  {company.verified && (
                    <span className="grid size-3.5 place-items-center rounded-full bg-primary text-primary-foreground shrink-0">
                      <Check size={9} />
                    </span>
                  )}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {company.sector} · {company.country}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-foreground">
                {formatValuation(company.valuation)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {company.models} models
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
