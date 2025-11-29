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
            <aside className="w-16 bg-card/70 backdrop-blur-md border-r border-border flex flex-col items-center py-6 space-y-6">
                {/* Logo */}
                <Link href="/">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 backdrop-blur-md  rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">Z</span>
                        </div>
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
                    <div className="h-full rounded-lg border border-border bg-card/30 p-4 select-text scrollbar-thin">
                        {children} </div>
                </div>
            </main>

            {/* Agent Panel - Right Side */}
            <aside className="w-80 bg-card/70 backdrop-blur-md border-l border-border flex flex-col">
                {/* Panel Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-foreground">Agent Workflows</h2>
                        <button className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors">
                            <Plus className="w-4 h-4 text-muted-foreground"/>
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Monitor and manage active trading agents
                    </p>
                </div>

                {/* Active Agents */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <AgentCard name="Momentum Scanner" status="Running" lastActive="2m Ago"
                        icon={Search}/>
                    <AgentCard name="Backtest Runner" status="Completed" lastActive="15m Ago"
                        icon={Activity}/>
                    <AgentCard name="Portfolio Analyzer" status="Idle" lastActive="1h Ago"
                        icon={PieChart}/>
                    <AgentCard name="News Monitor" status="Error" lastActive="Just Now"
                        icon={FileText}/>
                </div>

                {/* Panel Footer */}
                <div className="p-4 border-t border-border">
                    <button className="w-full py-2 px-4 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors">
                        View All Workflows
                    </button>
                </div>
            </aside>
        </div>
        </SidebarProvider>
    )
}
