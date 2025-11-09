"use client"
export default function AgentCard({ name, status, lastActive, icon: Icon }) {
    const statusColors = {
      Running: 'bg-green-500/10 text-green-500 border-green-500/20',
      Completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      Error: 'bg-red-500/10 text-red-500 border-red-500/20',
      Idle: 'bg-muted text-muted-foreground border-border'
    }
  
    return (
      <div className="group p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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