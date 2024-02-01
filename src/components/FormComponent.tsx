"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ControllerRenderProps,
  DefaultValues,
  Path,
  useForm,
} from "react-hook-form"
import { TypeOf, z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Calendar } from "./ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

type AsyncDefaultValues<TFieldValues> = (
  payload?: unknown
) => Promise<TFieldValues>

export type TFormComponentField<TFieldValues> = Array<{
  name: keyof TFieldValues
  label: string
  type:
    | "text"
    | "select"
    | "textarea"
    | "date"
    | "checkbox"
    | "mobile"
    | "email"
    | "password"
  placeholder?: string
  disabled?: boolean
  hidden?: boolean
  description?: string
  isOptional?: boolean
  selectOptions?: {
    label: string
    value: string
  }[]
}>

export default function FormComponent<
  TSchema extends z.ZodType<any, any, any>
>({
  formSchema,
  onSubmit,
  defaultValues,
  formFields,
  disableSubmit,
}: {
  formSchema: TSchema
  onSubmit: (data: z.infer<TSchema>) => void
  defaultValues?:
    | DefaultValues<z.infer<TSchema>>
    | AsyncDefaultValues<z.infer<TSchema>>
  formFields: TFormComponentField<z.infer<TSchema>>
  disableSubmit?: boolean
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as any,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formFields.map((formField, idx) => {
          return (
            <FormField
              key={idx}
              control={form.control}
              name={formField.name as Path<TSchema>}
              render={({ field }) => (
                <FormItem>
                  {!formField.hidden && (
                    <FormLabel htmlFor={formField.name as string}>
                      {formField.label}
                    </FormLabel>
                  )}
                  {getControlByInputType(formField, field)}
                  {!formField.hidden && formField.description && (
                    <FormDescription>{formField.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}
        <div className="flex flex-row justify-end">
          <Button variant="default" type="submit" disabled={disableSubmit}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

function getControlByInputType<TSchema extends z.ZodType<any, any, any>>(
  formField: TFormComponentField<TSchema>[number],
  field: ControllerRenderProps<TypeOf<TSchema>, Path<TSchema>>
) {
  switch (formField.type) {
    case "select":
      return (
        <FormControl>
          <Select
            {...field}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={formField.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{formField.label}</SelectLabel>
                {formField.selectOptions?.map((option, idx1) => (
                  <SelectItem key={idx1} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
      )
    case "textarea":
      return (
        <FormControl>
          <Textarea
            {...field}
            id={formField.name as string}
            className={`${formField.hidden ? "hidden" : ""}`}
            placeholder={formField.placeholder}
            defaultValue={field.value}
            disabled={formField.disabled}
          />
        </FormControl>
      )
    case "checkbox":
      return (
        <FormControl>
          <Checkbox
            {...field}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </FormControl>
      )
    case "date":
      console.log(field.value)
      return (
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                {...field}
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    default:
      return (
        <FormControl>
          <Input
            {...field}
            id={formField.name as string}
            className={`${formField.hidden ? "hidden" : ""}`}
            type={formField.type ?? "text"}
            placeholder={formField.placeholder}
            disabled={formField.disabled}
            value={field.value}
          />
        </FormControl>
      )
  }
}
