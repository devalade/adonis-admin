import { type ReactNode } from 'react'
import { Shield } from 'lucide-react'
import { FlashToaster } from '~/components/flash_toaster'

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh bg-zinc-950 text-zinc-50">
      <aside className="hidden w-[42%] max-w-lg flex-col justify-between border-r border-zinc-800 bg-zinc-900 p-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-800 ring-1 ring-zinc-700">
            <Shield className="size-4 text-zinc-200" aria-hidden="true" />
          </div>
          <span className="font-editorial text-lg font-medium tracking-tight">Admin</span>
        </div>
        <div>
          <p className="font-editorial text-3xl font-medium leading-tight tracking-tight text-zinc-50">
            Internal operations
          </p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-zinc-400">
            Restricted access for team members. Sign in with your staff credentials.
          </p>
        </div>
        <p className="text-xs text-zinc-500">Not a customer account? Use the main app login instead.</p>
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-800 ring-1 ring-zinc-700">
            <Shield className="size-4 text-zinc-200" aria-hidden="true" />
          </div>
          <span className="font-editorial text-lg font-medium tracking-tight text-zinc-50">Admin</span>
        </div>
        {children}
      </main>
      <FlashToaster />
    </div>
  )
}
