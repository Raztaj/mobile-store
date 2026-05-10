"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Settings,
  LogOut,
  Store,
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
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <aside className="flex w-60 flex-col border-r bg-white">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2.5 border-b px-5 py-4"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Store className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-sm">{t("admin.panel")}</span>
      </Link>

      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href}>
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
  )
}
