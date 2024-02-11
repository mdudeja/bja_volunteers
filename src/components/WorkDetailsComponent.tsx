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
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function WorkDetailsComponent({
  rowsPerPage,
  currentPage,
  minified,
}: {
  rowsPerPage: number
  currentPage: number
  minified?: boolean
}) {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { session } = useSession(token ?? null)
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

  return (
    <div className="h-full w-full flex flex-col">
      {minified && (
        <div className="flex flex-row w-full items-center justify-between">
          <p className="text-lg mx-4 mt-2 underline underline-offset-4">
            Work Details
          </p>
          <Button variant="default" size="sm" className="self-end me-4 mt-2">
            <Link href="/work-details">View All</Link>
          </Button>
        </div>
      )}
      <ScrollArea className="h-full">
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
    </div>
  )
}
