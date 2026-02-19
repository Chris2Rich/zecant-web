"use client"

import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Save, Bell, Moon, Globe } from "lucide-react"

const ALLOWED_LANGUAGES = ["en", "es", "fr", "de"] as const
type Language = typeof ALLOWED_LANGUAGES[number]

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    if (user) {
      const metadata = user.unsafeMetadata as {
        notifications?: boolean
        darkMode?: boolean
        language?: string
      }
      if (metadata.notifications !== undefined) setNotifications(metadata.notifications)
      if (metadata.darkMode !== undefined) setDarkMode(metadata.darkMode)
      const lang = metadata.language as Language | undefined
      if (lang && ALLOWED_LANGUAGES.includes(lang as Language)) {
        setLanguage(lang as Language)
      }
    }
  }, [user])

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

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setMessage(null)

    if (!ALLOWED_LANGUAGES.includes(language)) {
      setMessage({ type: "error", text: "Invalid language selected" })
      setIsSaving(false)
      return
    }

    try {
      await user.update({
        unsafeMetadata: {
          notifications,
          darkMode,
          language,
        },
      })
      setMessage({ type: "success", text: "Settings saved successfully!" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.errors?.[0]?.message || "Failed to save settings" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 overflow-y-auto scrollbar-thin">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and application settings.</p>
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
        <div className="flex items-center justify-between p-4 rounded-sm border border-border-divider bg-card/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications about your account</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              notifications ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                notifications ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-sm border border-border-divider bg-card/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
              <Moon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                darkMode ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-sm border border-border-divider bg-card/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Language</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-muted border border-border-divider rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="pt-4">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
