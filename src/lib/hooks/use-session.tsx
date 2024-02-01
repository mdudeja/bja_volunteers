import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import { SessionData } from "../interfaces/SessionData"
import { defaultSession } from "../AppSessionOptions"

async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    ...init,
  })
  const json = await res.json()
  return json
}

const sessionApiUrl = "/api/session"

function doLogin(
  url: string,
  { arg }: { arg: { username: string; password: string } }
) {
  return fetchJson<SessionData>(url, {
    method: "POST",
    body: JSON.stringify({ username: arg.username, password: arg.password }),
  })
}

function doLogout(url: string) {
  return fetchJson<SessionData>(url, {
    method: "DELETE",
  })
}

export default function useSession() {
  const { data: session, isLoading } = useSWR<SessionData>(
    sessionApiUrl,
    fetchJson<SessionData>,
    {
      fallbackData: defaultSession,
    }
  )

  const { trigger: login } = useSWRMutation(sessionApiUrl, doLogin, {
    revalidate: false,
  })

  const { trigger: logout } = useSWRMutation(sessionApiUrl, doLogout)

  return { session, login, logout, isLoading }
}
