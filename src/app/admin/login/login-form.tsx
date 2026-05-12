"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/supabase/actions"
import { useTranslation } from "@/lib/i18n"

export function LoginForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      try {
        return await login(formData)
      } catch (e) {
        return { error: (e as Error).message }
      }
    },
    null
  )

  useEffect(() => {
    if (state && "success" in state && state.success) {
      router.push("/admin/dashboard")
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("admin.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@store.com"
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("admin.password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {state && "error" in state && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? t("admin.signing_in") : t("admin.sign_in")}
      </Button>
    </form>
  )
}
