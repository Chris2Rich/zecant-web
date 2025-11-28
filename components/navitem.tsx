import Link from "next/link"

export default function NavItem({ icon: Icon, label = "", active = false, link = "/" }) {
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
        <span className="absolute left-full ml-2 px-2 py-1 bg-card/70 text-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-border">
          {label}
        </span>
      </button>
      </Link>
    )
  }