"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PanelLeftIcon } from "lucide-react"

/* -------------------- CONFIG -------------------- */

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"

/* -------------------- CONTEXT -------------------- */

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (v: boolean) => void
  openMobile: boolean
  setOpenMobile: (v: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("Sidebar must be used inside provider")
  return ctx
}

/* -------------------- PROVIDER -------------------- */

function SidebarProvider({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(true)
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = () => {
    isMobile ? setOpenMobile((v) => !v) : setOpen((v) => !v)
  }

  const state = open ? "expanded" : "collapsed"

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      <div
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full",
          className ?? ""
        )}
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

/* -------------------- SIDEBAR -------------------- */

function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          className="w-[--sidebar-width] p-0"
        >
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className={cn(
        "hidden md:flex h-svh w-[--sidebar-width] flex-col bg-background",
        className ?? ""
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* -------------------- TRIGGER -------------------- */

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className ?? ""}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeftIcon />
    </Button>
  )
}

/* -------------------- RAIL (SAFE) -------------------- */

function SidebarRail({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      className={cn("w-2 bg-transparent", className ?? "")}
      {...props}
    />
  )
}

/* -------------------- SIMPLE UI PARTS -------------------- */

function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main className={cn("flex-1", className ?? "")} {...props} />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input className={cn("h-8", className ?? "")} {...props} />
  )
}

function SidebarHeader(props: React.ComponentProps<"div">) {
  return <div className="p-2" {...props} />
}

function SidebarFooter(props: React.ComponentProps<"div">) {
  return <div className="p-2" {...props} />
}

function SidebarSeparator(props: React.ComponentProps<typeof Separator>) {
  return <Separator {...props} />
}

function SidebarContent(props: React.ComponentProps<"div">) {
  return <div className="flex-1 overflow-auto" {...props} />
}

/* -------------------- EXPORT -------------------- */

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  useSidebar,
}