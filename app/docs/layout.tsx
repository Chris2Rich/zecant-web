"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen text-foreground overflow-hidden">
      {/* Side Navigation */}
      <aside className="w-48 bg-card/70 backdrop-blur-glass border-r border-border flex flex-col items-center py-3 space-y-3 z-50">
        <Link href="/" className="mb-6">
          <button className="group relative w-10 h-10 rounded-sm flex items-center justify-center transition-colors bg-primary text-primary-foreground inner-light-primary hover:cursor-pointer">
            <Image
              src="/Icon Logo.png"
              alt="Zecant Logo"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="absolute left-full ml-2 px-2 py-1 bg-card/95 backdrop-blur-glass text-foreground text-xs rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-border-glass z-50">
              Zecant
            </span>
          </button>
        </Link>

        {/* Text-based Navigation */}
        <nav className="flex-1 flex flex-col items-start space-y-2 pt-3 px-4 w-full">
          <Link
            href="/"
            className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors"
          >
            Example
          </Link>
          <Link
            href="/"
            className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors"
          >
            Example
          </Link>
          <Link
            href="/"
            className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors"
          >
            Example
          </Link>
        </nav>
      </aside>

      {/* Content Grid */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-2 scrollbar-thin">
          <div className="h-full rounded-sm border border-border bg-card/30 p-4 select-text scrollbar-thin">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}