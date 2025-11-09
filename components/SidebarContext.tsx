"use client"
import React, { createContext, useContext, useMemo, useState, useCallback } from "react"

export type SidebarItem = {
  id?: string
  icon: React.ComponentType<any>
  label: string
  fn: () => void | Promise<void>
  order?: number
}

type SidebarContextValue = {
  items: SidebarItem[]
  register: (items: SidebarItem[] | SidebarItem) => string
  unregister: (regId: string) => void
  replace: (regId: string, items: SidebarItem[] | SidebarItem) => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [regs, setRegs] = useState<Record<string, SidebarItem[]>>({})

  const register = useCallback((itemsToRegister: SidebarItem[] | SidebarItem) => {
    const id = Math.random().toString(36).slice(2, 9)
    const arr = Array.isArray(itemsToRegister) ? itemsToRegister : [itemsToRegister]
    setRegs(r => ({ ...r, [id]: arr }))
    return id
  }, [])

  const unregister = useCallback((regId: string) => {
    setRegs(r => {
      const copy = { ...r }
      delete copy[regId]
      return copy
    })
  }, [])

  const replace = useCallback((regId: string, itemsToRegister: SidebarItem[] | SidebarItem) => {
    const arr = Array.isArray(itemsToRegister) ? itemsToRegister : [itemsToRegister]
    setRegs(r => ({ ...r, [regId]: arr }))
  }, [])

  const items = useMemo(() => Object.values(regs).flat(), [regs])

  const value = useMemo(() => ({ items, register, unregister, replace }), [
    items,
    register,
    unregister,
    replace,
  ])

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebarContext must be used inside SidebarProvider")
  return ctx
}
