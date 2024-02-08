"use client"

import { AppContactWorkDetailsType } from "@/lib/interfaces/AppContact"
import TableComponent from "@/components/TableComponent"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import refreshData from "@/app/actions/refreshData"
import useSession from "@/lib/hooks/use-session"

export default function WorkDetailsComponent({
  data,
  tableHeaders,
  rowsPerPage,
  currentPage,
  minified,
}: {
  data: AppContactWorkDetailsType[]
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
    <ScrollArea className="h-5/6">
      <TableComponent
        data={data}
        tableHeaders={tableHeaders}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        minified={minified}
        onRefresh={refreshCallback}
      />
    </ScrollArea>
  )
}
