import { defaultSession, sessionOptions } from "@/lib/AppSessionOptions"
import { loginUser } from "@/lib/controllers/UserController"
import { SessionData } from "@/lib/interfaces/SessionData"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  const { username, password } = await request.json()

  const loggedInUser = await loginUser(username, password)

  if (!loggedInUser) {
    return NextResponse.json(
      {
        status: 401,
        json: {
          error: "Invalid username or password",
        },
      },
      {
        status: 401,
      }
    )
  }

  session.user = loggedInUser
  session.isLoggedIn = true
  await session.save()

  return NextResponse.json(session)
}

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  if (!session.isLoggedIn || !session.user || !session.user.isActive) {
    return Response.json(defaultSession)
  }

  return Response.json(session)
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  session.destroy()

  return Response.json(defaultSession)
}
