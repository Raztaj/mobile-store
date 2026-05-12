import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { LoginForm } from "./login-form"
import { T } from "@/components/t"

export default async function AdminLoginPage() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) redirect("/admin/dashboard")
  } catch {
    // DB unreachable — show login form anyway
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold"><T k="admin.login" /></h1>
          <p className="text-sm text-muted-foreground mt-1">
            <T k="admin.login_desc" />
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
