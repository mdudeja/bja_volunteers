"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Suspense, useCallback, useEffect, useState } from "react"
import getAllStates from "@/app/actions/getAllStates"
import getAllPCs from "@/app/actions/getAllPcs"
import MultiSelectCombobox from "@/components/MultiSelectCombobox"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import TableComponent from "./TableComponent"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import getExistingLinks from "@/app/actions/getExistingLinks"
import Loading from "@/app/loading"

export default function GenerateLinksComponent({
  minified = false,
  hideRefresh = false,
}: {
  minified?: boolean
  hideRefresh?: boolean
}) {
  const [generatingFor, setGeneratingFor] = useState<string>("state")
  const [list, setList] = useState<string[]>([])
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const router = useRouter()

  const { data, refetch } = useSuspenseQuery({
    queryKey: ["existingLinks"],
    queryFn: () => getExistingLinks(),
    initialData: [],
  })

  const { data: dataStates } = useSuspenseQuery({
    queryKey: ["statesList"],
    queryFn: () => getAllStates(),
    gcTime: 1000 * 60 * 60,
    initialData: [],
  })

  const { data: dataPCs } = useSuspenseQuery({
    queryKey: ["pcsList"],
    queryFn: () => getAllPCs(),
    gcTime: 1000 * 60 * 60,
    initialData: [],
  })

  const mutationAdd = useMutation({
    mutationFn: async ({
      target,
      value,
    }: {
      target: string
      value: string[]
    }) => {
      return fetch("/api/accesslink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({
          target,
          value,
        }),
      })
    },
    onSuccess: () => {
      toast.success("Link generated successfully")
      refetch()
      setSelectedValues([])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const mutationDelete = useMutation({
    mutationFn: async (token?: string) => {
      if (!token) {
        toast.error("Cannot identify which token to delete")
        return
      }

      return fetch("/api/accesslink", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({ token }),
      })
    },
    onSuccess: () => {
      toast.success("Token deleted")
      refetch()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSwitchChange = useCallback((checked: boolean) => {
    if (checked) {
      setGeneratingFor("pc")
    } else {
      setGeneratingFor("state")
    }
  }, [])

  useEffect(() => {
    if (generatingFor === "state") {
      setList(
        Array.from(
          new Set(dataStates?.[0]?.data.map((item) => item.toLowerCase())) ?? []
        )
      )
    } else {
      setList(
        Array.from(
          new Set(dataPCs?.[0]?.data.map((item) => item.toLowerCase())) ?? []
        )
      )
    }
  }, [generatingFor, dataStates, dataPCs])

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-full w-full relative">
        <div className="flex flex-col space-y-2 px-2 pt-2 h-5/6">
          <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between">
            <p className="text-lg underline underline-offset-4">
              Generate Links
            </p>
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
              data={data?.slice(0, 5) ?? []}
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
              onDelete={(index: number) =>
                mutationDelete.mutate(data?.[index].token)
              }
            />
          </ScrollArea>
        </div>
        <div className="flex justify-end me-2 pt-2 space-x-2">
          <Button
            disabled={selectedValues.length === 0}
            onClick={() =>
              mutationAdd.mutate({
                target: generatingFor,
                value: selectedValues,
              })
            }
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
    </Suspense>
  )
}
