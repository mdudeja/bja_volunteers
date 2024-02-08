"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { VariantProps } from "class-variance-authority"

export type ButtonBarItem = {
  title: string
  onClick: () => void
  variant?: VariantProps<typeof buttonVariants>["variant"]
}

export default function ButtonBarComponent({
  buttons,
}: {
  buttons: ButtonBarItem[]
}) {
  return (
    <div className="flex justify-end space-x-2">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant || "default"}
          onClick={button.onClick}
        >
          {button.title}
        </Button>
      ))}
    </div>
  )
}
