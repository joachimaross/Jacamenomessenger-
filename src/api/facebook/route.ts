import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore
import * as FB from 'fb'

FB.options({
  appId: process.env.FACEBOOK_APP_ID!,
  appSecret: process.env.FACEBOOK_APP_SECRET!,
  accessToken: process.env.FACEBOOK_ACCESS_TOKEN!,
})

export async function GET(request: NextRequest) {
  try {
    if (process.env.ENABLE_FACEBOOK_API !== 'true') {
      return NextResponse.json({ error: 'Facebook API disabled' }, { status: 503 })
    }
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'feed':
        const feed = await new Promise((resolve, reject) => {
          FB.api('/me/feed', 'get', { limit: 10 }, (res: any) => {
            if (!res || res.error) reject(res.error)
            else resolve(res)
          })
        })
        return NextResponse.json({ success: true, data: feed })

      case 'posts':
        const posts = await new Promise((resolve, reject) => {
          FB.api('/me/posts', 'get', { limit: 10 }, (res: any) => {
            if (!res || res.error) reject(res.error)
            else resolve(res)
          })
        })
        return NextResponse.json({ success: true, data: posts })

      case 'user':
        const user = await new Promise((resolve, reject) => {
          FB.api('/me', 'get', { fields: 'id,name,email,picture' }, (res: any) => {
            if (!res || res.error) reject(res.error)
            else resolve(res)
          })
        })
        return NextResponse.json({ success: true, data: user })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Facebook API error:', error)
    return NextResponse.json({ error: 'Failed to fetch Facebook data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.ENABLE_FACEBOOK_API !== 'true') {
      return NextResponse.json({ error: 'Facebook API disabled' }, { status: 503 })
    }
    const { message, link } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const post = await new Promise((resolve, reject) => {
      const params: any = { message }
      if (link) params.link = link

      FB.api('/me/feed', 'post', params, (res: any) => {
        if (!res || res.error) reject(res.error)
        else resolve(res)
      })
    })

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('Facebook API error:', error)
    return NextResponse.json({ error: 'Failed to post to Facebook' }, { status: 500 })
  }
}
