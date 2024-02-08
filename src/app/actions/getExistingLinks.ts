"use server"

import { fetchAllTokens } from "@/lib/controllers/AccessTokenController"
import { getIsUserAdmin, getIsUserLoggedIn } from "@/lib/getSession"

export default async function getExistingLinks() {
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()

  if (!userLoggedIn || !isAdmin) {
    return []
  }

  const tokens = await fetchAllTokens()

  return tokens
}
