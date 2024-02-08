"use client"

import refreshData from "@/app/actions/refreshData"
import TableComponent from "@/components/TableComponent"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import useSession from "@/lib/hooks/use-session"
import { AppContactType } from "@/lib/interfaces/AppContact"
import { usePathname } from "next/navigation"

export default function VolunteersComponent({
  data,
  tableHeaders,
  rowsPerPage,
  currentPage,
  minified,
}: {
  data: AppContactType[]
  tableHeaders: string[]
  rowsPerPage: number
  currentPage: number
  minified?: boolean
}) {
  const pathname = usePathname()
  const { session } = useSession()

  const refreshCallback = async () => {
    await refreshData({
      fromPath: pathname,
      state:
        session?.user?.type === "user"
          ? session?.user?.access?.states
          : undefined,
      pc:
        session?.user?.type === "user" ? session?.user?.access?.pcs : undefined,
    })
  }

  return (
    <ScrollArea className="h-5/6 w-full">
      <TableComponent
        data={data}
        tableHeaders={tableHeaders}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        minified={minified}
        onRefresh={refreshCallback}
      />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
