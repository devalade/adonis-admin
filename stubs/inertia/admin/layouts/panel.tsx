import { type ComponentType, type ReactNode } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import { LayoutDashboard, LogOut, Mail, File } from 'lucide-react'
import { cn } from '~/utils/cn'
import { wrFocusRing } from '~/utils/focus_ring'
import { FlashToaster } from '~/components/flash_toaster'
import type { AdminNavItem } from '~/admin/types'

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  mail: Mail,
  file: File,
  dashboard: LayoutDashboard,
}

type AdminPanelLayoutProps = {
  children: ReactNode
  adminNav: AdminNavItem[]
  activeSlug?: string
}

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = iconMap[icon] ?? File
  return <Icon className={className} aria-hidden="true" />
}

export default function AdminPanelLayout({ children, adminNav, activeSlug }: AdminPanelLayoutProps) {
  return (
    <div className="flex min-h-svh bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="border-b border-border px-4 py-5">
          <Link
            href="/admin"
            className={cn(
              'font-editorial text-lg font-medium tracking-tight text-foreground',
              wrFocusRing
            )}
          >
            Admin
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Internal operations panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {adminNav.map((item) => {
              const active = item.slug === activeSlug

              return (
                <li key={item.slug}>
                  <Link
                    href={`/admin/${item.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors',
                      wrFocusRing,
                      active
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border/60'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    )}
                  >
                    <NavIcon icon={item.icon} className="size-[17px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className={cn(
                'flex min-h-10 items-center rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground',
                wrFocusRing
              )}
            >
              Back to app
            </Link>
            <Form route="admin.session.destroy">
              {({ processing }) => (
                <button
                  type="submit"
                  disabled={processing}
                  className={cn(
                    'flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground disabled:opacity-50',
                    wrFocusRing
                  )}
                >
                  <LogOut className="size-4 shrink-0" aria-hidden="true" />
                  {processing ? 'Signing out…' : 'Sign out'}
                </button>
              )}
            </Form>
          </div>
        </div>
      </aside>
      <main className="flex min-h-svh min-w-0 flex-1 flex-col">{children}</main>
      <FlashToaster />
    </div>
  )
}
