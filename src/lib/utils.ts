import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function makeRequest(
  url: string,
  method?: string,
  body?: any
): Promise<any> {
  const options: RequestInit = {
    method: method ?? "GET",
    headers: {
      credentials: "include",
      "Content-Type": "application/json",
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const res = await fetch(url, options)

  const json = await res.json()

  return json
}
