"use server"

import { getAllStatesFromDB } from "@/lib/controllers/ContactsController"
import { getIsUserAdmin, getIsUserLoggedIn } from "@/lib/getSession"

export default async function getAllStates() {
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()

  if (!userLoggedIn || !isAdmin) {
    return []
  }

  const states = await getAllStatesFromDB()

  return states
}
