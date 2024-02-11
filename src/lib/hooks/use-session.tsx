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
  { arg }: { arg: { username?: string; password?: string; token?: string } }
) {
  return fetchJson<SessionData>(sessionApiUrl, {
    method: "POST",
    body: JSON.stringify({
      username: arg.username,
      password: arg.password,
      token: arg.token,
    }),
  })
}

function doLogout(url: string) {
  return fetchJson<SessionData>(sessionApiUrl, {
    method: "DELETE",
  })
}

export default function useSession(token: string | null) {
  const { data: session, isLoading } = useSWR<SessionData>(
    `${sessionApiUrl}_${token}`,
    () => fetchJson<SessionData>(sessionApiUrl),
    {
      fallbackData: defaultSession,
      revalidateOnMount: true,
    }
  )

  const { trigger: login } = useSWRMutation(
    `${sessionApiUrl}_${token}`,
    doLogin,
    {
      revalidate: true,
    }
  )

  const { trigger: logout } = useSWRMutation(
    `${sessionApiUrl}_${token}`,
    doLogout
  )

  return { session, login, logout, isLoading }
}
