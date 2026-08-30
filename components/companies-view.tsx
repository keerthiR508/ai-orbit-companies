'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react'
import { CompanyTable } from '@/components/company-table'
import { CompanyCard } from '@/components/company-card'
import { TableSkeleton, GridSkeleton } from '@/components/skeletons'
import { type Company } from '@/lib/company-format'

const categories = [
  'All',
  'Foundation Models',
  'AI Model Providers',
  'Infrastructure',
  'Developer Tools',
  'Generative AI',
  'Enterprise',
  'Open Source',
  'Robotics',
  'Healthcare',
  'Marketing',
  'AI Native',
  'Model Companies',
  'Unicorns'
]

const sectors = [
  'All Sectors',
  'Foundation Models',
  'Infrastructure',
  'Developer Tools',
  'Generative AI',
  'Enterprise',
  'Open Source',
  'Robotics',
  'Healthcare',
  'Marketing'
]

const quickFilters = [
  { label: 'Trending', category: 'Generative AI', search: '' },
  { label: 'Foundation Models', category: 'Foundation Models', search: '' },
  { label: 'Unicorns ($1B+)', category: 'Unicorns', search: '' },
  { label: 'AI Native', category: 'AI Native', search: '' },
  { label: 'Open Source', category: 'Open Source', search: '' }
]

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export function CompaniesView() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sectorFilter, setSectorFilter] = useState('All Sectors')
  const [aiNativeOnly, setAiNativeOnly] = useState(false)
  const [profitableOnly, setProfitableOnly] = useState(false)
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [filterOpen, setFilterOpen] = useState(false)

  // Construct active params
  const effectiveCategory =
    category !== 'All' ? category : sectorFilter !== 'All Sectors' ? sectorFilter : ''

  const params = new URLSearchParams({
    search,
    category: effectiveCategory,
    sort,
    page: String(page),
    limit: viewMode === 'grid' ? '12' : '8'
  })

  if (aiNativeOnly) params.set('aiNative', 'true')
  if (profitableOnly) params.set('profitable', 'true')

  const { data: result, error, isLoading } = useSWR<{
    companies: Company[]
    total: number
    totalPages: number
    page: number
  }>(`/api/companies?${params.toString()}`, fetcher, {
    keepPreviousData: true
  })

  const companies = result?.companies ?? []
  const total = result?.total ?? 0
  const totalPages = result?.totalPages ?? 1

  const handleResetFilters = () => {
    setSearch('')
    setCategory('All')
    setSectorFilter('All Sectors')
    setAiNativeOnly(false)
    setProfitableOnly(false)
    setSort('newest')
    setPage(1)
  }

  const hasActiveFilters =
    search !== '' ||
    category !== 'All' ||
    sectorFilter !== 'All Sectors' ||
    aiNativeOnly ||
    profitableOnly

  return (
    <div>
      {/* Hero Section */}
      <section className="grid-texture border-b border-border/70">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center px-5 pb-12 pt-16 text-center md:pt-24">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            <Sparkles size={11} />
            The AI ecosystem, mapped
          </div>

          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-6xl md:text-7xl">
            AI Companies
          </h1>

          <p className="mt-4 max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
            Discover, track, and explore the frontier labs and enterprises shaping artificial intelligence.
          </p>

          {/* Search bar */}
          <div className="relative mt-8 w-full max-w-2xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search companies, products, foundation models, countries..."
              aria-label="Search AI companies"
              className="h-13 w-full rounded-lg border border-border/80 bg-card/80 pl-11 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('')
                  setPage(1)
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {quickFilters.map((item) => {
              const active = category === item.category && search === item.search
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (active) {
                      setCategory('All')
                    } else {
                      setCategory(item.category)
                      setSearch(item.search)
                    }
                    setPage(1)
                  }}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition-all ${
                    active
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog View Container */}
      <div className="mx-auto max-w-[1240px] px-5 py-8">
        {/* Categories Bar & View Mode Switcher */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto pb-1">
            {categories.map((item) => {
              const active = category === item
              return (
                <button
                  key={item}
                  onClick={() => {
                    setCategory(item)
                    setPage(1)
                  }}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border/70 bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-md border border-border/70 bg-card/40 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`grid size-7 place-items-center rounded ${
                  viewMode === 'list'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`grid size-7 place-items-center rounded ${
                  viewMode === 'grid'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                filterOpen || hasActiveFilters
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border/70 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expanded Filters Drawer */}
        {filterOpen && (
          <div className="mt-4 rounded-lg border border-border/70 bg-card/60 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Primary Sector
                </label>
                <select
                  value={sectorFilter}
                  onChange={(e) => {
                    setSectorFilter(e.target.value)
                    setPage(1)
                  }}
                  className="h-9 w-full rounded-md border border-border/80 bg-background px-3 text-xs text-foreground outline-none focus:border-primary"
                >
                  {sectors.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  AI Native Status
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAiNativeOnly(!aiNativeOnly)
                    setPage(1)
                  }}
                  className={`flex h-9 w-full items-center justify-between rounded-md border px-3 text-xs transition ${
                    aiNativeOnly
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border/80 bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>AI Native Only</span>
                  {aiNativeOnly && <Check size={14} />}
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Profitability
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setProfitableOnly(!profitableOnly)
                    setPage(1)
                  }}
                  className={`flex h-9 w-full items-center justify-between rounded-md border px-3 text-xs transition ${
                    profitableOnly
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-border/80 bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>Profitable Only</span>
                  {profitableOnly && <Check size={14} />}
                </button>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  disabled={!hasActiveFilters}
                  className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-border/70 bg-background/50 text-xs text-muted-foreground transition hover:border-border hover:text-foreground disabled:opacity-40"
                >
                  <RotateCcw size={13} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status bar: Total count, active filter tags, sort select */}
        <div className="mt-8 flex flex-col gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{total} companies</span>
            <span className="text-xs text-muted-foreground">
              {category === 'All' ? 'across all AI sectors' : `in ${category}`}
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="ml-2 inline-flex items-center gap-1 rounded-md border border-border/60 bg-card px-2 py-0.5 text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground"
              >
                <RotateCcw size={10} />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Sort by</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value)
                    setPage(1)
                  }}
                  className="appearance-none rounded-md border border-border/80 bg-card py-1.5 pl-3 pr-7 text-xs text-foreground outline-none transition focus:border-primary"
                >
                  <option value="newest">Newest Founded</option>
                  <option value="oldest">Oldest Founded</option>
                  <option value="valuation-high">Highest Valuation</option>
                  <option value="valuation-low">Lowest Valuation</option>
                  <option value="employees">Most Employees</option>
                  <option value="models">Most Models</option>
                  <option value="tools">Most Tools</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-4 min-h-[360px]">
          {error ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
              <p className="text-sm font-medium text-destructive">Failed to load companies</p>
              <p className="mt-1 text-xs text-muted-foreground">Please check your connection and try again.</p>
              <button
                onClick={() => handleResetFilters()}
                className="mt-4 rounded-md border border-border bg-card px-3.5 py-1.5 text-xs text-foreground hover:border-primary"
              >
                Reload Data
              </button>
            </div>
          ) : isLoading ? (
            viewMode === 'grid' ? <GridSkeleton count={8} /> : <TableSkeleton count={8} />
          ) : total === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/20 py-20 text-center">
              <div className="mb-4 grid size-12 place-items-center rounded-full bg-muted/80 text-muted-foreground">
                <Search size={20} />
              </div>
              <h2 className="text-base font-semibold text-foreground">No companies found</h2>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                We couldn&apos;t find any companies matching your current filters or query.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition"
                >
                  <RotateCcw size={13} />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {companies.map((company) => (
                <CompanyCard key={company.slug} company={company} />
              ))}
            </div>
          ) : (
            <CompanyTable companies={companies} />
          )}
        </div>

        {/* Pagination bar */}
        {total > 0 && (
          <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-6 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-medium text-foreground">{companies.length}</span> of{' '}
              <span className="font-medium text-foreground">{total}</span> companies
            </div>

            <div className="flex items-center gap-3">
              <span>
                Page <span className="font-medium text-foreground">{page}</span> of{' '}
                <span className="font-medium text-foreground">{totalPages}</span>
              </span>
              <div className="flex gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => {
                    setPage(page - 1)
                    window.scrollTo({ top: 380, behavior: 'smooth' })
                  }}
                  className="grid size-8 place-items-center rounded-md border border-border/70 bg-card text-foreground transition hover:border-primary disabled:opacity-30 disabled:hover:border-border/70"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage(page + 1)
                    window.scrollTo({ top: 380, behavior: 'smooth' })
                  }}
                  className="grid size-8 place-items-center rounded-md border border-border/70 bg-card text-foreground transition hover:border-primary disabled:opacity-30 disabled:hover:border-border/70"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
