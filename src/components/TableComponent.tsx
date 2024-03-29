"use client"

import {
  AppContactType,
  AppContactWorkDetailsType,
} from "@/lib/interfaces/AppContact"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TableFilterComponent from "./TableFilterComponent"
import { useEffect, useReducer, useState } from "react"
import TablePaginationComponent from "./TablePaginationComponent"
import { Button } from "./ui/button"
import { RefreshCcw, XCircle, Delete, Copy } from "lucide-react"
import { TAccessToken } from "@/lib/interfaces/AccessToken"
import { toast } from "sonner"
import TableSkeletonComponent from "./TableSkeleton"

const numericHeaders = [
  "inserted_at",
  "last_message_at",
  "optin_time",
  "created_at",
  "houses_visited",
  "voters_enrolled",
]
const numericOperands = ["<", ">", "<=", ">=", "="]
const actionHeaders = ["actions"]

const dataToString = (
  data?: AppContactType[] | TAccessToken[] | AppContactWorkDetailsType[]
) => {
  return data?.map((element) => {
    const convertedElement: { [key: string]: string } = {}
    for (const key in element) {
      const value: any = element[key as keyof (typeof data)[number]]
      if (value === null || value === undefined) {
        convertedElement[key] = ""
        continue
      }

      if (value instanceof Date) {
        convertedElement[key] = new Date(value).toLocaleString()
        continue
      }

      if (value instanceof Array) {
        convertedElement[key] = value.join(", ")
        continue
      }

      if (typeof value === "boolean") {
        convertedElement[key] = value ? "Yes" : "No"
        continue
      }

      convertedElement[key] = value
    }
    return convertedElement
  })
}

type tableStateType = {
  filterCriteria: string
  filterValue: string
  filterOperand: string
  rows: { [key: string]: string }[]
}

