"use client"

import FormComponent from "@/components/FormComponent"
import useSession from "@/lib/hooks/use-session"
import { TLogin, loginSchema } from "@/lib/interfaces/Auth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function LoginPage() {
  const { login } = useSession(null)
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(
    null
  )
  const router = useRouter()
  const searchParams = useSearchParams()

  async function onSubmit(values?: TLogin) {
    if (!values) {
      return
    }

    const toastId = toast.loading("Logging in...")
    setLoadingToastId(toastId)

    const res = await login(values)
    toast.dismiss(toastId)
    setLoadingToastId(null)

    if (res.user && res.user.username.length && res.isLoggedIn) {
      const redirect = searchParams.get("redirect")
      if (redirect) {
        router.push(redirect)
        return
      }

      router.push("/dashboard")
      return
    }

    toast.error("Login failed")
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col my-4 items-center">
        <FormComponent
          formSchema={loginSchema}
          onSubmit={onSubmit}
          disableSubmit={loadingToastId !== null}
          defaultValues={{ username: "", password: "" }}
          formFields={[
            {
              name: "username",
              type: "text",
              label: "Username",
              placeholder: "Username",
              description: "Enter a username",
            },
            {
              name: "password",
              type: "password",
              label: "Password",
              placeholder: "Password",
              description: "Enter a password",
            },
          ]}
        />
      </div>
    </div>
  )
}
