import { Suspense } from "react"
import Loading from "@/app/volunteers/loading"
import { work_details_table_headers } from "@/lib/Constants"
import { SessionData } from "@/lib/interfaces/SessionData"
import { getSession } from "@/lib/getSession"
import getWorkDetailsData from "../actions/getWorkDetailsData"
import WorkDetailsComponent from "@/components/WorkDetailsComponent"
import refreshData from "@/app/actions/refreshData"

async function getData(user: SessionData["user"]) {
  if (user?.type === "admin") {
    return await getWorkDetailsData()
  }

  return await getWorkDetailsData(user?.access?.states, user?.access?.pcs)
}

export default async function VolunteersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const session = await getSession()
  const rowsPerPage = +(process.env.ROWS_PER_TABLE_PAGE ?? 10)
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
  const { workDetails, totalWorkDetails: _ } = await getData(session?.user)

  return (
    <div className="flex flex-col me-4 my-4">
      <Suspense fallback={<Loading />}>
        <WorkDetailsComponent
          data={workDetails ?? []}
          tableHeaders={work_details_table_headers}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          minified={false}
        />
      </Suspense>
    </div>
  )
}
