"use client"

import { useEffect, useState, useCallback } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastItem {
  id: string
  message: string
  variant?: "default" | "destructive"
}

let toastListeners: Array<(toast: ToastItem) => void> = []
let toastId = 0

export function toast(message: string, variant?: "default" | "destructive") {
  const id = String(++toastId)
  toastListeners.forEach((listener) => listener({ id, message, variant }))
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((t: ToastItem) => {
    setToasts((prev) => [...prev, t])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== t.id))
    }, 4000)
  }, [])

  useEffect(() => {
    toastListeners.push(addToast)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== addToast)
    }
  }, [addToast])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-background px-4 py-3 shadow-lg text-sm animate-in slide-in-from-right-full",
            t.variant === "destructive" && "border-destructive text-destructive"
          )}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
