'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaHeart, FaComment, FaShare, FaRetweet, FaHashtag, FaFire } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface Thread {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    verified?: boolean
  }
  timestamp: Date
  likes: number
  comments: number
  shares: number
  reposts: number
  hashtags: string[]
  threadId?: string
  replies?: Thread[]
}

export default function ThreadsFeed() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockThreads: Thread[] = [
      {
        id: '1',
        content: 'Just discovered this amazing coffee shop downtown! The atmosphere is perfect for deep work sessions. ☕✨',
        author: {
          name: 'Sarah Chen',
          avatar: '/api/placeholder/100/100',
          verified: true
        },
        timestamp: new Date(Date.now() - 3600000),
        likes: 247,
        comments: 23,
        shares: 12,
        reposts: 45,
        hashtags: ['coffee', 'productivity', 'work']
      },
      {
        id: '2',
        content: 'Thread: Why AI will revolutionize creative work in the next 5 years\n\n1/5: AI tools are becoming more accessible and intuitive',
        author: {
          name: 'Alex Rodriguez',
          avatar: '/api/placeholder/100/100',
        },
        timestamp: new Date(Date.now() - 7200000),
        likes: 892,
        comments: 156,
        shares: 67,
        reposts: 234,
        hashtags: ['AI', 'creativity', 'future'],
        replies: [
          {
            id: '2-1',
            content: '2/5: Artists and creators will have more time to focus on the conceptual aspects rather than technical execution',
            author: {
              name: 'Alex Rodriguez',
              avatar: '/api/placeholder/100/100',
            },
            timestamp: new Date(Date.now() - 7100000),
            likes: 145,
            comments: 23,
            shares: 8,
            reposts: 34,
            hashtags: ['AI', 'art']
          }
        ]
      },
      {
        id: '3',
        content: 'Weekend vibes: Reading, coding, and enjoying the simple things in life 📚💻',
        author: {
          name: 'Mia Johnson',
          avatar: '/api/placeholder/100/100',
          verified: true
        },
        timestamp: new Date(Date.now() - 10800000),
        likes: 456,
        comments: 34,
        shares: 23,
        reposts: 89,
        hashtags: ['weekend', 'reading', 'coding']
      }
    ]

    const mockTrending = [
      '#AI',
      '#WeekendVibes',
      '#CoffeeLovers',
      '#TechTrends',
      '#CreativeCoding',
      '#FutureOfWork'
    ]

    setThreads(mockThreads)
    setTrendingTopics(mockTrending)
  }, [])

  const handleLike = (threadId: string) => {
    setThreads(prev => prev.map(thread =>
      thread.id === threadId
        ? { ...thread, likes: thread.likes + 1 }
        : thread
    ))
  }

  const handleRepost = (threadId: string) => {
    setThreads(prev => prev.map(thread =>
      thread.id === threadId
        ? { ...thread, reposts: thread.reposts + 1 }
        : thread
    ))
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Threads</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Trending Topics */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <FaFire className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Threads Feed */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Main Thread */}
                <div className="flex space-x-3">
                  <Image
                    src={thread.author.avatar}
                    alt={thread.author.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {thread.author.name}
                      </span>
                      {thread.author.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {thread.timestamp.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-gray-900 dark:text-white mb-3 leading-relaxed">
                      {thread.content}
                    </p>

                    {/* Hashtags */}
                    {thread.hashtags && thread.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {thread.hashtags.map((tag) => (
                          <span key={tag} className="text-blue-500 text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Engagement Actions */}
                    <div className="flex items-center justify-between max-w-md">
                      <button
                        onClick={() => handleLike(thread.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <FaHeart className="h-4 w-4" />
                        <span className="text-sm">{thread.likes}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <FaComment className="h-4 w-4" />
                        <span className="text-sm">{thread.comments}</span>
                      </button>

                      <button
                        onClick={() => handleRepost(thread.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                      >
                        <FaRetweet className="h-4 w-4" />
                        <span className="text-sm">{thread.reposts}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 transition-colors">
                        <FaShare className="h-4 w-4" />
                        <span className="text-sm">{thread.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thread Replies */}
                {thread.replies && thread.replies.length > 0 && (
                  <div className="mt-4 ml-15 space-y-3">
                    {thread.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-3">
                        <Image
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {reply.author.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {reply.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}