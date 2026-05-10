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

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 flex-col border-r bg-muted/30">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 border-b px-4 py-4 font-semibold"
      >
        <Store className="h-5 w-5" />
        Admin Panel
      </Link>

      <nav className="flex flex-col gap-1 p-3">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={active ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2", active && "bg-secondary")}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t p-3">
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </aside>
  )
}
