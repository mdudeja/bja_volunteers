"use client"

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import useSession from "@/lib/hooks/use-session"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HeaderComponent() {
  const { session, logout } = useSession()
  const [showLogout, setShowLogout] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (session && session.isLoggedIn) {
      setShowLogout(true)
    } else {
      setShowLogout(false)
    }
  }, [session, showLogout])

  return (
    <Menubar className="flex flex-row">
      <Image
        src={"/images/logo_transparent.png"}
        width={30}
        height={30}
        alt="R2W logo"
        onClick={() => router.push("/")}
        className="cursor-pointer"
      />
      <h2 className="cursor-pointer" onClick={() => router.push("/")}>
        BJA Volunteers
      </h2>
      <span className="grow"></span>
      <MenubarMenu>
        {showLogout && (
          <MenubarTrigger
            className="cursor-pointer"
            onClick={() => {
              logout()
              router.push("/login")
            }}
          >
            Logout
          </MenubarTrigger>
        )}
      </MenubarMenu>
    </Menubar>
  )
}
