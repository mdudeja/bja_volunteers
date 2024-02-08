import type { Metadata, ResolvingMetadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import HeaderComponent from "@/components/HeaderComponent"
import { Toaster } from "@/components/ui/sonner"
import { getSession } from "@/lib/getSession"
import { Suspense } from "react"
import Loading from "@/app/loading"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const session = await getSession()

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

  if (session?.user?.type === "user") {
    if (session.user.access.states.length > 0) {
      metadata.title = session.user.access.states.join(", ") + " BJA Volunteers"
      metadata.description = `Volunteer management for the BJA in ${session.user.access.states.join(
        ", "
      )}`
    }

    if (session.user.access.pcs.length > 0) {
      metadata.title = session.user.access.pcs.join(", ") + " BJA Volunteers"
      metadata.description = `Volunteer management for the BJA in ${session.user.access.pcs.join(
        ", "
      )}`
    }

    if (metadata.openGraph) {
      metadata.openGraph.title = metadata.title as string
      metadata.openGraph.description = metadata.description as string
    }
  }

  return metadata
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <nav>
            <HeaderComponent />
          </nav>
          <main>{children}</main>
        </Suspense>
        <Toaster />
      </body>
    </html>
  )
}
