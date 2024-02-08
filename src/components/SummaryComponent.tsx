"use client"

import { AppContactType } from "@/lib/interfaces/AppContact"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"

type SummaryType = {
  total: number
  states: number
  pcs: number
  acs: number
  languages: number
  number_of_volunteers_per_state: { [key: string]: number }
  number_of_volunteers_per_pc: { [key: string]: number }
  number_of_volunteers_per_ac: { [key: string]: number }
}

export default function SummaryComponent({
  data,
  minified,
}: {
  data: AppContactType[]
  minified: boolean
}) {
  const [summary, setSummary] = useState<SummaryType | undefined>(undefined)
  useEffect(() => {
    const summary = {
      total: data.length,
      states: new Set(data.map((c) => c.state).filter((s) => s)).size,
      pcs: new Set(
        data.map((c) => c.parliamentary_constituency).filter((s) => s)
      ).size,
      acs: new Set(data.map((c) => c.assembly_constituency).filter((s) => s))
        .size,
      languages: new Set(data.map((c) => c.language).filter((s) => s)).size,
      number_of_volunteers_per_state: data.reduce(
        (acc: { [key: string]: number }, c) => {
          if (!c.state) {
            acc["unknown"] = (acc["unknown"] || 0) + 1
            return acc
          }
          acc[c.state] = (acc[c.state] || 0) + 1
          return acc
        },
        {}
      ),
      number_of_volunteers_per_pc: data.reduce(
        (acc: { [key: string]: number }, c) => {
          if (!c.parliamentary_constituency) {
            acc["unknown"] = (acc["unknown"] || 0) + 1
            return acc
          }
          acc[c.parliamentary_constituency] =
            (acc[c.parliamentary_constituency] || 0) + 1
          return acc
        },
        {}
      ),
      number_of_volunteers_per_ac: data.reduce(
        (acc: { [key: string]: number }, c) => {
          if (!c.assembly_constituency) {
            acc["unknown"] = (acc["unknown"] || 0) + 1
            return acc
          }
          acc[c.assembly_constituency] = (acc[c.assembly_constituency] || 0) + 1
          return acc
        },
        {}
      ),
    }
    setSummary(summary)
  }, [data])
  return (
    <div className="h-full flex flex-col">
      <p className="text-lg mx-4 mt-2 underline underline-offset-4">Summary</p>
      <ScrollArea className={`h-5/6 w-full ${minified ? "text-xs" : ""}`}>
        <ul className="p-4 space-y-2 h-full overflow-auto">
          <li>Total: {summary?.total}</li>
          <li>Total States: {summary?.states}</li>
          <li>Total PCs: {summary?.pcs}</li>
          <li>Total ACs: {summary?.acs}</li>
          <li>Total Languages: {summary?.languages}</li>
          <li>Volunteers per state:</li>
          <ul className="ps-8">
            {summary &&
              Object.entries(summary.number_of_volunteers_per_state).map(
                ([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                )
              )}
          </ul>
          <li>Volunteers per PC:</li>
          <ul className="ps-8">
            {summary &&
              Object.entries(summary.number_of_volunteers_per_pc).map(
                ([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                )
              )}
          </ul>
          <li>Volunteers per AC:</li>
          <ul className="ps-8">
            {summary &&
              Object.entries(summary.number_of_volunteers_per_ac).map(
                ([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                )
              )}
          </ul>
        </ul>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}
