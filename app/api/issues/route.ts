import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import nodemailer from "nodemailer"

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 5000
const MIN_TITLE_LENGTH = 10
const MIN_DESCRIPTION_LENGTH = 50

const MAX_SCREENSHOTS = 5
const MAX_VIDEOS = 2
const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 10 * 1024 * 1024
const MAX_TOTAL_SIZE = 25 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"]

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface ValidationError {
  field: string
  message: string
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function sanitizeString(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength)
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userEmail = user.emailAddresses[0]?.emailAddress
    const userName = user.fullName || user.username || "Unknown User"

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    const errors: ValidationError[] = []

    if (!title || title.trim().length < MIN_TITLE_LENGTH) {
      errors.push({ field: "title", message: `Title must be at least ${MIN_TITLE_LENGTH} characters` })
    }
    if (title && title.length > MAX_TITLE_LENGTH) {
      errors.push({ field: "title", message: `Title must be less than ${MAX_TITLE_LENGTH} characters` })
    }

    if (!description || description.trim().length < MIN_DESCRIPTION_LENGTH) {
      errors.push({ field: "description", message: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters` })
    }
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push({ field: "description", message: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters` })
    }

    const screenshots = formData.getAll("screenshots") as File[]
    const videos = formData.getAll("videos") as File[]

    if (screenshots.length > MAX_SCREENSHOTS) {
      errors.push({ field: "screenshots", message: `Maximum ${MAX_SCREENSHOTS} screenshots allowed` })
    }

    if (videos.length > MAX_VIDEOS) {
      errors.push({ field: "videos", message: `Maximum ${MAX_VIDEOS} videos allowed` })
    }

    let totalSize = 0
    const attachments: nodemailer.Attachment[] = []

    for (const file of screenshots) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errors.push({ field: "screenshots", message: `Invalid file type: ${file.name}. Allowed: JPEG, PNG, GIF, WebP` })
        continue
      }
      if (file.size > MAX_SCREENSHOT_SIZE) {
        errors.push({ field: "screenshots", message: `${file.name} exceeds 5MB limit` })
        continue
      }
      totalSize += file.size
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: sanitizeString(file.name, 100),
        content: buffer,
        contentType: file.type,
      })
    }

    for (const file of videos) {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        errors.push({ field: "videos", message: `Invalid file type: ${file.name}. Allowed: MP4, WebM` })
        continue
      }
      if (file.size > MAX_VIDEO_SIZE) {
        errors.push({ field: "videos", message: `${file.name} exceeds 10MB limit` })
        continue
      }
      totalSize += file.size
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: sanitizeString(file.name, 100),
        content: buffer,
        contentType: file.type,
      })
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      errors.push({ field: "attachments", message: `Total attachment size exceeds 25MB limit` })
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 })
    }

    const sanitizedTitle = sanitizeString(title, MAX_TITLE_LENGTH)
    const sanitizedDescription = sanitizeString(description, MAX_DESCRIPTION_LENGTH)

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Bug Report</h2>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #555;">User Information</h3>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>User ID:</strong> ${userId}</p>
          <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #555;">Title</h3>
          <p style="background-color: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">${sanitizedTitle}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #555;">Description</h3>
          <div style="background-color: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px; white-space: pre-wrap;">${sanitizedDescription}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #555;">Attachments</h3>
          <p>${screenshots.length} screenshot(s), ${videos.length} video(s)</p>
          ${attachments.map(a => `<p style="font-size: 12px; color: #666;">- ${a.filename}</p>`).join('')}
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">This bug report was submitted via the Zecant Issues page.</p>
      </div>
    `

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "support@zecant.com",
      subject: `[Bug Report] ${sanitizedTitle}`,
      html: emailHtml,
      attachments,
      replyTo: userEmail,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      success: true, 
      message: "Bug report submitted successfully" 
    })

  } catch (error: any) {
    console.error("Error submitting bug report:", error)
    
    if (error.code === "ECONNECTION" || error.code === "EAUTH") {
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to submit bug report" },
      { status: 500 }
    )
  }
}
