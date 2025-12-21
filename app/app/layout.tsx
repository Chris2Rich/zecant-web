"use client" 
import {
    Bell,
    Plus,
    MessageSquare,
    BarChart3,
    Search,
    Activity,
    PieChart,
    FileText,
    FileTextIcon,
    HomeIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {CustomUserButton} from '@/components/custom-user-button'
import {usePathname} from "next/navigation"
import NavItem from "@/components/navitem"
import NavFunction from "@/components/navfunction"
import AgentCard from "@/components/agentcard"
import { SidebarProvider, useSidebarContext } from "@/components/SidebarContext"

function SidebarInnerStatic() {
    // This component renders the dynamic area (reads from context)
    const pathname = usePathname()
    const { items } = useSidebarContext()
  
    return (
      <div className="flex flex-col items-center space-y-4 pt-4 border-t border-border">
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
            <aside className="w-16 bg-card/70 backdrop-blur-glass border-r border-border flex flex-col items-center py-6 space-y-6 z-50">
                {/* Logo */}
                <Link href="/">
                    <div className="flex items-center cursor-pointer">
                        <Image 
                            src="/Icon.png" 
                            alt="Zecant Logo" 
                            width={32} 
                            height={32}
                            className=" w-10 h-10"
                            priority
                        />
                    </div>
                </Link>

                {/* Main Navigation */}
                <nav className="flex-1 flex flex-col items-center space-y-6 pt-6 border-t border-border">
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
                <div className="flex flex-col items-center space-y-4 pt-4 border-t border-border">
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
