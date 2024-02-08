"use client"

import { useEffect, useReducer } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Delete } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type selectedStateType = {
  selectedValues: string[]
  open: boolean
}

export default function MultiSelectCombobox({
  data,
  prompt,
  onChange,
}: {
  data: string[]
  prompt: string
  onChange: (value: string[]) => void
}) {
  function selectedStateReducer(
    state: selectedStateType,
    action: {
      type: "add" | "remove" | "open" | "clear"
      payload: string | boolean
    }
  ): selectedStateType {
    switch (action.type) {
      case "add":
        const updatedAfterAddition = {
          ...state,
          selectedValues: [...state.selectedValues, action.payload as string],
        }
        onChange(updatedAfterAddition.selectedValues)
        return updatedAfterAddition
      case "remove":
        const updatedAfterRemoval = {
          ...state,
          selectedValues: [...state.selectedValues].filter(
            (item) => item !== action.payload
          ),
        }
        onChange(updatedAfterRemoval.selectedValues)
        return updatedAfterRemoval
      case "clear":
        const updatedAfterClearing = {
          ...state,
          selectedValues: [],
        }
        if (state.selectedValues.length > 0) {
          onChange(updatedAfterClearing.selectedValues)
        }
        return updatedAfterClearing
      case "open":
        return {
          ...state,
          open: action.payload as boolean,
        }
      default:
        return state
    }
  }

  function createInitialState() {
    return {
      selectedValues: [],
      open: false,
    }
  }

  const [selectedState, dispatch] = useReducer(
    selectedStateReducer,
    null,
    createInitialState
  )

  const getVisibleText = () => {
    if (selectedState.selectedValues.length > 1) {
      return `Multiple ${prompt}s`
    }

    if (selectedState.selectedValues.length === 1) {
      return selectedState.selectedValues[0]
    }

    return `Select ${prompt}(s)...`
  }

  const getGeneratingText = () => {
    if (selectedState.selectedValues.length === 0) {
      return ""
    }

    return `Generating for ${selectedState.selectedValues.join(", ")}`
  }

  useEffect(() => {
    dispatch({ type: "clear", payload: "" })
  }, [data])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-2">
        <Popover
          open={selectedState.open}
          onOpenChange={() =>
            dispatch({ type: "open", payload: !selectedState.open })
          }
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={selectedState.open}
              className="w-[200px] justify-between"
            >
              {getVisibleText()}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Select ${prompt}(s)...`} />
              <CommandEmpty>{`No ${prompt}s found`}</CommandEmpty>
              <ScrollArea className="h-96">
                <CommandGroup>
                  {data.map((item, idx) => {
                    return (
                      <CommandItem
                        key={idx}
                        value={item}
                        onSelect={(currentValue) => {
                          console.log(currentValue)
                          if (
                            selectedState.selectedValues.includes(currentValue)
                          ) {
                            dispatch({
                              type: "remove",
                              payload: currentValue.toLowerCase(),
                            })
                            return
                          }

                          dispatch({
                            type: "add",
                            payload: currentValue.toLowerCase(),
                          })
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedState.selectedValues.includes(
                              item.toLowerCase()
                            )
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {item}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            dispatch({ type: "clear", payload: "" })
          }}
        >
          <Delete />
        </Button>
      </div>
      <p className="mt-1 text-xs text-gray-500 max-w-full">
        {getGeneratingText()}
      </p>
    </div>
  )
}
