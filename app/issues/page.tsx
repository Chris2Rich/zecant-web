"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Upload, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

interface BugReport {
  title: string
  description: string
  screenshots: File[]
  videos: File[]
}

export default function IssuesPage() {
  const [formData, setFormData] = useState<BugReport>({
    title: "",
    description: "",
    screenshots: [],
    videos: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleInputChange = (field: keyof BugReport, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (field: 'screenshots' | 'videos', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...fileArray]
      }))
    }
  }

  const removeFile = (field: 'screenshots' | 'videos', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Reset form
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
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        message: 'Failed to submit bug report. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  Report a <span className="text-primary">Bug</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                  Help us improve Zecant by reporting any issues you encounter. Your feedback is invaluable.
                </p>
              </div>

              {submitMessage && (
                <Alert className={`mb-6 ${submitMessage.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className={submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {submitMessage.message}
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Bug Report Details</CardTitle>
                  <CardDescription>
                    Please provide as much detail as possible to help us reproduce and fix the issue.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Brief description of the issue"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Please describe the issue in detail. Include steps to reproduce, expected behavior, and actual behavior."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    {/* Screenshots */}
                    <div className="space-y-2">
                      <Label htmlFor="screenshots">Screenshots</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input
                          id="screenshots"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileChange('screenshots', e.target.files)}
                          className="hidden"
                        />
                        <label htmlFor="screenshots" className="cursor-pointer">
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload screenshots or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, GIF up to 10MB each
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Display selected screenshots */}
                      {formData.screenshots.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Selected screenshots:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.screenshots.map((file, index) => (
                              <div key={index} className="flex items-center bg-muted rounded-lg px-3 py-1">
                                <span className="text-sm text-muted-foreground mr-2">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('screenshots', index)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Videos */}
                    <div className="space-y-2">
                      <Label htmlFor="videos">Videos</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input
                          id="videos"
                          type="file"
                          accept="video/*"
                          multiple
                          onChange={(e) => handleFileChange('videos', e.target.files)}
                          className="hidden"
                        />
                        <label htmlFor="videos" className="cursor-pointer">
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload videos or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              MP4, MOV, AVI up to 100MB each
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Display selected videos */}
                      {formData.videos.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Selected videos:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.videos.map((file, index) => (
                              <div key={index} className="flex items-center bg-muted rounded-lg px-3 py-1">
                                <span className="text-sm text-muted-foreground mr-2">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('videos', index)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                        className="px-8"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
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