"use client"

import useSession from "@/lib/hooks/use-session"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { session } = useSession()
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