export default function TableComponent({
  tableHeaders,
  data,
  minified,
  rowsPerPage = 10,
  currentPage = 1,
  onRefresh,
  onDelete,
  hideRefresh = false,
  deactivateRefresh = false,
  truncateLongStrings = false,
}: {
  tableHeaders: string[]
  data?: AppContactType[] | TAccessToken[] | AppContactWorkDetailsType[]
  minified?: boolean
  rowsPerPage?: number
  currentPage?: number
  onRefresh?: () => void
  onDelete?: (index: number) => void
  hideRefresh?: boolean
  deactivateRefresh?: boolean
  truncateLongStrings?: boolean
}) {
  function tableReducer(
    tstate: tableStateType,
    action: {
      type: "criteria" | "value" | "operand" | "rows" | "effect"
      payload: string | { [key: string]: string }[] | number | undefined
    }
  ): tableStateType {
    switch (action.type) {
      case "rows":
        return {
          ...tstate,
          rows: action.payload as { [key: string]: string }[],
        }
      case "criteria":
        return { ...tstate, filterCriteria: action.payload as string }
      case "value":
        return { ...tstate, filterValue: action.payload as string }
      case "operand":
        return { ...tstate, filterOperand: action.payload as string }
      default:
        return tstate
    }
  }

  function createInitialState(): tableStateType {
    return {
      filterCriteria: "",
      filterValue: "",
      filterOperand: "",
      rows: [],
    }
  }

  const [tableState, dispatch] = useReducer(
    tableReducer,
    null,
    createInitialState
  )

  const paginatedRows = (rows?: { [key: string]: string }[]) => {
    if (!rows) {
      return []
    }

    if (tableState.filterCriteria.length && tableState.filterValue.length) {
      return rows
    }

    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage

    return rows.slice(start, end)
  }

  useEffect(() => {
    if (!data) {
      return
    }

    const allRows = dataToString(data)
    if (
      tableState.filterCriteria.length === 0 ||
      tableState.filterValue.length === 0
    ) {
      dispatch({ type: "rows", payload: allRows ?? [] })
      return
    }

    const filteredRows = allRows?.filter((row) => {
      if (tableState.filterOperand.length > 0) {
        const dateValue = new Date(row[tableState.filterCriteria])
        const filterDate = new Date(tableState.filterValue)
        switch (tableState.filterOperand) {
          case "<":
            return dateValue < filterDate
          case ">":
            return dateValue > filterDate
          case "<=":
            return dateValue <= filterDate
          case ">=":
            return dateValue >= filterDate
          case "=":
            return dateValue === filterDate
        }
      }

      const value = row[tableState.filterCriteria]?.trim().toLowerCase()
      const filter = tableState.filterValue.trim().toLowerCase()

      if (filter.length === 0) {
        return value === filter || value === undefined
      }

      if (filter === "*") {
        return value?.length > 0
      }

      return value?.includes(filter)
    })

    dispatch({ type: "rows", payload: filteredRows ?? [] })
  }, [
    data,
    tableState.filterCriteria,
    tableState.filterValue,
    tableState.filterOperand,
  ])

  return (
    <div className="px-2 flex flex-col max-h-full overflow-hidden">
      <div className="mb-4 md:me-4">
        {!minified && (
          <div
            data-hr={hideRefresh ? "y" : "n"}
            className="flex flex-col items-start md:flex-row md:items-center md:justify-between data-[hr='y']:md:justify-end"
          >
            {!hideRefresh && (
              <div className="flex flex-col mb-4">
                <Button
                  disabled={deactivateRefresh}
                  variant="default"
                  onClick={async () => {
                    await onRefresh?.()
                  }}
                >
                  <RefreshCcw size={16} className="me-2" />
                  Refresh Data
                </Button>
                <p className="text-xs text-blue-500 text-center">
                  Showing {tableState.rows.length} entries{" "}
                </p>
              </div>
            )}
            <div className="flex flex-row items-start justify-center space-x-2">
              <TableFilterComponent
                columnDetails={tableHeaders.map((h) => {
                  return {
                    label: h,
                    type: numericHeaders.includes(h) ? "date" : "string",
                  }
                })}
                filterCriteria={tableState.filterCriteria}
                onCriteriaChange={(value) =>
                  dispatch({ type: "criteria", payload: value })
                }
                filterValue={tableState.filterValue}
                onValueChange={(value) =>
                  dispatch({ type: "value", payload: value })
                }
                listOfOperands={numericOperands}
                showFilterOperands={numericHeaders.includes(
                  tableState.filterCriteria
                )}
                filterOperand={tableState.filterOperand}
                onOperandChange={(value) =>
                  dispatch({ type: "operand", payload: value })
                }
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  dispatch({ type: "criteria", payload: "" })
                  dispatch({ type: "value", payload: "" })
                  dispatch({ type: "operand", payload: "" })
                }}
              >
                <Delete />
              </Button>
            </div>
          </div>
        )}
      </div>
      {data && (
        <Table className={minified ? "text-xs" : ""}>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows(tableState.rows)?.map((row, index) => (
              <TableRow key={index}>
                {tableHeaders.map((header) => {
                  if (actionHeaders.includes(header)) {
                    return (
                      <TableCell key={header}>
                        <div className="flex flex-row">
                          <Button
                            variant="ghost"
                            size="smIcon"
                            onClick={() => onDelete?.(index)}
                          >
                            <XCircle className="text-red-500 text-xs" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="smIcon"
                            onClick={async () => {
                              await navigator.clipboard.writeText(
                                `${process.env.NEXT_PUBLIC_URL}/dashboard?token=${row.token}`
                              )
                              toast.success("Copied to clipboard")
                            }}
                          >
                            <Copy className="text-blue-500" />
                          </Button>
                        </div>
                      </TableCell>
                    )
                  }
                  return (
                    <TableCell key={header}>
                      {truncateLongStrings && row[header]?.length > 32
                        ? row[header]?.substring(0, 8)
                        : row[header]}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {!data && <TableSkeletonComponent />}
      {!minified &&
        !tableState.filterCriteria.length &&
        !tableState.filterValue.length && (
          <TablePaginationComponent
            currentPage={currentPage}
            totalRows={tableState.rows.length}
            rowsPerPage={rowsPerPage}
            islastPage={tableState.rows.length < rowsPerPage * currentPage}
          />
        )}
    </div>
  )
}
