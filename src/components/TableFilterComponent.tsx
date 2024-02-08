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
  return (
    <div className="flex justify-start space-x-2 md:justify-end">
      <Select onValueChange={onCriteriaChange} value={filterCriteria}>
        <SelectTrigger className="w-28 md:w-56">
          <SelectValue placeholder="Filter By" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filter By</SelectLabel>
            {columnDetails.map((column, index) => (
              <SelectItem key={index} value={column.label}>
                {column.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {showFilterOperands ? (
        <Select onValueChange={onOperandChange} value={filterOperand}>
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
      <Input
        value={filterValue || ""}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-28 md:w-56"
        placeholder="Search"
      />
    </div>
  )
}
