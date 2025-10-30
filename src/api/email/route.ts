import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  port: parseInt(process.env.EMAIL_PORT!),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
})

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock email data
    // In a real implementation, you'd integrate with IMAP/POP3 or email service APIs
    const mockEmails = [
      {
        id: '1',
        from: 'john@example.com',
        to: 'user@example.com',
        subject: 'Hello from Jacameno',
        body: 'This is a test email',
        date: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        from: 'support@jacameno.com',
        to: 'user@example.com',
        subject: 'Welcome to Jacameno Messaging',
        body: 'Welcome to the unified messaging platform!',
        date: new Date(Date.now() - 3600000).toISOString(),
        read: true
      }
    ]

    return NextResponse.json({ success: true, data: mockEmails })
  } catch (error) {
    console.error('Email fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text, html } = await request.json()

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json({
        error: 'Recipient, subject, and message content are required'
      }, { status: 400 })
    }

    const mailOptions = {
      from: process.env.EMAIL_USER!,
      to,
      subject,
      text,
      html,
    }

    const info = await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      data: {
        messageId: info.messageId,
        to,
        subject,
        date: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}