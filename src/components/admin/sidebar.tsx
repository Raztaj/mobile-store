"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/supabase/actions"
import { useTranslation } from "@/lib/i18n"

const links = [
  { href: "/admin/dashboard", labelKey: "admin.dashboard", icon: LayoutDashboard },
  { href: "/admin/products", labelKey: "admin.products", icon: ShoppingBag },
  { href: "/admin/categories", labelKey: "admin.categories", icon: Tags },
  { href: "/admin/settings", labelKey: "admin.settings", icon: Settings },
]

export function AdminSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-lg border bg-white shadow-sm hover:bg-accent lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r bg-white transition-transform duration-200 lg:static lg:z-auto lg:block",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Store className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">{t("admin.panel")}</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {links.map((link) => {
            const Icon = link.icon
            const active = pathname.startsWith(link.href)
            return (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2.5 h-9 text-sm font-normal",
                    active && "bg-secondary font-medium"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(link.labelKey)}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-3">
          <form action={logout}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2.5 h-9 text-sm font-normal text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {t("admin.logout")}
            </Button>
          </form>
        </div>
      </aside>
    </>
  )
}
