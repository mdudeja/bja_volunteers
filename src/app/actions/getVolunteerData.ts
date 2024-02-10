"use server"

import { getAllContacts } from "@/lib/controllers/ContactsController"
import { getIsUserAdmin, getIsUserLoggedIn } from "@/lib/getSession"
import { BQControllerInstance } from "@/lib/controllers/BQController"

export default async function getVolunteerData(
  state?: string[],
  pc?: string[]
) {
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()
  const _ = BQControllerInstance

  if (!userLoggedIn) {
    return {
      contacts: [],
      totalContacts: 0,
    }
  }

  if (!state?.length && !pc?.length && !isAdmin) {
    return {
      contacts: [],
      totalContacts: 0,
    }
  }

  const { contacts, totalContacts } = await getAllContacts(state, pc)

  return { contacts, totalContacts }
}
