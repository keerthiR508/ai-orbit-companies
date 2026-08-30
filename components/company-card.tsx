'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Copy, ExternalLink, Sparkles, Building2, Users, Cpu, Wrench } from 'lucide-react'
import { BookmarkButton } from '@/components/bookmark-button'
import { formatNumber, formatValuation, type Company } from '@/lib/company-format'

type Props = {
  company: Company
}

export function CompanyCard({ company }: Props) {
  const [copied, setCopied] = useState(false)

  const share = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/companies/${company.slug}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-border/70 bg-card/40 p-5 transition-all duration-200 hover:border-primary/50 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/companies/${company.slug}`} className="absolute inset-0 z-0 rounded-lg" aria-label={`View ${company.name}`} />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`logo logo-${company.logoTone} size-12 shrink-0 rounded-lg text-sm shadow-inner`}>
              {company.initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {company.name}
                </span>
                {company.verified && (
                  <span className="grid size-3.5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check size={9} />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground">{company.country}</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-1">
            <button
              type="button"
              onClick={share}
              aria-label={`Share ${company.name}`}
              className="grid size-7 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
              title="Share company link"
            >
              {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
            </button>
            <BookmarkButton slug={company.slug} iconOnly />
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
          {company.tagline}
        </p>

        {/* Sector and AI Native badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
            {company.sector}
          </span>
          {company.aiNative && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
              <Sparkles size={9} />
              AI Native
            </span>
          )}
          {company.profitable && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
              Profitable
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-border/50 pt-3">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Valuation</span>
            <span className="font-semibold text-foreground">{formatValuation(company.valuation)}</span>
          </div>
          <div className="flex flex-col border-x border-border/40">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Team</span>
            <span className="font-medium text-foreground">{formatNumber(company.employees)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Models</span>
            <span className="font-medium text-foreground">{company.models}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
