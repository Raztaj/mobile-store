"use client"

import { use, createContext, forwardRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "destructive"

interface Toast {
  id: string
  message: string
  variant?: ToastVariant
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, variant?: ToastVariant) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useToast() {
  const ctx = use(ToastContext)
  if (!ctx) {
    return {
      toasts: [],
      addToast: () => {},
      removeToast: () => {},
    }
  }
  return ctx
}
