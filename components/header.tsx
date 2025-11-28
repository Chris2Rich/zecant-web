"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs'
import { CustomUserButton } from '@/components/custom-user-button'
import Link from "next/link"
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Newspaper,
  GitPullRequestArrow,
} from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const { isSignedIn, isLoaded } = useUser()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const moreItems = [
    {
      icon: BookOpen,
      name: "Blog",
      description: "The latest from our team and product innovations",
      href: "#",
    },
    {
      icon: AlertCircle,
      name: "Issues",
      description: "Report bugs and request new features",
      href: "#",
    },
    {
      icon: Newspaper,
      name: "News",
      description: "Stay updated with financial news and insights",
      href: "/app/news",
    },
    {
      icon: GitPullRequestArrow,
      name: "Updates",
      description: "Hotfixes, new features and more",
      href: "#",
    },
  ]

  const handleMoreEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsMoreOpen(true)
  }

  const handleMoreLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMoreOpen(false)
    }, 150) // Small delay before closing
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left Box: Logo, Pricing, More */}
        <div className="hidden md:flex items-center gap-6 px-4 h-[56px] bg-card/50 border border-border rounded-lg">
          <Link href={!isSignedIn ? "/" : "/app"}>
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">Z</span>
              </div>
              <span className="text-xl font-bold gradient-text">Zecant</span>
            </div>
          </Link>

          <div className="h-6 w-px bg-border" />

          <nav className="flex items-center gap-6">
            <a
              href="/pricing"
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Pricing
            </a>
            
            <div 
              className="relative group"
              onMouseEnter={handleMoreEnter}
              onMouseLeave={handleMoreLeave}
            >
              <button 
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <span>More</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                    isMoreOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <div
                ref={dropdownRef}
                className={`absolute top-full left-0 w-80 bg-card/95 border border-border rounded-lg shadow-2xl z-50 transition-all duration-300 ease-in-out ${
                  isMoreOpen 
                    ? 'opacity-100 visible translate-y-0 mt-2' 
                    : 'opacity-0 invisible -translate-y-2 mt-4 pointer-events-none'
                }`}
              >
                <div className="p-4">
                  <div className="space-y-2">
                    {moreItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group/item"
                      >
                        <item.icon className="w-5 h-5 text-primary mt-0.5 group-hover/item:scale-110 transition-transform duration-200 shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-foreground group-hover/item:text-primary transition-colors duration-200">
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5">{item.description}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-1 transition-all duration-200 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Logo */}
        <Link href={!isSignedIn ? "/" : "/app"} className="md:hidden">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Z</span>
            </div>
            <span className="text-xl font-bold gradient-text">Zecant</span>
          </div>
        </Link>

        {/* Right Box: User Buttons */}
        <div className="hidden md:flex items-center px-4 h-[56px] bg-card/50 border border-border rounded-lg">
          {!isLoaded ? (
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
          ) : !isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-border bg-transparent text-foreground hover:bg-card hover:border-primary/50 transition-all cursor-pointer"
                >
                  Contact Sales
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="bg-background border border-border text-foreground hover:bg-muted transition-all cursor-pointer flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            </div>
          ) : (
            <CustomUserButton full={true} />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground hover:text-primary transition-colors ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="bg-background/95 backdrop-blur-nav -z-2 fixed w-[100%] h-[100%] -translate-y-[49%]" />
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a href="/pricing" className="block text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <div className="space-y-2 border-t border-border pt-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase mb-2">More</div>
              {moreItems.map((item, index) => (
                <Link
                key={index}
                href={item.href}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="pt-4 space-y-2 border-t border-border">
              {!isLoaded ? (
                <div className="w-full h-10 bg-muted rounded-lg animate-pulse" />
              ) : !isSignedIn ? (
                <>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:border-primary hover:text-primary bg-transparent"
                    >
                    Contact Sales
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button className="w-full bg-background border border-border text-foreground hover:bg-muted flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                </>
              ) : (
                <div className="flex justify-center">
                  <CustomUserButton full={true} />
                </div>
              )}
            </div>
          </div>
      </div>
      )}
    </header>
  )
}
