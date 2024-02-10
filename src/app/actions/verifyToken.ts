import { defaultSession } from "@/lib/AppSessionOptions"
import { fetchToken } from "@/lib/controllers/AccessTokenController"

export default async function verifyToken(tokenText?: string) {
  if (!tokenText) {
    return
  }
  const token = await fetchToken(tokenText ?? "")

  if (!token) {
    return defaultSession.user
  }

  if (!token.is_active) {
    return defaultSession.user
  }

  const user = {
    _id: token.token,
    username: "User Access",
    type: "user",
    isActive: true,
    access: {
      states: token.access_type === "state" ? token.scope : [],
      pcs: token.access_type === "pc" ? token.scope : [],
    },
  }

  return user
}
