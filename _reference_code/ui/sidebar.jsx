"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Sidebar = ({ 
  className, 
  children, 
  defaultOpen = true, 
  onOpenChange, 
  ...props 
}) => {
  const [open, setOpen] = React.useState(defaultOpen)
  
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (onOpenChange) onOpenChange(isOpen)
  }

  return (
    <div className={cn("flex h-screen", className)} {...props}>
      <div
        className={cn(
          "relative flex flex-col h-full bg-background border-r transition-all duration-300 ease-in-out",
          open ? "w-64" : "w-16"
        )}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { isCollapsed: !open })
              }
              return child
            })}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-4 h-6 w-6 rounded-full border bg-background p-0"
          onClick={() => handleOpenChange(!open)}
        >
          {open ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
    </div>
  )
}

const SidebarHeader = ({ className, children, ...props }) => (
  <div
    className={cn("flex items-center justify-between mb-6", className)}
    {...props}
  >
    {children}
  </div>
)

const SidebarTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold", className)} {...props} />
)

const SidebarContent = ({ className, ...props }) => (
  <div className={cn("space-y-1", className)} {...props} />
)

const SidebarItem = ({ className, isActive, children, ...props }) => (
  <div
    className={cn(
      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
      isActive
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const SidebarItemIcon = ({ className, ...props }) => (
  <span className={cn("mr-3 h-5 w-5", className)} {...props} />
)

const SidebarItemText = ({ className, isCollapsed, children, ...props }) => (
  <span
    className={cn(
      "transition-opacity duration-200",
      isCollapsed ? "opacity-0 w-0" : "opacity-100"
    )}
    {...props}
  >
    {children}
  </span>
)

export {
  Sidebar,
  SidebarHeader,
  SidebarTitle,
  SidebarContent,
  SidebarItem,
  SidebarItemIcon,
  SidebarItemText,
}
