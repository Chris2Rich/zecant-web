"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2, AlertTriangle, ShieldAlert } from "lucide-react"

export default function DeleteAccountPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const expectedConfirmation = "DELETE MY ACCOUNT"
  const canDelete = confirmationText === expectedConfirmation

  const handleDeleteAccount = async () => {
    if (!canDelete) {
      setMessage({ type: "error", text: "Please type the confirmation text exactly" })
      return
    }

    setIsDeleting(true)
    setMessage(null)

    try {
      await user.delete()
      await signOut()
      router.push("/")
    } catch (error: any) {
      setMessage({ type: "error", text: error.errors?.[0]?.message || "Failed to delete account" })
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 h-full overflow-y-auto scrollbar-thin">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Delete Account</h1>
        <p className="text-muted-foreground mt-1">Permanently delete your account and all associated data.</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-sm border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="p-6 rounded-sm border border-destructive/30 bg-destructive/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-sm bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Warning: This action cannot be undone</h2>
            <p className="text-sm text-muted-foreground">Please read carefully before proceeding</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Deleting your account will permanently remove:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Your profile information and settings</li>
            <li>All chat history and conversations</li>
            <li>Any saved strategies or portfolio data</li>
            <li>All associated data from our systems</li>
          </ul>
          <p className="text-destructive font-medium mt-4">
            This action is permanent and cannot be reversed.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-sm border border-border-divider bg-card/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Confirm Deletion</h2>
            <p className="text-sm text-muted-foreground">Type the following to confirm: <span className="font-mono font-bold text-foreground">{expectedConfirmation}</span></p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">Type "{expectedConfirmation}" to confirm</Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={expectedConfirmation}
              className={`${confirmationText && !canDelete ? "border-destructive" : ""}`}
            />
          </div>

          <div className="pt-4">
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!canDelete || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete My Account
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-sm border border-border-divider bg-card/30">
        <p className="text-sm text-muted-foreground">
          <strong>Need help?</strong> If you're having issues with your account, consider visiting the{" "}
          <span className="text-primary">Settings</span> page or contacting support before deleting your account.
        </p>
      </div>
    </div>
  )
}
