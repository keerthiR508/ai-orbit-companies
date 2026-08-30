'use client'

import Link from 'next/link'

const modules = [
  { name: 'New', href: '/#new' },
  { name: 'Tools', href: '/#tools' },
  { name: 'Agents', href: '/#agents' },
  { name: 'Tasks', href: '/#tasks' },
  { name: 'Companies', href: '/companies', active: true },
  { name: 'News', href: '/#news' },
  { name: 'Videos', href: '/#videos' },
  { name: 'Robots', href: '/#robots' },
  { name: 'Devices', href: '/#devices' },
  { name: 'Models', href: '/#models' },
  { name: 'Repositories', href: '/#repositories' },
  { name: 'MCP', href: '/#mcp' },
  { name: 'Personal', href: '/#personal' },
  { name: 'Creativity', href: '/#creativity' }
]

export function ModuleNav() {
  return (
    <div className="border-b border-border/70 bg-card/25">
      <div className="no-scrollbar mx-auto flex max-w-[1240px] items-center gap-1 overflow-x-auto px-5 py-2">
        {modules.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              item.active
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
