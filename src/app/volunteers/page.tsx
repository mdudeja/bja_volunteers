import { Suspense } from "react"
import Loading from "@/app/volunteers/loading"
import TableComponent from "@/components/TableComponent"
import getVolunteerData from "@/app/actions/getVolunteerData"
import { vol_table_headers } from "@/lib/Constants"
import { SessionData } from "@/lib/interfaces/SessionData"
import { getSession } from "@/lib/getSession"
import VolunteersComponent from "@/components/VolunteersComponent"

async function getContacts(user: SessionData["user"]) {
  if (user?.type === "admin") {
    return await getVolunteerData()
  }

  return await getVolunteerData(user?.access?.states, user?.access?.pcs)
}

export default async function VolunteersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const session = await getSession()
  const rowsPerPage = +(process.env.ROWS_PER_TABLE_PAGE ?? 10)
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1
  const { contacts, totalContacts: _ } = await getContacts(session?.user)

  return (
    <div className="flex flex-col me-4 my-4 w-full p-2">
      <Suspense fallback={<Loading />}>
        <VolunteersComponent
          data={contacts ?? []}
          tableHeaders={vol_table_headers}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          minified={false}
        />
      </Suspense>
    </div>
  )
}
