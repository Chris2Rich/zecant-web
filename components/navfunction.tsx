export default function NavFunction({ icon: Icon, label = "", active = false, fn = () => {} }) {
    return (
      <button
        onClick={fn}
        className={`
          group relative w-10 h-10 rounded-sm flex items-center justify-center transition-colors hover:cursor-pointer
          ${active 
            ? 'bg-primary text-primary-foreground inner-light-primary' 
            : 'hover:bg-muted text-muted-foreground hover:text-foreground hover:inner-light-subtle'
          }
        `}
      >

        <Icon className="w-5 h-5" />
        
        {/* Tooltip */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-card/95 backdrop-blur-glass text-foreground text-xs rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-border-glass">
          {label}
        </span>
      </button>
    )
  }