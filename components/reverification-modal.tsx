"use client"

import { useState, useEffect, useCallback } from "react"
import { useReverification } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, Eye, EyeOff, X } from "lucide-react"
import Image from "next/image"

interface RevalidationModalProps {
  children: React.ReactNode
}

export function RevalidationModal({ children }: RevalidationModalProps) {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  const updatePasswordWithReverification = useReverification(
    async (currentPwd: string | undefined, newPwd: string) => {
      if (!user) throw new Error("No user")
      if (currentPwd) {
        await user.updatePassword({
          currentPassword: currentPwd,
          newPassword: newPwd,
        })
      } else {
        await user.updatePassword({
          newPassword: newPwd,
        })
      }
    },
    {
      onNeedsReverification: ((properties: { complete: () => Promise<void>; cancel: () => void }) => {
        const { complete, cancel } = properties
        setIsOpen(true)
        setPassword("")
        setError("")
        
        window.__reverificationComplete = complete
        window.__reverificationCancel = () => {
          cancel()
          setIsOpen(false)
          setPassword("")
          setError("")
        }
      }) as (properties: unknown) => void,
    }
  )

  const handleVerify = async () => {
    if (!password) return
    
    setIsVerifying(true)
    setError("")
    try {
      if (window.__reverificationComplete) {
        await window.__reverificationComplete()
      }
      setIsOpen(false)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCancel = () => {
    if (window.__reverificationCancel) {
      window.__reverificationCancel()
    }
    setIsOpen(false)
    setPassword("")
    setError("")
  }

  return (
    <>
      {typeof window !== "undefined" && (window.__reverificationFn = updatePasswordWithReverification)}
      {children}
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />
          <div className="relative w-full max-w-md mx-4">
            <div className="bg-card/90 backdrop-blur-glass border border-border-divider rounded-sm p-8 shadow-2xl">
              <button
                onClick={handleCancel}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="rounded-sm flex items-center justify-center mx-auto mb-4 select-none">
                  <Image 
                    src="/Icon.png" 
                    alt="Zecant Logo" 
                    width={32} 
                    height={32}
                    className="w-10 h-10"
                    priority
                  />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Verify your identity</h2>
                <p className="text-muted-foreground text-sm">
                  Please re-enter your password to continue
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xs mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="reverify-password" className="text-sm font-medium text-foreground mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reverify-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 bg-background border border-input rounded-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleVerify()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || !password}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 rounded-sm"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

declare global {
  interface Window {
    __reverificationFn?: (currentPwd: string | undefined, newPwd: string) => Promise<void>
    __reverificationComplete?: () => Promise<void>
    __reverificationCancel?: () => void
  }
}

export { }
