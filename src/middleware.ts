import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { SessionOptions, getIronSession } from "iron-session"
import { SessionData } from "@/lib/interfaces/SessionData"
import { sessionOptions as appSessionOptions } from "@/lib/AppSessionOptions"

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    cookies(),
    appSessionOptions
  )

  if (!session.isLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.append("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
