"use client"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HeroButtons(){
    const {isSignedIn} = useUser()
    return <>
    {!isSignedIn ? (
        <>
        <Link href="/sign-up">
        <Button
          size="lg"
          className="group bg-primary hover:bg-primary/70 backdrop-blur-md  text-primary-foreground font-semibold text-lg px-8 py-4 glow-primary-intense hover:transition-all duration-300 cursor-pointer"
          >
          Get Started Free
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
        </Link>
        <Link href="/pricing">
        <Button
          size="lg"
          variant="outline"
          className="group border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/10 font-semibold text-lg px-8 py-4 hover:glow-primary transition-all duration-300 bg-transparent cursor-pointer"
        >
          View Plans
        </Button>
        </Link>
        </>
      ) : (
        <>
        <Link href="/app">
        <Button
          size="lg"
          className="group bg-primary hover:bg-primary/70 backdrop-blur-md  text-primary-foreground font-semibold text-lg px-8 py-4 glow-primary-intense hover:transition-all duration-300 cursor-pointer"
          >
          Get Back To Building
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
        </Link>
        </>
      )}
      </>
  }