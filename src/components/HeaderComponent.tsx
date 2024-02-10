"use client"

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar"
import useSession from "@/lib/hooks/use-session"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MoreVertical } from "lucide-react"
import Link from "next/link"

export default function HeaderComponent() {
  const pathname = usePathname()
  const { session, logout, loginWithToken } = useSession()
  const [showLogout, setShowLogout] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (token) {
      loginWithToken({ token })
      router.refresh()
    }
  }, [token, loginWithToken, router])

  useEffect(() => {
    if (session && session.isLoggedIn) {
      setShowLogout(true)
    } else {
      setShowLogout(false)
    }
  }, [session, setShowLogout])

  return (
    <Menubar className="flex flex-row max-w-full">
      <Image
        src={"/images/logo_transparent.png"}
        width={30}
        height={30}
        alt="R2W logo"
        onClick={() => router.push("/dashboard")}
        className="cursor-pointer"
      />
      <h2 className="cursor-pointer" onClick={() => router.push("/dashboard")}>
        BJA Volunteers
      </h2>
      <span className="grow"></span>
      <MenubarMenu>
        {pathname != "/login" && (
          <MenubarTrigger
            className="cursor-pointer"
            onClick={() => {
              logout()
              router.push("/login")
            }}
          >
            {showLogout ? "Logout" : "Login"}
          </MenubarTrigger>
        )}
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">
          <MoreVertical />
          <MenubarContent>
            <MenubarItem>
              <Link href="/dashboard">Home</Link>
            </MenubarItem>
            <MenubarItem>
              <Link href="/volunteers">Volunteers</Link>
            </MenubarItem>
            <MenubarItem>
              <Link href="/work-details">Work Details</Link>
            </MenubarItem>
            {session && session.user.type === "admin" && (
              <MenubarItem>
                <Link href="/dashboard">Generate Links</Link>
              </MenubarItem>
            )}
          </MenubarContent>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}
