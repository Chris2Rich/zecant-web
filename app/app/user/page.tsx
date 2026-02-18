"use client"

import { useUser } from "@clerk/nextjs"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Loader2, Save } from "lucide-react"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useState(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setUsername(user.username || "")
    }
  })

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: "error", text: "File size must be less than 5MB" })
      e.target.value = ""
      return
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setMessage({ type: "error", text: "Only JPG, PNG, GIF, or WebP images are allowed" })
      e.target.value = ""
      return
    }

    setIsUploading(true)
    setMessage(null)

    try {
      await user.setProfileImage({ file })
      setMessage({ type: "success", text: "Profile picture updated successfully!" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.errors?.[0]?.message || "Failed to upload image" })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      await user.update({
        firstName,
        lastName,
        username: username || undefined,
      })
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.errors?.[0]?.message || "Failed to update profile" })
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = () => {
    const name = user.fullName || user.username || user.emailAddresses[0]?.emailAddress || "User"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and profile picture.</p>
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

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">Profile Picture</Label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                className="w-24 h-24 rounded-sm overflow-hidden bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group hover:cursor-pointer"
                disabled={isUploading}
              >
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary-foreground font-bold text-2xl">{getInitials()}</span>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Click on the avatar to upload a new picture.</p>
              <p className="mt-1">JPG, PNG or GIF. Max size 5MB.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            value={user.emailAddresses[0]?.emailAddress || ""}
            disabled
            className="bg-muted/50"
          />
          <p className="text-xs text-muted-foreground">Email address cannot be changed here.</p>
        </div>

        <div className="pt-4">
          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
