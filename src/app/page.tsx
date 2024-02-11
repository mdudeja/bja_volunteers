"use client"

import useSession from "@/lib/hooks/use-session"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { session } = useSession(token ?? null)
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      return
    }

    if (session.isLoggedIn) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [session, router])
}
