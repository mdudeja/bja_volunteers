"use server"

import { getAllPCsFromDB } from "@/lib/controllers/ContactsController"
import { getIsUserAdmin, getIsUserLoggedIn } from "@/lib/getSession"

export default async function getAllPCs() {
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()

  if (!userLoggedIn || !isAdmin) {
    return []
  }

  const pcs = await getAllPCsFromDB()

  return pcs
}
