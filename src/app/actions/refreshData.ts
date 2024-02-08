"use server"

import { BQControllerInstance } from "@/lib/controllers/BQController"
import { getIsUserAdmin, getIsUserLoggedIn } from "@/lib/getSession"
import { revalidatePath } from "next/cache"

export default async function refreshData({
  state,
  pc,
  fromPath,
}: {
  state?: string[]
  pc?: string[]
  fromPath: string
}) {
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()
  const bci = BQControllerInstance

  if (!userLoggedIn) {
    return {
      contacts: [],
      totalContacts: 0,
    }
  }

  if (!state && !pc && !isAdmin) {
    return {
      contacts: [],
      totalContacts: 0,
    }
  }

  await bci.queryContacts(state, pc, () => {
    revalidatePath("/dashboard")
    revalidatePath(fromPath)
  })
}
