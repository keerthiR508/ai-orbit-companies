'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, X, Sparkles } from 'lucide-react'

export function SiteHeader() {
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [toolName, setToolName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowSubmitModal(false)
      setToolName('')
    }, 1800)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-sm font-semibold tracking-[0.18em] transition-opacity hover:opacity-90"
            >
              <span className="grid size-7 place-items-center rounded-md bg-primary font-bold text-primary-foreground shadow-sm shadow-primary/30">
                A
              </span>
              <span>AIORBIT</span>
            </Link>

            <nav className="hidden items-center gap-6 text-xs text-muted-foreground md:flex">
              <Link href="/companies" className="text-foreground transition hover:text-primary">
                Companies
              </Link>
              <span className="cursor-pointer transition hover:text-foreground">Business AI</span>
              <span className="cursor-pointer transition hover:text-foreground">Leaderboard</span>
              <span className="cursor-pointer transition hover:text-foreground">Resources</span>
              <span className="cursor-pointer transition hover:text-foreground">Newsletter</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowLoginModal(true)}
              className="hidden rounded-md border border-border/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/60 hover:text-foreground sm:block"
            >
              Log In
            </button>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98]"
            >
              <Plus size={14} />
              <span>Submit Company</span>
            </button>
          </div>
        </div>
      </header>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="mb-4 flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-primary/20 text-primary">
                <Sparkles size={16} />
              </div>
              <h3 className="text-base font-semibold">Submit an AI Company</h3>
            </div>
            <p className="mb-5 text-xs text-muted-foreground">
              Suggest an AI company or model maker to be featured in the AI Orbit index.
            </p>

            {submitted ? (
              <div className="rounded-lg border border-primary/40 bg-primary/10 p-4 text-center text-xs text-primary">
                ✓ Thank you! Company submission received for curation.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Company Name</label>
                  <input
                    required
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g. Acme AI"
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Website URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://..."
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Sector / Category</label>
                  <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-xs outline-none focus:border-primary">
                    <option>Foundation Models</option>
                    <option>Developer Tools</option>
                    <option>Generative AI</option>
                    <option>Infrastructure</option>
                    <option>Enterprise</option>
                    <option>Open Source</option>
                  </select>
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="rounded-md border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl text-center">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="mx-auto mb-3 grid size-10 place-items-center rounded-xl bg-primary/20 text-primary font-bold text-lg font-mono">
              A
            </div>
            <h3 className="text-base font-semibold">Welcome to AI Orbit</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Sign in to sync your bookmarked companies across all your devices.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-xs font-medium hover:border-primary/60"
              >
                Continue with GitHub
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-xs font-medium hover:border-primary/60"
              >
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
