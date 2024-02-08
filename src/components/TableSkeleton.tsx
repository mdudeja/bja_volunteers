import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

export default function TableSkeletonComponent() {
  const rows = Array.from({ length: 6 }, (_, i) => i)
  const columns = Array.from({ length: 5 }, (_, i) => i)
  return (
    <Table>
      <TableBody>
        {rows.map((_, i) => (
          <TableRow key={i}>
            {columns.map((_, j) => (
              <TableCell key={`${i}_${j}`} className="border border-muted">
                <Skeleton className="w-20 h-6" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
