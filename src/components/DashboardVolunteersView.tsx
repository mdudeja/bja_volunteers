"use client"

import Loading from "@/app/dashboard/loading"
import { Suspense } from "react"
import { vol_table_headers } from "@/lib/Constants"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AppContactType } from "@/lib/interfaces/AppContact"
import Link from "next/link"
import VolunteersComponent from "./VolunteersComponent"

export default function DashboardVolunteersView({
  contacts,
}: {
  contacts: AppContactType[]
}) {
  const router = useRouter()

  return (
    <div className="h-full flex flex-col place-items-center">
      <Suspense fallback={<Loading />}>
        <VolunteersComponent
          data={contacts}
          tableHeaders={vol_table_headers}
          rowsPerPage={10}
          currentPage={1}
          minified={true}
        />
      </Suspense>
      <div className="flex flex-row items-center justify-end self-end me-4 mt-1 mb-2 space-x-2">
        <Button variant="default" size="sm">
          <Link href="/work-details">View Work Details</Link>
        </Button>
        <Button variant="default" size="sm">
          <Link href="/volunteers">View All</Link>
        </Button>
      </div>
    </div>
  )
}
