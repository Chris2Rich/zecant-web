"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs'
import { CustomUserButton } from '@/components/custom-user-button'
import Link from "next/link"
import {
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  BarChart3,
  Brain,
  FileText,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, isLoaded } = useUser()

  const solutionsDropdown = [
    {
      category: "BY STRATEGY TYPE",
      items: [
        { icon: TrendingUp, name: "Momentum Trading", description: "Trend-following algorithms" },
        { icon: BarChart3, name: "Mean Reversion", description: "Statistical arbitrage strategies" },
        { icon: Brain, name: "ML Strategies", description: "Machine learning models" },
      ],
    },
    {
      category: "BY ASSET CLASS",
      items: [
        { icon: TrendingUp, name: "Equities", description: "Stock trading strategies" },
        { icon: BarChart3, name: "Options", description: "Derivatives and volatility" },
        { icon: Brain, name: "Crypto", description: "Digital asset strategies" },
      ],
    },
  ]

  const resourcesDropdown = [
    {
      category: "LEARN",
      items: [
        { icon: BookOpen, name: "Documentation", description: "API guides and tutorials" },
        { icon: FileText, name: "Strategy Library", description: "Pre-built trading strategies" },
        { icon: BarChart3, name: "Backtesting Guide", description: "Historical performance testing" },
      ],
    },
    {
      category: "DATA SOURCES",
      items: [
        { icon: TrendingUp, name: "Market Data", description: "Real-time price feeds" },
        { icon: FileText, name: "SEC Filings", description: "Corporate disclosures" },
        { icon: Brain, name: "News Sentiment", description: "AI-powered news analysis" },
      ],
    },
  ]

  const supportDropdown = [
    {
      category: "GET HELP",
      items: [
        { icon: MessageCircle, name: "Live Chat", description: "24/7 technical support" },
        { icon: Phone, name: "Phone Support", description: "Speak with our experts" },
        { icon: Mail, name: "Email Support", description: "Get detailed assistance" },
      ],
    },
  ]

  const DropdownMenu = ({ items, className = "" }: { items: any[]; className?: string }) => (
    <div
      className={`absolute top-full left-0 mt-2 w-96 bg-card/95 backdrop-blur-lg border border-border rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 ${className}`}
    >
      <div className="p-6">
        {items.map((category, categoryIndex) => (
          <div key={categoryIndex} className={categoryIndex > 0 ? "mt-6 pt-6 border-t border-border" : ""}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.items.map((item: any, itemIndex: number) => (
                <a
                  key={itemIndex}
                  href="#"
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group/item"
                >
                  <item.icon className="w-5 h-5 text-primary mt-0.5 group-hover/item:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-foreground group-hover/item:text-primary transition-colors">
                      {item.name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">{item.description}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-nav border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={!isSignedIn ? "/" : "/app"}>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Z</span>
            </div>
            <span className="text-xl font-bold gradient-text">Zecant</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <div className="relative group">
            <button className="flex items-center space-x-1 text-foreground hover:text-primary hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <span>Solutions</span>
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <DropdownMenu items={solutionsDropdown} />
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-1 text-foreground hover:text-primary hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <span>Resources</span>
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <DropdownMenu items={resourcesDropdown} />
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-1 text-foreground hover:text-primary hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <span>Support</span>
              <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <DropdownMenu items={supportDropdown} />
          </div>

          <a
            href="/pricing"
            className="text-foreground hover:text-primary hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            Pricing
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {!isLoaded ? (
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
          ) : !isSignedIn ? (
            <>
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="border-border text-foreground hover:border-primary hover:text-primary hover:glow-primary transition-all duration-300 hover:scale-105 bg-transparent cursor-pointer"
                >
                Log In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hover:glow-primary-intense transition-all duration-300 hover:scale-105 cursor-pointer">
                Sign Up
              </Button>
            </Link>
            </>
          ) : (
            <CustomUserButton full={true} />
          )}
        </div>

        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-nav border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a href="#solutions" className="block text-foreground hover:text-primary transition-colors">
              Solutions
            </a>
            <a href="#resources" className="block text-foreground hover:text-primary transition-colors">
              Resources
            </a>
            <a href="#support" className="block text-foreground hover:text-primary transition-colors">
              Support
            </a>
            <a href="#pricing" className="block text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <div className="pt-4 space-y-2">
              {!isLoaded ? (
                <div className="w-full h-10 bg-muted rounded-lg animate-pulse" />
              ) : !isSignedIn ? (
                <>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:border-primary hover:text-primary bg-transparent"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    Sign Up
                  </Button>
                </Link>
                </>
              ) : (
                <div className="flex justify-center">
                  <CustomUserButton full={false} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
