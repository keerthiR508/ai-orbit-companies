'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Props = {
  slug: string
  name: string
}

export function ShareCompanyButton({ slug, name }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/companies/${slug}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-primary/60 hover:bg-card active:scale-[0.98]"
      aria-label={`Share ${name}`}
    >
      {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
      <span>{copied ? 'Link Copied' : 'Share'}</span>
    </button>
  )
}
