import WorkDetailsComponent from "@/components/WorkDetailsComponent"

export default async function VolunteersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const rowsPerPage = +(process.env.ROWS_PER_TABLE_PAGE ?? 10)
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1

  return (
    <div className="flex flex-col me-4 my-4 p-2">
      <WorkDetailsComponent
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        minified={false}
      />
    </div>
  )
}
