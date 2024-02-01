import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import HeaderComponent from "@/components/HeaderComponent"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BJA Volunteers",
  description: "Volunteer management for the BJA",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <HeaderComponent />
        </nav>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
