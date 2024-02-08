export type AppContactType = {
  volunteer_name: string
  wa_name: string | null
  phone: string
  state?: string
  volunteer_type?: string
  volunteer_time?: string
  parliamentary_constituency?: string
  assembly_constituency?: string
  language: string | null
  optin_method: string | null
  optin_time: Date | null
  inserted_at: Date | null
  last_message_at: Date | null
  user_name: string | null
  user_role: string | null
  availability?: string
  max_timestamp: Date
}

export type AppContactWorkDetailsType = {
  wa_name: string | null
  phone: string
  state?: string
  houses_visited?: string
  voters_enrolled?: string
  enrollment_quiz_status?: string
  volunteer_quiz_status?: string
}
