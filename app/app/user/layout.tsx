"use client"

import { useEffect } from "react"
import { useSidebarContext } from "@/components/SidebarContext"
import { usePathname, useRouter } from "next/navigation"
import { User, Settings, Shield, Trash2 } from "lucide-react"

const userNavItems = [
  { icon: User, label: "Profile", path: "/app/user" },
  { icon: Settings, label: "Settings", path: "/app/user/settings" },
  { icon: Shield, label: "Security", path: "/app/user/security" },
  { icon: Trash2, label: "Delete Account", path: "/app/user/delete" },
]

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { register, unregister } = useSidebarContext()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const regId = register(
      userNavItems.map((item) => ({
        icon: item.icon,
        label: item.label,
        fn: () => router.push(item.path),
      }))
    )

    return () => unregister(regId)
  }, [register, unregister, router])

  return <>{children}</>
}
