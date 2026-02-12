"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const navigationItems = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/example1", label: "Getting Started" },
  { href: "/docs/example2", label: "API Reference" },
  { href: "/docs/example3", label: "SDKs & Tools" },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen text-foreground overflow-hidden">
      {/* Side Navigation */}
      <aside className="w-48 bg-card/70 backdrop-blur-glass border-r border-border flex flex-col items-center py-3 space-y-3 z-50">
        <Link href="/" className="mb-6">
          <div className="flex items-center cursor-pointer">
            <Image
              src="/Wordmark.png"
              alt="Zecant"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>
        </Link>

        {/* Text-based Navigation */}
        <nav className="flex-1 flex flex-col items-start space-y-2 pt-3 px-4 w-full">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full px-3 py-2 text-sm rounded-sm transition-colors ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content Grid */}
      <main className="flex-1">
        <div className="h-full p-2 scrollbar-thin">
          <div className="h-full rounded-sm border border-border bg-card/30 p-4 select-text scrollbar-thin overflow-y-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
