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
    HomeIcon,
  } from "lucide-react"
import Link from "next/link"
import { CustomUserButton } from '@/components/custom-user-button'
import { usePathname } from "next/navigation"

  
  export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    return (
      <div className="flex h-screen bg-background text-foreground ">
        {/* Side Navigation */}
        <aside className="w-16 bg-card border-r border-border flex flex-col items-center py-6 space-y-6">
          {/* Logo */}
          <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Z</span>
            </div>
          </div>
        </Link>
  
          {/* Main Navigation */}
          <nav className="flex-1 flex flex-col items-center space-y-6 pt-6 border-t border-border">
            <NavItem icon={HomeIcon} label="Home" link="/app" active={pathname == '/app'}/>
            <NavItem icon={FileTextIcon} label="News" link="/app/news" active={pathname.startsWith('/app/news')}/>
            <NavItem icon={MessageSquare} label="Chat" link="/app/chat" active={pathname.startsWith('/app/chat')}/> 
            <NavItem icon={BarChart3} label="Strategies" link="/app/strategies" active={pathname.startsWith('/app/strategies')}/>
          </nav>
  
          {/* Bottom Actions */}
          <div className="flex flex-col items-center space-y-4 pt-4 border-t border-border">
            <NavItem icon={Bell} label="Notifications" link="/app/notifications" active={pathname.startsWith('/app/notifications')}/>
            <CustomUserButton full={false} />
          </div>
        </aside>
  
  
          {/* Content Grid */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full p-2">
              {/* Empty grid container */}
              <div className="h-full rounded-lg border border-border bg-card/30 p-4 select-text">
                {children}
              </div>
            </div>
          </main>
  
        {/* Agent Panel - Right Side */}
        <aside className="w-80 bg-card border-l border-border flex flex-col">
          {/* Panel Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Agent Workflows</h2>
              <button className="w-8 h-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Monitor and manage active trading agents
            </p>
          </div>
  
          {/* Active Agents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AgentCard
              name="Momentum Scanner"
              status="Running"
              lastActive="2m Ago"
              icon={Search}
              />
            <AgentCard
              name="Backtest Runner"
              status="Completed"
              lastActive="15m Ago"
              icon={Activity}
              />
            <AgentCard
              name="Portfolio Analyzer"
              status="Idle"
              lastActive="1h Ago"
              icon={PieChart}
              />
            <AgentCard
              name="News Monitor"
              status="Error"
              lastActive="Just Now"
              icon={FileText}
              />
          </div>
  
          {/* Panel Footer */}
          <div className="p-4 border-t border-border">
            <button className="w-full py-2 px-4 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors">
              View All Workflows
            </button>
          </div>
        </aside>
      </div>
    )
  }
  
  function NavItem({ icon: Icon, label = "", active = false, link = "/" }) {
    return (
      <Link href={link}>
      <button
        className={`
          group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors
          ${active 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }
        `}
      >
        <Icon className="w-5 h-5" />
        
        {/* Tooltip */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-border">
          {label}
        </span>
      </button>
      </Link>
    )
  }
  
  function AgentCard({ name, status, lastActive, icon: Icon }) {
    const statusColors = {
      Running: 'bg-green-500/10 text-green-500 border-green-500/20',
      Completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      Error: 'bg-red-500/10 text-red-500 border-red-500/20',
      Idle: 'bg-muted text-muted-foreground border-border'
    }
  
    return (
      <div className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate mb-1">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[status]}`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lastActive}
            </p>
          </div>
        </div>
      </div>
    )
  }