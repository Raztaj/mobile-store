"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Pencil } from "lucide-react"
import { toast } from "@/components/ui/toaster"

export function DashboardPhone({ phone: initial }: { phone: string }) {
  const [editing, setEditing] = useState(false)
  const [phone, setPhone] = useState(initial)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const save = async () => {
    setPending(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_phone: phone }),
      })
      if (!res.ok) throw new Error()
      toast("Phone number updated")
      router.refresh()
      setEditing(false)
    } catch {
      toast("Failed to update", "destructive")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          WhatsApp Phone
        </CardTitle>
        {!editing && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="flex gap-2">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9" />
            <Button size="sm" disabled={pending} onClick={save} className="shrink-0">
              {pending ? "..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setEditing(false); setPhone(initial) }} className="shrink-0">
              Cancel
            </Button>
          </div>
        ) : (
          <p className="text-sm font-mono">{phone}</p>
        )}
      </CardContent>
    </Card>
  )
}
