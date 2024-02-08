import getExistingLinks from "@/app/actions/getExistingLinks"
import {
  deleteToken,
  fetchOrGenerateToken,
} from "@/lib/controllers/AccessTokenController"
import { getIsUserAdmin, getIsUserLoggedIn } from "@/lib/getSession"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { target, value } = await request.json()
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()

  if (!userLoggedIn || !isAdmin) {
    return NextResponse.json(
      {
        url: "",
        token: null,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }

  if (!target || !value) {
    return NextResponse.json(
      {
        url: "",
        token: null,
        error: "Invalid request",
      },
      {
        status: 400,
      }
    )
  }

  const token = await fetchOrGenerateToken(target, value)

  if (!token) {
    return NextResponse.json(
      {
        url: "",
        token: null,
        error: "Failed to generate token",
      },
      {
        status: 500,
      }
    )
  }

  return NextResponse.json(
    {
      url: `/dashboard?token=${token.token}`,
      token,
    },
    {
      status: 200,
    }
  )
}

export async function GET(request: NextRequest) {
  const userLoggedIn = await getIsUserLoggedIn(request.cookies as any)
  const isAdmin = await getIsUserAdmin(request.cookies as any)

  if (!userLoggedIn || !isAdmin) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }

  const tokens = await getExistingLinks()

  if (!tokens) {
    return NextResponse.json(
      {
        error: "Failed to fetch tokens",
      },
      {
        status: 500,
      }
    )
  }

  return NextResponse.json(
    { tokens },
    {
      status: 200,
    }
  )
}

export async function DELETE(request: NextRequest) {
  const { token } = await request.json()
  const userLoggedIn = await getIsUserLoggedIn()
  const isAdmin = await getIsUserAdmin()

  if (!userLoggedIn || !isAdmin) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }

  if (!token) {
    return NextResponse.json(
      {
        error: "Invalid request",
      },
      {
        status: 400,
      }
    )
  }

  const deleted = await deleteToken(token)

  if (!deleted) {
    return NextResponse.json(
      {
        error: "Failed to delete token",
      },
      {
        status: 500,
      }
    )
  }

  return NextResponse.json(
    {},
    {
      status: 200,
    }
  )
}
