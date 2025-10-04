"use client"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HeroButtons(){
    const {isSignedIn} = useUser()
    return <>
    {!isSignedIn ? (
        <>
        <Link href="/sign-up">
        <Button
          size="lg"
          className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-4 glow-primary-intense hover:transition-all duration-300 hover:scale-105 cursor-pointer"
          >
          Start Building
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
        </Link>
        <Button
          size="lg"
          variant="outline"
          className="group border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/10 font-semibold text-lg px-8 py-4 hover:glow-primary transition-all duration-300 hover:scale-105 bg-transparent cursor-pointer"
        >
          View Demo
          <Play className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
        </>
      ) : (
        <>
        <Link href="/app">
        <Button
          size="lg"
          className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-4 glow-primary-intense hover:transition-all duration-300 hover:scale-105 cursor-pointer"
          >
          Get Back To Building
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
        </Link>
        </>
      )}
      </>
  }