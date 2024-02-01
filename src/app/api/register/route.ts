import { NextRequest, NextResponse } from "next/server"
import {
  createUser,
  fetchUserByUsername,
} from "@/lib/controllers/UserController"
import { TUser } from "@/lib/interfaces/User"

export async function POST(request: NextRequest) {
  const user: TUser = await request.json()

  const exists = await fetchUserByUsername(user.username)

  if (exists) {
    return NextResponse.json(
      JSON.stringify({
        error: "User already exists",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  const newUser = await createUser(user)

  if (!newUser) {
    return NextResponse.json(
      JSON.stringify({
        error: "Failed to create user",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  return new Response(
    JSON.stringify({
      id: newUser.id,
      username: newUser.username,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}
