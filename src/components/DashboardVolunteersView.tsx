"use client"

import Loading from "@/app/dashboard/loading"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import VolunteersComponent from "./VolunteersComponent"

export default function DashboardVolunteersView() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-row w-full items-center justify-between">
        <p className="text-lg mx-4 mt-2 underline underline-offset-4">
          Volunteers
        </p>
        <Button variant="default" size="sm" className="self-end me-4 mt-2">
          <Link href="/volunteers">View All</Link>
        </Button>
      </div>
      <Suspense fallback={<Loading />}>
        <VolunteersComponent rowsPerPage={10} currentPage={1} minified={true} />
      </Suspense>
    </div>
  )
}
