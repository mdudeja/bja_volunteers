"use client"

import { AppContactWorkDetailsType } from "@/lib/interfaces/AppContact"
import TableComponent from "@/components/TableComponent"
import { ScrollArea } from "@/components/ui/scroll-area"
import refreshData from "@/app/actions/refreshData"
import useSession from "@/lib/hooks/use-session"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import getWorkDetailsData from "@/app/actions/getWorkDetailsData"
import { work_details_table_headers } from "@/lib/Constants"
import { toast } from "sonner"
import TableSkeletonComponent from "@/components/TableSkeleton"

export default function WorkDetailsComponent({
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
    queryKey: ["workDetailsData"],
    queryFn: () =>
      getWorkDetailsData(
        session?.user?.type === "user"
          ? session?.user?.access?.states
          : undefined,
        session?.user?.type === "user" ? session?.user?.access?.pcs : undefined
      ),
    initialData: {
      workDetails: [],
      totalWorkDetails: 0,
    },
    enabled: !!session,
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

  if (isFetching || error || data.totalWorkDetails === 0 || deactivateRefresh) {
    return <TableSkeletonComponent />
  }

  return (
    <ScrollArea className="h-5/6">
      <TableComponent
        data={data?.workDetails as AppContactWorkDetailsType[]}
        tableHeaders={work_details_table_headers}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        minified={minified}
        onRefresh={() => mutationRefresh.mutate()}
        deactivateRefresh={deactivateRefresh}
      />
    </ScrollArea>
  )
}
