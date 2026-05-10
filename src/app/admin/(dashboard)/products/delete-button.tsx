"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteProduct } from "@/lib/supabase/actions"
import { toast } from "@/components/ui/toaster"
import { useTranslation } from "@/lib/i18n"
import { useState } from "react"

export function DeleteButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  const handleDelete = async () => {
    setPending(true)
    try {
      await deleteProduct(id)
      toast(t("common.delete"))
      router.refresh()
      setOpen(false)
    } catch {
      toast("Failed to delete product", "destructive")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.delete_confirm")}</DialogTitle>
          <DialogDescription>
            {t("admin.delete_desc")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" disabled={pending} onClick={handleDelete}>
            {pending ? t("common.loading") : t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
