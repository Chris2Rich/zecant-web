"use client"

import { useState, useEffect  } from "react"
import { createPortal } from "react-dom"
import { useUser, useClerk } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  UserCircle,
  Shield
} from "lucide-react"
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  flip,
  shift,
  offset,
  autoUpdate
} from '@floating-ui/react';

interface CustomUserButtonProps {
  full?: boolean
}

export function CustomUserButton({ full = false }: CustomUserButtonProps) {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // --- Floating UI Setup ---
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-end', // Start by trying to place it bottom-right
    middleware: [
      offset(8), // Add some space between the button and the dropdown
      flip(),    // Flip to the top if there's no space below
      shift(),   // Shift horizontally to stay in view
    ],
    whileElementsMounted: autoUpdate, // Keep it updated on scroll/resize
  });

  // --- Interaction Hooks ---
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);
  // --- End of Floating UI Setup ---

  if (!isLoaded || !isSignedIn || !user) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = user.fullName || user.username || user.emailAddresses[0]?.emailAddress || 'User'
  const initials = getInitials(displayName)

  return (
    // No need for a wrapping div or ref here anymore
    <>
      <Button
        ref={refs.setReference} // Set the reference element (the trigger)
        {...getReferenceProps()} // Spread the interaction props
        variant="ghost"
        className="flex items-center space-x-2 p-2 h-auto hover:bg-muted/50 transition-all duration-300 hover:scale-105"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={displayName}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <span className="text-primary-foreground font-semibold text-sm">
              {initials}
            </span>
          )}
        </div>
        {full && (
          <>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-foreground truncate max-w-24">
              {displayName}
            </div>
            <div className="text-xs text-muted-foreground">
              {user.emailAddresses[0]?.emailAddress}
            </div>
          </div>
        
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          />
          </>
      )}
      </Button>

      {isOpen && isMounted && createPortal(
        <div
          ref={refs.setFloating} // Set the floating element (the dropdown)
          style={floatingStyles} // Apply the dynamic styles
          {...getFloatingProps()} // Spread the interaction props
          className={`
            absolute w-64 bg-card/95 backdrop-blur-lg border border-border rounded-lg shadow-2xl z-50
            origin-top-right
            transition-all duration-200 ease-in-out
            ${context.isPositioned ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          {/* Your dropdown content remains exactly the same */}
          <div className="p-2">
            {/* User Info Header */}
            <div className="px-3 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={displayName}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-primary-foreground font-semibold">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {displayName}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {user.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
              </div>
            </div>

            <div className="my-2 h-px bg-border" />

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors group"
              >
                <UserCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors group"
              >
                <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors group"
              >
                <Shield className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Security</span>
              </button>

              <div className="my-2 h-px bg-border" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors group"
              >
                <LogOut className="w-4 h-4 text-destructive group-hover:scale-110 transition-transform" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  )
}