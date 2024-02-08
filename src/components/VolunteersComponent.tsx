"use client"

import TableComponent from "@/components/TableComponent"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { AppContactType } from "@/lib/interfaces/AppContact"

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
  return (
    <ScrollArea className="h-5/6 w-full">
      <TableComponent
        data={data}
        tableHeaders={tableHeaders}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        minified={minified}
      />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
