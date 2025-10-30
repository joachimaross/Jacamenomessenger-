import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

// Configure web push
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, body, icon, badge, data } = await request.json()

    if (!subscription || !title || !body) {
      return NextResponse.json({
        error: 'Subscription, title, and body are required'
      }, { status: 400 })
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icon-192x192.png',
      badge: badge || '/badge-72x72.png',
      data: data || {},
      timestamp: Date.now()
    })

    await webpush.sendNotification(subscription, payload)

    return NextResponse.json({ success: true, message: 'Notification sent' })
  } catch (error) {
    console.error('Push notification error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return mock notifications for demo
    const mockNotifications = [
      {
        id: '1',
        title: 'New Message',
        body: 'You have a new message from Twitter',
        platform: 'twitter',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: 'SMS Received',
        body: 'New SMS from +1234567890',
        platform: 'sms',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false
      },
      {
        id: '3',
        title: 'Email Alert',
        body: 'New email from support@jacameno.com',
        platform: 'email',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        read: true
      }
    ]

    return NextResponse.json({ success: true, data: mockNotifications })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}