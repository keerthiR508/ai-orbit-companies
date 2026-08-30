'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Loader2 } from 'lucide-react'

type Props = {
  slug: string
  className?: string
  iconOnly?: boolean
}

export function BookmarkButton({ slug, className = '', iconOnly = false }: Props) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    // First try localStorage for instant responsive client-side persistence
    try {
      const stored = localStorage.getItem('aiorbit_saved_companies')
      if (stored) {
        const list = JSON.parse(stored)
        if (Array.isArray(list) && list.includes(slug)) {
          setSaved(true)
        }
      }
    } catch {}

    // Then check server API if accessible
    fetch(`/api/bookmarks/${slug}`, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { saved?: boolean } | null) => {
        if (active && data && typeof data.saved === 'boolean') {
          setSaved(data.saved)
        }
      })
      .catch(() => {
        // Fail quietly with local state intact
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  async function toggle(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (pending) return
    setPending(true)
    setError(false)
    const nextSaved = !saved
    setSaved(nextSaved)

    // Sync localStorage
    try {
      const stored = localStorage.getItem('aiorbit_saved_companies')
      let list: string[] = stored ? JSON.parse(stored) : []
      if (!Array.isArray(list)) list = []
      if (nextSaved) {
        if (!list.includes(slug)) list.push(slug)
      } else {
        list = list.filter((s) => s !== slug)
      }
      localStorage.setItem('aiorbit_saved_companies', JSON.stringify(list))
    } catch {}

    // Try server sync
    try {
      await fetch(`/api/bookmarks/${slug}`, {
        method: nextSaved ? 'POST' : 'DELETE'
      })
    } catch {
      // Keep local state
    } finally {
      setPending(false)
    }
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-label={saved ? 'Remove bookmark' : 'Save company'}
        className={`inline-flex size-8 items-center justify-center rounded-md border transition-colors ${
          saved
            ? 'border-primary/50 bg-primary/10 text-primary'
            : 'border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground'
        } ${className}`}
      >
        {pending ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={saved ? 'Remove bookmark' : 'Save company'}
      title={error ? 'Bookmark unavailable. Try again.' : undefined}
      className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors ${
        saved
          ? 'border-primary/50 bg-primary/15 text-primary'
          : 'border-border/70 text-foreground hover:border-primary/70 hover:bg-card/60'
      } ${className}`}
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
      ) : (
        <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
      )}
      <span>{saved ? 'Bookmarked' : 'Bookmark'}</span>
    </button>
  )
}
