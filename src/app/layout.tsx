import type { Metadata, ResolvingMetadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import HeaderComponent from "@/components/HeaderComponent"
import { Toaster } from "@/components/ui/sonner"
import { getSession } from "@/lib/getSession"
import { Suspense } from "react"
import Loading from "@/app/loading"
import Providers from "./providers"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"
import { SessionData } from "@/lib/interfaces/SessionData"
import getAllPCs from "@/app/actions/getAllPcs"
import getAllStates from "@/app/actions/getAllStates"
import getExistingLinks from "@/app/actions/getExistingLinks"
import getVolunteerData from "@/app/actions/getVolunteerData"
import getWorkDetailsData from "@/app/actions/getWorkDetailsData"
import { defaultSession } from "@/lib/AppSessionOptions"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? ""),
    title: "BJA Volunteers",
    description: "Volunteer management for the BJA",
    icons: {
      icon: `/images/logo_filled.jpg`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_URL}/`,
      title: "BJA Volunteers",
      description: "Volunteer management for the BJA",
      images: [
        {
          url: `/images/logo_filled.jpg`,
          width: 400,
          height: 400,
          alt: "BJA Volunteers",
        },
      ],
    },
  }
  return metadata
}

async function getContacts(user: SessionData["user"]) {
  if (user?.type === "admin") {
    return await getVolunteerData()
  }

  return await getVolunteerData(user?.access?.states, user?.access?.pcs)
}

async function getWorkDetails(user: SessionData["user"]) {
  if (user?.type === "admin") {
    return await getWorkDetailsData()
  }

  return await getWorkDetailsData(user?.access?.states, user?.access?.pcs)
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  const sessionUser = session?.user as SessionData["user"]
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["volunteerData"],
    queryFn: () => getContacts(sessionUser ?? undefined),
  })

  await queryClient.prefetchQuery({
    queryKey: ["workDetailsData"],
    queryFn: () => getWorkDetails(sessionUser ?? undefined),
  })

  if (sessionUser?.type === "admin") {
    await queryClient.prefetchQuery({
      queryKey: ["existingLinks"],
      queryFn: () => getExistingLinks(),
    })

    await queryClient.prefetchQuery({
      queryKey: ["statesList"],
      queryFn: () => getAllStates(),
    })

    await queryClient.prefetchQuery({
      queryKey: ["pcsList"],
      queryFn: () => getAllPCs(),
    })
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <nav>
            <HeaderComponent />
          </nav>
          <main>
            <Providers>
              <HydrationBoundary state={dehydrate(queryClient)}>
                {children}
              </HydrationBoundary>
            </Providers>
          </main>
        </Suspense>
        <Toaster />
      </body>
    </html>
  )
}
