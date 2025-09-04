"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={1}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-center text-sm ring-offset-background transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center space-x-2", className)}
      {...props}
    />
  )
})
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="separator"
      className="h-1 w-4 bg-muted"
      {...props}
    >
      <span className="sr-only">Digit</span>
    </div>
  )
})
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSeparator }
