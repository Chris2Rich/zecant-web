"use client"

import { useState } from 'react'
import { useSignUp, useClerk } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react'

export default function SignUpPage() {
  const { signUp, isLoaded } = useSignUp()
  const { setActive } = useClerk();
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        username,
      })

      if (result.status === 'missing_requirements') {
        setPendingVerification(true)
        signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })
      } else if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/onboarding')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/onboarding')
      }
    } catch (err: any) {
      setError("Inputted code is not valid")
    } finally {
      setIsLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        
        <div className="relative w-full max-w-md">
          <Link href="/">
            <Button
              variant="ghost"
              className="absolute -top-16 left-0 text-muted-foreground hover:text-foreground"
              >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="bg-card/70 backdrop-blur-glass border border-border-divider rounded-sm p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 backdrop-blur-glass  rounded-sm flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Verify your email</h1>
              <p className="text-muted-foreground">
                We've sent a verification code to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerification} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xs">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
                  Verification code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isLoaded}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 rounded-sm hover:inner-light-primary active:inner-light-primary transition-all duration-300"
                >
                {isLoading ? 'Verifying...' : 'Verify email'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Didn't receive the code?{' '}
                <button
                  onClick={() => signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })}
                  className="text-primary hover:text-primary/70 backdrop-blur-glass  font-medium transition-colors cursor-pointer"
                  >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link href="/">
          <Button
            variant="ghost"
            className="absolute -top-16 left-0 text-muted-foreground hover:text-foreground"
            >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Sign Up Form */}
        <div className="bg-card/70 backdrop-blur-glass border border-border-divider rounded-sm p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 backdrop-blur-glass  rounded-sm flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-muted-foreground">Join Zecant and start building winning strategies</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-background border border-input rounded-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters with letters and numbers
                </p>
              </div>
              <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" data-cl-language="en-US" />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isLoaded}
              className="w-full bg-primary hover:bg-primary/70 backdrop-blur-glass  text-primary-foreground font-semibold py-3 rounded-xs glow-primary-intense 02] transition-all duration-300"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link className="text-primary hover:text-primary/70 backdrop-blur-glass  font-medium transition-colors" href="/sign-in">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
