import { NextRequest, NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'timeline':
        const timeline = await client.v2.homeTimeline({ max_results: 10 })
        return NextResponse.json({ success: true, data: timeline.data })

      case 'mentions':
        const currentUser = await client.v2.me()
        const mentions = await client.v2.userMentionTimeline(currentUser.data.id, { max_results: 10 })
        return NextResponse.json({ success: true, data: mentions.data })

      case 'user':
        const userId = searchParams.get('userId')
        if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        const userData = await client.v2.user(userId)
        return NextResponse.json({ success: true, data: userData.data })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Twitter API error:', error)
    return NextResponse.json({ error: 'Failed to fetch Twitter data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, replyToId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Tweet text is required' }, { status: 400 })
    }

    let tweet
    if (replyToId) {
      tweet = await client.v2.reply(text, replyToId)
    } else {
      tweet = await client.v2.tweet(text)
    }

    return NextResponse.json({ success: true, data: tweet.data })
  } catch (error) {
    console.error('Twitter API error:', error)
    return NextResponse.json({ error: 'Failed to post tweet' }, { status: 500 })
  }
}