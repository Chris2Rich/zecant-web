"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Upload, X, Loader2, ImageIcon, Video } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 5000
const MIN_TITLE_LENGTH = 10
const MIN_DESCRIPTION_LENGTH = 50

const MAX_SCREENSHOTS = 5
const MAX_VIDEOS = 2
const MAX_TOTAL_SIZE = 4 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"]

const RATE_LIMIT_SECONDS = 60

interface FileWithPreview {
  file: File
  preview?: string
}

interface BugReport {
  title: string
  description: string
  screenshots: FileWithPreview[]
  videos: FileWithPreview[]
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function IssuesPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const [formData, setFormData] = useState<BugReport>({
    title: "",
    description: "",
    screenshots: [],
    videos: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/issues")
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCountdown(rateLimitCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [rateLimitCountdown])

  const handleInputChange = (field: keyof BugReport, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setValidationErrors([])
  }

  const handleFileChange = async (field: 'screenshots' | 'videos', files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const currentCount = formData[field].length
    const maxCount = field === 'screenshots' ? MAX_SCREENSHOTS : MAX_VIDEOS
    const allowedTypes = field === 'screenshots' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES
    const typeName = field === 'screenshots' ? 'image' : 'video'

    const totalSize = formData.screenshots.reduce((sum, f) => sum + f.file.size, 0) +
                      formData.videos.reduce((sum, f) => sum + f.file.size, 0)

    const errors: string[] = []
    const validFiles: FileWithPreview[] = []

    for (const file of fileArray) {
      if (currentCount + validFiles.length >= maxCount) {
        errors.push(`Maximum ${maxCount} ${typeName}(s) allowed`)
        break
      }

      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid ${typeName} type`)
        continue
      }

      if (totalSize + validFiles.reduce((sum, f) => sum + f.file.size, 0) + file.size > MAX_TOTAL_SIZE) {
        errors.push(`${file.name}: Exceeds overall 4.0MB limit`)
        continue
      }

      let preview: string | undefined
      if (field === 'screenshots') {
        preview = URL.createObjectURL(file)
      }

      validFiles.push({ file, preview })
    }

    if (errors.length > 0) {
      setValidationErrors(errors)
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...validFiles]
      }))
    }
  }

  const removeFile = (field: 'screenshots' | 'videos', index: number) => {
    setFormData(prev => {
      const newFiles = [...prev[field]]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return { ...prev, [field]: newFiles }
    })
  }

  const validateForm = (): string[] => {
    const errors: string[] = []

    if (formData.title.trim().length < MIN_TITLE_LENGTH) {
      errors.push(`Title must be at least ${MIN_TITLE_LENGTH} characters`)
    }
    if (formData.title.length > MAX_TITLE_LENGTH) {
      errors.push(`Title must be less than ${MAX_TITLE_LENGTH} characters`)
    }
    if (formData.description.trim().length < MIN_DESCRIPTION_LENGTH) {
      errors.push(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`)
    }
    if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`)
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm()
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    if (rateLimitCountdown > 0) {
      setValidationErrors([`Please wait ${rateLimitCountdown} seconds before submitting again`])
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)
    setValidationErrors([])

    try {
      const submitFormData = new FormData()
      submitFormData.append("title", formData.title.trim())
      submitFormData.append("description", formData.description.trim())

      formData.screenshots.forEach((item) => {
        submitFormData.append("screenshots", item.file)
      })
      formData.videos.forEach((item) => {
        submitFormData.append("videos", item.file)
      })

      const response = await fetch("/api/issues", {
        method: "POST",
        body: submitFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setValidationErrors(data.errors.map((e: any) => e.message))
        } else {
          throw new Error(data.error || "Failed to submit bug report")
        }
        return
      }

      formData.screenshots.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview)
      })

      setFormData({
        title: "",
        description: "",
        screenshots: [],
        videos: []
      })

      setSubmitMessage({
        type: 'success',
        message: 'Bug report submitted successfully! Thank you for helping us improve Zecant.'
      })
      setRateLimitCountdown(RATE_LIMIT_SECONDS)

    } catch (error: any) {
      setSubmitMessage({
        type: 'error',
        message: error.message || 'Failed to submit bug report. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-4">Report a Bug</h1>
                <p className="text-lg text-muted-foreground">
                  Help us improve Zecant by reporting any issues you encounter. Your feedback is invaluable.
                </p>
              </div>

              {submitMessage && (
                <Alert className={`mb-6 ${submitMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {submitMessage.message}
                  </AlertDescription>
                </Alert>
              )}

              {validationErrors.length > 0 && (
                <Alert className="mb-6 bg-destructive/10 border-destructive/20 text-destructive">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Bug Report Details</CardTitle>
                  <CardDescription>
                    Please provide as much detail as possible to help us reproduce and fix the issue.
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">
                    Submitting as: <span className="font-medium text-foreground">{user?.emailAddresses[0]?.emailAddress}</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="title">Title *</Label>
                        <span className={`text-xs ${formData.title.length > MAX_TITLE_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {formData.title.length}/{MAX_TITLE_LENGTH}
                        </span>
                      </div>
                      <Input
                        id="title"
                        placeholder="Brief description of the issue"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        maxLength={MAX_TITLE_LENGTH + 1}
                      />
                      <p className="text-xs text-muted-foreground">Minimum {MIN_TITLE_LENGTH} characters</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="description">Description *</Label>
                        <span className={`text-xs ${formData.description.length > MAX_DESCRIPTION_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
                        </span>
                      </div>
                      <Textarea
                        id="description"
                        placeholder="Please describe the issue in detail. Include steps to reproduce, expected behavior, and actual behavior."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={6}
                        maxLength={MAX_DESCRIPTION_LENGTH + 1}
                      />
                      <p className="text-xs text-muted-foreground">Minimum {MIN_DESCRIPTION_LENGTH} characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="screenshots">Screenshots (optional, max {MAX_SCREENSHOTS})</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input
                          id="screenshots"
                          type="file"
                          accept={ALLOWED_IMAGE_TYPES.join(",")}
                          multiple
                          onChange={(e) => handleFileChange('screenshots', e.target.files)}
                          className="hidden"
                          disabled={formData.screenshots.length >= MAX_SCREENSHOTS}
                        />
                        <label 
                          htmlFor="screenshots" 
                          className={`cursor-pointer ${formData.screenshots.length >= MAX_SCREENSHOTS ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload screenshots
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Overall limit is 4.0MB
                            </p>
                          </div>
                        </label>
                      </div>

                      {formData.screenshots.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Selected screenshots ({formData.screenshots.length}/{MAX_SCREENSHOTS}):</p>
                          <div className="flex flex-wrap gap-3">
                            {formData.screenshots.map((item, index) => (
                              <div key={index} className="relative group">
                                {item.preview ? (
                                  <img
                                    src={item.preview}
                                    alt={item.file.name}
                                    className="w-20 h-20 object-cover rounded-lg border border-border"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center border border-border">
                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeFile('screenshots', index)}
                                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <p className="text-xs text-muted-foreground text-center mt-1 truncate w-20">
                                  {formatFileSize(item.file.size)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videos">Videos (optional, max {MAX_VIDEOS})</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input
                          id="videos"
                          type="file"
                          accept={ALLOWED_VIDEO_TYPES.join(",")}
                          multiple
                          onChange={(e) => handleFileChange('videos', e.target.files)}
                          className="hidden"
                          disabled={formData.videos.length >= MAX_VIDEOS}
                        />
                        <label 
                          htmlFor="videos"
                          className={`cursor-pointer ${formData.videos.length >= MAX_VIDEOS ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="text-center">
                            <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload videos
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Overall limit is 4.0MB
                            </p>
                          </div>
                        </label>
                      </div>

                      {formData.videos.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Selected videos ({formData.videos.length}/{MAX_VIDEOS}):</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.videos.map((item, index) => (
                              <div key={index} className="flex items-center bg-muted rounded-lg px-3 py-2 group">
                                <Video className="w-4 h-4 text-muted-foreground mr-2" />
                                <span className="text-sm text-foreground mr-2 max-w-32 truncate">{item.file.name}</span>
                                <span className="text-xs text-muted-foreground mr-2">({formatFileSize(item.file.size)})</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('videos', index)}
                                  className="text-muted-foreground hover:text-destructive transition-colors hover:cursor-pointer"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting || rateLimitCountdown > 0}
                        className="px-8"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : rateLimitCountdown > 0 ? (
                          `Wait ${rateLimitCountdown}s`
                        ) : (
                          'Submit Bug Report'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  Having trouble? Contact our support team at{' '}
                  <a href="mailto:support@zecant.com" className="text-primary hover:underline">
                    support@zecant.com
                  </a>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  )
}
