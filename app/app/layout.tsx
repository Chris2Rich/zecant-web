"use client" 
import {
    Bell,
    MessageSquare,
    BarChart3,
    PieChart,
    FileTextIcon,
    HomeIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createPortal } from "react-dom"
import { useState, useRef } from "react"
import {CustomUserButton} from '@/components/custom-user-button'
import {usePathname} from "next/navigation"
import NavItem from "@/components/navitem"
import NavFunction from "@/components/navfunction"
import { SidebarProvider, useSidebarContext } from "@/components/SidebarContext"

function SidebarInnerStatic() {
    // This component renders the dynamic area (reads from context)
    const pathname = usePathname()
    const { items } = useSidebarContext()
  
    return (
      <div className="flex flex-col items-center space-y-3 pt-3 border-t border-border">
        {items.length === 0 ? null : items.map((item, i) => (
          <NavFunction
            key={item.id ?? `${item.fn}-${i}`}
            icon={item.icon}
            label={item.label}
            fn={item.fn}
          />
        ))}
      </div>
    )
  }

  function LogoButton({ label = "", active = false, link = "/" }) {
    const [show, setShow] = useState(false)
    const [coords, setCoords] = useState({ top: 0, left: 0 })
    const ref = useRef<HTMLButtonElement>(null)
  
    const handleEnter = () => {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) {
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.right + 8
        })
      }
      setShow(true)
    }
  
    return (
      <>
        <Link href={link}>
          <button
            ref={ref}
            onMouseEnter={handleEnter}
            onMouseLeave={() => setShow(false)}
            className={`
              group relative w-10 h-10 rounded-sm flex items-center justify-center transition-colors
              ${active
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <Image 
              src="/Icon Logo.png" 
              alt="Zecant Logo" 
              width={32} 
              height={32}
              className=" w-8 h-8"
              priority
          />
          </button>
        </Link>
  
        {show && createPortal(
          <div
            className="fixed px-2 py-1 bg-card/95 backdrop-blur-glass text-foreground text-xs rounded-sm border border-border-glass z-[9999] whitespace-nowrap pointer-events-none"
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translateY(-50%)"
            }}
          >
            {label}
          </div>,
          document.body
        )}
      </>
    )
  }  

export default function AppLayout({children, sidebarItems = []} : {
    children : React.ReactNode
    sidebarItems?: Array<{
        icon: any,
        label: string,
        link: string,
        active?: boolean
      }>
}) {
    const pathname = usePathname()
    return (
        <SidebarProvider>
            <div className="flex h-screen text-foreground overflow-hidden">
            {/* Side Navigation */}
            <aside className="w-16 bg-card/70 backdrop-blur-glass border-r border-border flex flex-col items-center py-3 space-y-3 z-50 overflow-y-scroll overflow-x-scroll no-scrollbar">
                <LogoButton label="Exit App" link="/" active={true} />

                {/* Main Navigation */}
                    <nav className="flex-1 flex flex-col items-center space-y-3 pt-3 border-t border-border">
                    <NavItem icon={HomeIcon}
                        label="Home"
                        link="/app"
                        active={
                            pathname == '/app'
                        }/>
                    <NavItem icon={FileTextIcon}
                        label="News"
                        link="/app/news"
                        active={
                            pathname.startsWith('/app/news')
                        }/>
                    <NavItem icon={MessageSquare}
                        label="Chat"
                        link="/app/chat"
                        active={
                            pathname.startsWith('/app/chat')
                        }/>
                    <NavItem icon={PieChart}
                        label="Portfolio"
                        link="/app/portfolio"
                        active={
                            pathname.startsWith('/app/portfolio')
                        }/>
                    <NavItem icon={BarChart3}
                        label="Strategies"
                        link="/app/strategies"
                        active={
                            pathname.startsWith('/app/strategies')
                        }/>
                    <SidebarInnerStatic />
                </nav>


                {/* Bottom Actions */}
                <div className="flex flex-col items-center space-y-3 pt-3 border-t border-border">
                    <NavItem icon={Bell}
                        label="Notifications"
                        link="/app/notifications"
                        active={
                            pathname.startsWith('/app/notifications')
                        }/>
                    <CustomUserButton full={false}/>
                </div>
            </aside>


            {/* Content Grid */}
            <main className="flex-1 overflow-hidden">
                <div className="h-full p-2 scrollbar-thin">
                    {/* Empty grid container */}
                    <div className="h-full rounded-sm border border-border bg-card/30 p-4 select-text scrollbar-thin">
                        {children} </div>
                </div>
            </main>
        </div>
        </SidebarProvider>
    )
}
