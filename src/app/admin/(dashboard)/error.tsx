"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { T } from "@/components/t"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
