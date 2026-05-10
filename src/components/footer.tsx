"use client"

import Link from "next/link"
import { STORE_NAME } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-sm">{STORE_NAME}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("footer.desc")}
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t("common.home")}
            </Link>
            <Link href="/cart" className="hover:text-foreground transition-colors">
              {t("nav.cart")}
            </Link>
          </div>
        </div>
        <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {STORE_NAME}. {t("footer.rights")}.
        </div>
      </div>
    </footer>
  )
}
