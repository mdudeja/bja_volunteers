import getExistingLinks from "@/app/actions/getExistingLinks"
import GenerateLinksComponent from "@/components/GenerateLinksComponent"

async function getData() {}

export default async function GenerateLinksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const existingTokens = await getExistingLinks()
  const rowsPerPage = +(process.env.ROWS_PER_TABLE_PAGE ?? 10)
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1

  return <GenerateLinksComponent data={existingTokens} hideRefresh={true} />
}
