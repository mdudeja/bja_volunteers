"use server"

import { getAllWorkDetails } from "@/lib/controllers/ContactsController"
import { getIsUserAdmin, getIsUserLoggedIn } from "@/lib/getSession"

export default async function getWorkDetailsData(
  state?: string[],
  pc?: string[]
) {
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()

  if (!userLoggedIn) {
    return {
      workDetails: [],
      totalWorkDetails: 0,
    }
  }

  if (!state && !pc && !isAdmin) {
    return {
      workDetails: [],
      totalWorkDetails: 0,
    }
  }

  const { workDetails, totalWorkDetails } = await getAllWorkDetails(state, pc)

  return { workDetails, totalWorkDetails }
}
