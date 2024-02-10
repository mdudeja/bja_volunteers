"use client"

import getVolunteerData from "@/app/actions/getVolunteerData"
import refreshData from "@/app/actions/refreshData"
import TableComponent from "@/components/TableComponent"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { vol_table_headers } from "@/lib/Constants"
import useSession from "@/lib/hooks/use-session"
import { AppContactType } from "@/lib/interfaces/AppContact"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import TableSkeletonComponent from "@/components/TableSkeleton"

export default function VolunteersComponent({
  rowsPerPage,
  currentPage,
  minified,
}: {
  rowsPerPage: number
  currentPage: number
  minified?: boolean
}) {
  const { session } = useSession()
  const [deactivateRefresh, setDeactivateRefresh] = useState(false)

  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ["volunteerData"],
    queryFn: () =>
      getVolunteerData(
        session?.user?.type === "user"
          ? session?.user?.access?.states
          : undefined,
        session?.user?.type === "user" ? session?.user?.access?.pcs : undefined
      ),
    initialData: {
      contacts: [],
      totalContacts: 0,
    },
  })

  const mutationRefresh = useMutation({
    mutationFn: async () => {
      setDeactivateRefresh(true)
      toast.info("Data Refresh Started")

      return refreshData({
        state:
          session?.user?.type === "user"
            ? session?.user?.access?.states
            : undefined,
        pc:
          session?.user?.type === "user"
            ? session?.user?.access?.pcs
            : undefined,
      })
    },
    onSuccess(data, variables, context) {
      if (data.success) {
        toast.success("Data refreshed successfully")
        refetch()
      } else {
        toast.error(data.error)
      }
    },
    onSettled(data, error, variables, context) {
      setDeactivateRefresh(false)
    },
  })

  useEffect(() => {
    if (session?.user) {
      refetch()
    }
  }, [session?.user, refetch])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (isFetching || error || data.totalContacts === 0 || deactivateRefresh) {
    return <TableSkeletonComponent />
  }

  return (
    <ScrollArea className="w-full">
      <TableComponent
        data={data?.contacts as AppContactType[]}
        tableHeaders={vol_table_headers}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        minified={minified}
        onRefresh={() => mutationRefresh.mutate()}
        deactivateRefresh={deactivateRefresh}
      />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
