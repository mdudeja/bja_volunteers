import { z } from "zod"

export const BQContactSchema = z.object({
  id: z.number(),
  bq_uuid: z.string().uuid().nullable(),
  bq_inserted_at: z
    .object({
      value: z.coerce.date(),
    })
    .nullable(),
  name: z.string().nullable(),
  phone: z.string().regex(/^\d{12}$/),
  provider_status: z.string(),
  status: z.string(),
  language: z.string().nullable(),
  contact_optin_method: z.string().nullable(),
  optin_time: z
    .object({
      value: z.coerce.date(),
    })
    .nullable(),
  optout_time: z
    .object({
      value: z.coerce.date(),
    })
    .nullable(),
  last_message_at: z
    .object({
      value: z.coerce.date(),
    })
    .nullable(),
  inserted_at: z
    .object({
      value: z.coerce.date(),
    })
    .nullable(),
  updated_at: z
    .object({
      value: z.coerce.date(),
    })
    .nullable(),
  user_name: z.string().nullable(),
  user_role: z.string().nullable(),
  fields: z
    .array(
      z.object({
        label: z.string().nullable(),
        value: z.string().nullable(),
        type: z.string().nullable(),
        inserted_at: z
          .object({
            value: z.coerce.date(),
          })
          .nullable(),
      })
    )
    .default([]),
  settings: z
    .object({
      label: z.string().nullable(),
      values: z
        .array(
          z.object({
            key: z.string().nullable(),
            value: z.string().nullable(),
          })
        )
        .default([]),
    })
    .nullable(),
  groups: z
    .array(
      z.object({
        label: z.string(),
        description: z.string().nullable(),
      })
    )
    .default([]),
  tags: z
    .array(
      z.object({
        label: z.string(),
      })
    )
    .default([]),
  raw_fields: z.string().nullable(),
  group_labels: z.string().nullable(),
  max_timestamp: z.object({
    value: z.coerce.date(),
  }),
})

export type TBQContact = z.infer<typeof BQContactSchema>
