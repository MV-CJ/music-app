"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
        size === "default" ? "h-[18px] w-[32px]" : "h-[14px] w-[24px]",
        className ?? ""
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block rounded-full bg-background transition-transform",
          "data-[state=checked]:translate-x-[14px]",
          "data-[state=unchecked]:translate-x-0",
          size === "default" ? "h-4 w-4" : "h-3 w-3"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }