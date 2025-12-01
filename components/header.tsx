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
} from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const { isSignedIn, isLoaded } = useUser()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const moreItems = [
    {
      name: "Blog",
      description: "The latest from our team and product innovations",
      href: "#",
    },
    {
      name: "Issues",
      description: "Report bugs and request new features",
      href: "#",
    },
    {
      name: "News",
      description: "Stay updated with financial news and insights",
      href: "/app/news",
    },
    {
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
        <div className="hidden md:flex items-center gap-6 px-4 h-[56px] bg-card/70 backdrop-blur-glass border border-border-glass rounded-sm">
          <Link href={!isSignedIn ? "/" : "/app"}>
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">Z</span>
              </div>
              <span className="text-xl font-bold gradient-text">Zecant</span>
            </div>
          </Link>

          <div className="h-6 w-px bg-border-divider" />

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
                <span className={isMoreOpen ? "text-primary" : ""}>Resources</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                    isMoreOpen ? 'rotate-180 text-primary' : ''
                  }`} 
                />
              </button>
              
              <div
                ref={dropdownRef}
                className={`absolute top-full left-0 w-80 bg-card/95 backdrop-blur-glass border border-border-glass rounded-sm shadow-2xl z-50 transition-all duration-300 ease-in-out ${
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
                        className="flex items-center space-x-3 p-3 rounded-sm hover:bg-muted/95 hover:inner-light-subtle transition-all duration-200 group/item"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground transition-colors duration-200">
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Z</span>
            </div>
            <span className="text-xl font-bold gradient-text">Zecant</span>
          </div>
        </Link>

        {/* Right Box: User Buttons */}
        <div className="hidden md:flex items-center px-2 h-[56px] bg-card/70 backdrop-blur-glass border border-border-glass rounded-sm">
          {!isLoaded ? (
            <div className="w-8 h-8 bg-muted rounded-sm animate-pulse" />
          ) : !isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/sign-up">
                <Button
                  className="text-primary-foreground font-semibold hover:inner-light-primary active:inner-light-primary transition-all duration-300 cursor-pointer"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="border-border-divider text-foreground hover:border-primary hover:text-primary hover:bg-primary/10 hover:inner-light-subtle font-semibold transition-all duration-300 bg-transparent cursor-pointer">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <CustomUserButton full={true} />
          )}
        </div>

        {/* Mobile User Button */}
        <div className="md:hidden flex items-center">
          {!isLoaded ? (
            <div className="w-8 h-8 bg-muted rounded-sm animate-pulse" />
          ) : !isSignedIn ? (
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          ) : (
            <>
              <button
                className="text-foreground hover:text-primary transition-colors ml-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border-divider">
          <div className="bg-background/70 backdrop-blur-sm -z-2 fixed w-[100%] h-[150%] -translate-y-[33%]" />
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a href="/pricing" className="block text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <div className="space-y-2 border-t border-border-divider pt-4">
              <div className="text-sm font-semibold text-muted-foreground uppercase mb-2">Resources</div>
              {moreItems.map((item, index) => (
                <Link
                key={index}
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-sm hover:bg-muted/95 hover:inner-light-subtle transition-colors group/item"
                >
                  <div>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="pt-4 space-y-2 border-t border-b border-border-divider mb-2">
              {!isLoaded ? (
                <div className="w-full h-10 bg-muted rounded-sm animate-pulse" />
              ) : !isSignedIn ? (
                <div className="flex flex-row justify-center space-x-16">
                <Link href="/sign-up">
                <Button
                  className="flex-1 mb-4 text-primary-foreground font-semibold hover:inner-light-primary active:inner-light-primary transition-all duration-300 cursor-pointer"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="flex-1 mb-4 border-border-divider text-foreground hover:border-primary hover:text-primary hover:bg-primary/10 hover:inner-light-subtle font-semibold transition-all duration-300 bg-transparent cursor-pointer">
                  Sign In
                </Button>
              </Link>
                </div>
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
