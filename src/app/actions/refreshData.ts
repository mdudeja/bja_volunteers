"use server"

import { BQControllerInstance } from "@/lib/controllers/BQController"
import { getIsUserAdmin, getIsUserLoggedIn } from "@/lib/getSession"
import { revalidatePath } from "next/cache"

export default async function refreshData({
  state,
  pc,
}: {
  state?: string[]
  pc?: string[]
}) {
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()
  const bci = BQControllerInstance

  if (!userLoggedIn) {
    return {
      success: false,
      error: "User not logged in",
    }
  }

  if (!state && !pc && !isAdmin) {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  try {
    await bci.queryContacts(state, pc)
    return {
      success: true,
      error: "",
    }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      error: (e as any).message,
    }
  }
}
