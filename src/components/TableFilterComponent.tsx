"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  common_table_filters_active,
  common_table_filters_inactive,
} from "@/lib/Constants"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

export default function TableFilterComponent({
  columnDetails,
  filterCriteria,
  onCriteriaChange,
  filterValue,
  onValueChange,
  listOfOperands,
  showFilterOperands,
  filterOperand,
  onOperandChange,
}: {
  columnDetails: Array<{ label: string; type: "string" | "date" }>
  filterCriteria: string
  onCriteriaChange: (criteria: string) => void
  filterValue: string
  onValueChange: (value: string) => void
  listOfOperands?: string[]
  showFilterOperands?: boolean
  filterOperand?: string
  onOperandChange?: (operand: string) => void
}) {
  const [compoundedFilter, setCompoundedFilter] = useState<string>("")

  const onCriteriaValueChange = (value: string) => {
    if (common_table_filters_active.includes(value)) {
      onCriteriaChange("last_message_at")
      onOperandChange?.(">=")
      switch (value) {
        case "Active Today":
          onValueChange(new Date().toLocaleDateString())
          break
        case "Active in last 3 days":
          onValueChange(
            new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
          )
          break
        case "Active in last 7 days":
          onValueChange(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
          )
          break
        case "Active in last 30 days":
          onValueChange(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          )
          break
      }
      setCompoundedFilter(value)
      return
    }

    if (common_table_filters_inactive.includes(value)) {
      onCriteriaChange("last_message_at")
      onOperandChange?.("<")
      switch (value) {
        case "Inactive Today":
          onValueChange(new Date().toLocaleDateString())
          break
        case "Inactive in last 3 days":
          onValueChange(
            new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
          )
          break
        case "Inactive in last 7 days":
          onValueChange(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
          )
          break
        case "Inactive in last 30 days":
          onValueChange(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          )
          break
      }
      setCompoundedFilter(value)
      return
    }

    setCompoundedFilter("")
    onCriteriaChange(value)
  }

  const onOperandValueChange = (value: string) => {
    onOperandChange?.(value)
  }

  const onFilterValueChange = (value: string) => {
    onValueChange(value)
  }

  useEffect(() => {
    if (filterCriteria !== "last_message_at") {
      setCompoundedFilter("")
    }
  }, [filterCriteria])

  return (
    <div className="flex justify-start space-x-2 md:justify-end">
      <div className="flex flex-col">
        <div className="flex flex-row justify-start space-x-2 md:justify-end">
          <Select onValueChange={onCriteriaValueChange} value={filterCriteria}>
            <SelectTrigger className="w-28 md:w-56">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter By</SelectLabel>
                {[
                  ...common_table_filters_active.map((filter, index) => (
                    <SelectItem key={`ai_${index}`} value={filter}>
                      {filter}
                    </SelectItem>
                  )),
                  <Separator key={"s_1"} />,
                  ...common_table_filters_inactive.map((filter, index) => (
                    <SelectItem key={`ii_${index}`} value={filter}>
                      {filter}
                    </SelectItem>
                  )),
                  <Separator key={"s_2"} />,
                  ...columnDetails.map((column, index) => (
                    <SelectItem key={`ci_${index}`} value={column.label}>
                      {column.label}
                    </SelectItem>
                  )),
                ]}
              </SelectGroup>
            </SelectContent>
          </Select>
          {showFilterOperands ? (
            <Select onValueChange={onOperandValueChange} value={filterOperand}>
              <SelectTrigger className="w-28 md:w-56">
                <SelectValue placeholder="Operand" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Operand</SelectLabel>
                  {listOfOperands?.map((operand, index) => (
                    <SelectItem key={index} value={operand}>
                      {operand}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : null}
        </div>
        {compoundedFilter.length ? (
          <p className="text-xs text-green-500 mt-1">{compoundedFilter}</p>
        ) : null}
      </div>
      <div className="flex flex-col justify-stretch">
        <Input
          value={filterValue || ""}
          onChange={(e) => onFilterValueChange(e.target.value)}
          className="w-full"
          placeholder="Search"
        />
        <p className="text-xs text-gray-500 mt-1">
          * to match all non-empty values
        </p>
        <p className="text-xs text-gray-500">
          space [&quot; &quot;] to match all empty values
        </p>
      </div>
    </div>
  )
}
