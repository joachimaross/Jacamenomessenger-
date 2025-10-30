'use client'

import { useState, useEffect } from 'react'
import { FaTwitter, FaFacebook, FaInstagram, FaDiscord, FaTelegram, FaGlobe } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface FeedItem {
  id: string
  platform: string
  author: string
  content: string
  timestamp: Date
  likes: number
  comments: number
  shares: number
  media?: {
    type: 'image' | 'video'
    url: string
  }
  url: string
}

const platforms = [
  { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'text-blue-400' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  { id: 'discord', name: 'Discord', icon: FaDiscord, color: 'text-indigo-500' },
  { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: 'text-blue-500' },
]

export default function SocialFeedAggregator() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [activePlatforms, setActivePlatforms] = useState<string[]>(['twitter', 'facebook', 'instagram'])
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')

  useEffect(() => {
    // Mock data - in real app, fetch from APIs
    const mockFeed: FeedItem[] = [
      {
        id: '1',
        platform: 'twitter',
        author: 'elonmusk',
        content: 'Mars colony construction begins next year. Who wants to move to Mars? 🚀',
        timestamp: new Date(Date.now() - 3600000),
        likes: 125000,
        comments: 8900,
        shares: 45000,
        url: 'https://twitter.com/elonmusk/status/123'
      },
      {
        id: '2',
        platform: 'facebook',
        author: 'markzuckerberg',
        content: 'Excited to announce our new VR headset with 4K resolution and haptic feedback!',
        timestamp: new Date(Date.now() - 7200000),
        likes: 89000,
        comments: 5600,
        shares: 12000,
        media: {
          type: 'image',
          url: '/api/placeholder/400/300'
        },
        url: 'https://facebook.com/markzuckerberg/posts/456'
      },
      {
        id: '3',
        platform: 'instagram',
        author: 'natgeo',
        content: 'The aurora borealis dancing over Iceland. Nature\'s light show is absolutely breathtaking. 🌌',
        timestamp: new Date(Date.now() - 10800000),
        likes: 234000,
        comments: 1200,
        shares: 8900,
        media: {
          type: 'image',
          url: '/api/placeholder/400/400'
        },
        url: 'https://instagram.com/p/789'
      },
      {
        id: '4',
        platform: 'discord',
        author: 'GameDev Community',
        content: 'New Unity update released! Check out the improved lighting system and performance optimizations.',
        timestamp: new Date(Date.now() - 14400000),
        likes: 1200,
        comments: 89,
        shares: 45,
        url: 'https://discord.com/channels/123/456/789'
      }
    ]

    setFeedItems(mockFeed)
  }, [])

  const filteredFeed = feedItems
    .filter(item => activePlatforms.includes(item.platform))
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return b.timestamp.getTime() - a.timestamp.getTime()
      } else {
        return (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares)
      }
    })

  const togglePlatform = (platformId: string) => {
    setActivePlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Social Feed Aggregator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          See all your social media content in one unified feed
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Platform Filters */}
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => {
              const Icon = platform.icon
              const isActive = activePlatforms.includes(platform.id)
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{platform.name}</span>
                </button>
              )
            })}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'latest'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'popular'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filteredFeed.map((item, index) => {
          const platform = platforms.find(p => p.id === item.platform)
          const Icon = platform?.icon || FaGlobe

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${platform?.color} bg-gray-100 dark:bg-gray-700`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  View Original →
                </a>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Media */}
              {item.media && (
                <div className="mb-4">
                  {item.media.type === 'image' && (
                    <img
                      src={item.media.url}
                      alt="Post media"
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  )}
                  {item.media.type === 'video' && (
                    <video
                      src={item.media.url}
                      controls
                      className="w-full max-h-96 rounded-lg"
                    />
                  )}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <span>❤️</span>
                    <span>{formatNumber(item.likes)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{formatNumber(item.comments)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>🔄</span>
                    <span>{formatNumber(item.shares)}</span>
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Like
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Comment
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredFeed.length === 0 && (
        <div className="text-center py-12">
          <FaGlobe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No posts to show
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try selecting different platforms or check back later for new content.
          </p>
        </div>
      )}
    </div>
  )
}