"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCallback, useEffect, useState } from "react"
import getAllStates from "@/app/actions/getAllStates"
import getAllPCs from "@/app/actions/getAllPcs"
import MultiSelectCombobox from "@/components/MultiSelectCombobox"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { TAccessToken } from "@/lib/interfaces/AccessToken"
import TableComponent from "./TableComponent"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function GenerateLinksComponent({
  data = [],
  minified = false,
  hideRefresh = false,
}: {
  data?: TAccessToken[]
  minified?: boolean
  hideRefresh?: boolean
}) {
  const [generatingFor, setGeneratingFor] = useState<string>("state")
  const [list, setList] = useState<string[]>([])
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [existingTokens, setExistingTokens] = useState<TAccessToken[]>(
    data ?? []
  )
  const router = useRouter()

  const onSwitchChange = useCallback((checked: boolean) => {
    if (checked) {
      setGeneratingFor("pc")
      setList([])
    } else {
      setGeneratingFor("state")
      setList([])
    }
  }, [])

  const onGenerateClick = useCallback(async () => {
    const data = await fetch("/api/accesslink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        target: generatingFor,
        value: selectedValues,
      }),
    })

    const response = await data.json()

    if (response.error) {
      toast.error(response.error)
      return
    }

    if (!existingTokens.find((token) => token.token === response.token.token)) {
      setExistingTokens((prev) => [...prev, response.token])
    }
    setSelectedValues([])
  }, [generatingFor, selectedValues, existingTokens])

  const onDelete = useCallback(
    (index: number) => {
      const token = existingTokens[index]
      const del = async () => {
        const res = await fetch("/api/accesslink", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify({ token: token.token }),
        })

        if (res.status === 200) {
          setExistingTokens((prev) => {
            const copy = [...prev]
            copy.splice(index, 1)
            return copy
          })
          toast.success("Token deleted")
        }
      }

      del()
    },
    [existingTokens]
  )

  useEffect(() => {
    if (!data) {
      return
    }

    setExistingTokens(data)
  }, [data])

  useEffect(() => {
    if (!generatingFor || generatingFor.length === 0) {
      return
    }

    const fetchData = async () => {
      const data =
        generatingFor === "state" ? await getAllStates() : await getAllPCs()
      setList(
        Array.from(new Set(data[0].data.map((item) => item.toLowerCase())))
      )
    }

    fetchData()

    return () => {
      setList([])
    }
  }, [generatingFor])

  return (
    <div className="h-full w-full relative">
      <div className="flex flex-col space-y-2 px-2 pt-2 h-5/6">
        <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between">
          <p className="text-lg underline underline-offset-4">Generate Links</p>
          <div className="flex items-center space-x-2">
            <Label htmlFor="generate_for">State</Label>
            <Switch
              id="generate_for"
              checked={generatingFor === "pc"}
              onCheckedChange={onSwitchChange}
            />
            <Label htmlFor="generate_for">PC</Label>
          </div>
        </div>
        {list.length > 0 && (
          <MultiSelectCombobox
            data={list}
            prompt={generatingFor}
            onChange={setSelectedValues}
          />
        )}
        <ScrollArea className="w-full">
          <TableComponent
            data={existingTokens?.slice(0, 5) ?? []}
            tableHeaders={[
              "token",
              "access_type",
              "scope",
              "is_active",
              "created_at",
              "actions",
            ]}
            minified={minified}
            hideRefresh={hideRefresh}
            truncateLongStrings={true}
            onDelete={onDelete}
          />
        </ScrollArea>
      </div>
      <div className="flex justify-end me-2 pt-2 space-x-2">
        <Button
          disabled={selectedValues.length === 0}
          onClick={onGenerateClick}
        >
          Generate
        </Button>
        {minified && (
          <Button
            variant="default"
            className="mb-4"
            onClick={(e) => router.push("/generatelinks")}
          >
            View All
          </Button>
        )}
      </div>
    </div>
  )
}
