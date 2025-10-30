'use client'

import { useState, useEffect } from 'react'
import { FaEye, FaHeart, FaComment, FaShare, FaUsers, FaChartLine, FaClock, FaGlobe } from 'react-icons/fa'

interface StreamStats {
  platform: string
  viewers: number
  likes: number
  comments: number
  shares: number
  followers: number
  live: boolean
}

interface ChatMessage {
  id: string
  platform: string
  username: string
  message: string
  timestamp: Date
  priority: 'normal' | 'subscriber' | 'moderator' | 'vip'
}

export default function StreamerDashboard() {
  const [stats, setStats] = useState<StreamStats[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitch', 'youtube', 'twitter'])
  const [alertSettings, setAlertSettings] = useState({
    followerAlerts: true,
    donationAlerts: true,
    raidAlerts: true,
    subscriberAlerts: true
  })

  useEffect(() => {
    // Mock data for demonstration
    const mockStats: StreamStats[] = [
      {
        platform: 'twitch',
        viewers: 15420,
        likes: 8920,
        comments: 2340,
        shares: 567,
        followers: 45600,
        live: true
      },
      {
        platform: 'youtube',
        viewers: 8920,
        likes: 12450,
        comments: 1890,
        shares: 890,
        followers: 234000,
        live: true
      },
      {
        platform: 'twitter',
        viewers: 0,
        likes: 5670,
        comments: 890,
        shares: 234,
        followers: 89000,
        live: false
      }
    ]

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        platform: 'twitch',
        username: 'StreamKing99',
        message: 'Amazing stream! Keep it up! 🚀',
        timestamp: new Date(Date.now() - 30000),
        priority: 'subscriber'
      },
      {
        id: '2',
        platform: 'youtube',
        username: 'GameMaster2024',
        message: 'Love the new setup! What camera are you using?',
        timestamp: new Date(Date.now() - 60000),
        priority: 'normal'
      },
      {
        id: '3',
        platform: 'twitch',
        username: 'VIPStreamer',
        message: 'Just donated $50! Thanks for the entertainment!',
        timestamp: new Date(Date.now() - 90000),
        priority: 'vip'
      }
    ]

    setStats(mockStats)
    setChatMessages(mockMessages)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        viewers: stat.live ? stat.viewers + Math.floor(Math.random() * 10 - 5) : stat.viewers,
        likes: stat.likes + Math.floor(Math.random() * 5),
        comments: stat.comments + Math.floor(Math.random() * 3)
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const totalStats = stats.reduce(
    (acc, stat) => ({
      viewers: acc.viewers + stat.viewers,
      likes: acc.likes + stat.likes,
      comments: acc.comments + stat.comments,
      shares: acc.shares + stat.shares,
      followers: acc.followers + stat.followers
    }),
    { viewers: 0, likes: 0, comments: 0, shares: 0, followers: 0 }
  )

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'vip': return 'text-purple-400 border-purple-400'
      case 'moderator': return 'text-green-400 border-green-400'
      case 'subscriber': return 'text-blue-400 border-blue-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Streamer Dashboard</h1>
          <p className="text-gray-400">Monitor your streams across all platforms</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FaEye className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalStats.viewers)}</p>
                <p className="text-sm text-gray-400">Total Viewers</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FaHeart className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalStats.likes)}</p>
                <p className="text-sm text-gray-400">Total Likes</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FaComment className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalStats.comments)}</p>
                <p className="text-sm text-gray-400">Total Comments</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FaShare className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalStats.shares)}</p>
                <p className="text-sm text-gray-400">Total Shares</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FaUsers className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{formatNumber(totalStats.followers)}</p>
                <p className="text-sm text-gray-400">Total Followers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Stats */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Platform Performance</h2>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.platform} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold capitalize">{stat.platform}</span>
                        {stat.live && (
                          <span className="flex items-center space-x-1 text-red-400">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <span className="text-sm">LIVE</span>
                          </span>
                        )}
                      </div>
                      <FaChartLine className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Viewers</p>
                        <p className="text-xl font-bold text-blue-400">{formatNumber(stat.viewers)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Likes</p>
                        <p className="text-xl font-bold text-red-400">{formatNumber(stat.likes)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Comments</p>
                        <p className="text-xl font-bold text-green-400">{formatNumber(stat.comments)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Shares</p>
                        <p className="text-xl font-bold text-yellow-400">{formatNumber(stat.shares)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Followers</p>
                        <p className="text-xl font-bold text-purple-400">{formatNumber(stat.followers)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Chat Monitor */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Live Chat Monitor</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`p-3 rounded-lg border ${getPriorityColor(msg.priority)}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{msg.username}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 capitalize">{msg.platform}</span>
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                Send Message to All
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                Start Poll
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                Run Giveaway
              </button>
            </div>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Alert Settings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(alertSettings).map(([key, enabled]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setAlertSettings(prev => ({
                    ...prev,
                    [key]: e.target.checked
                  }))}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
                />
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stream Health */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Stream Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">98%</div>
              <p className="text-sm text-gray-400">Stream Quality</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">45ms</div>
              <p className="text-sm text-gray-400">Latency</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">HD</div>
              <p className="text-sm text-gray-400">Resolution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}