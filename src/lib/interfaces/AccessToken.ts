import { z } from "zod"

export const AccessTokenSchema = z.object({
  token: z.string().uuid(),
  access_type: z.enum(["state", "pc"]),
  scope: z.array(z.string()),
  created_at: z.coerce.date(),
  is_active: z.boolean(),
})

export type TAccessToken = z.infer<typeof AccessTokenSchema>
