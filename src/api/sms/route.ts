import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'messages':
        const messages = await client.messages.list({ limit: 20 })
        return NextResponse.json({
          success: true,
          data: messages.map(msg => ({
            id: msg.sid,
            from: msg.from,
            to: msg.to,
            body: msg.body,
            status: msg.status,
            dateSent: msg.dateSent,
            direction: msg.direction
          }))
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Twilio SMS error:', error)
    return NextResponse.json({ error: 'Failed to fetch SMS messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, body } = await request.json()

    if (!to || !body) {
      return NextResponse.json({ error: 'Recipient and message body are required' }, { status: 400 })
    }

    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to
    })

    return NextResponse.json({
      success: true,
      data: {
        id: message.sid,
        to: message.to,
        body: message.body,
        status: message.status,
        dateSent: message.dateSent
      }
    })
  } catch (error) {
    console.error('Twilio SMS error:', error)
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
  }
}