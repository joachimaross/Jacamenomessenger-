'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaEdit, FaCog, FaMapMarkerAlt, FaCalendarAlt, FaLink, FaHeart, FaComment, FaShare, FaBookmark, FaTh, FaList, FaTag } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import PostCard from './PostCard'

interface User {
  id: string
  name: string
  handle: string
  avatar: string
  livePhoto?: string
  bio: string
  location?: string
  website?: string
  joinDate: Date
  followers: number
  following: number
  posts: number
  isVerified: boolean
  coverImage?: string
}

interface ZeekyInsight {
  id: string
  title: string
  content: string
  timestamp: Date
  category: 'social' | 'content' | 'activity' | 'trends'
  icon: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'tagged' | 'saved'>('posts')
  const [showLivePhoto, setShowLivePhoto] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [zeekyInsights, setZeekyInsights] = useState<ZeekyInsight[]>([])

  useEffect(() => {
    // Mock user data
    const mockUser: User = {
      id: 'current',
      name: 'Joa\'Chima Ross Jr.',
      handle: 'joachimaross',
      avatar: '/api/placeholder/150/150',
      livePhoto: '/api/placeholder/400/600',
      bio: 'Designer & Creator of Jacameno Messenger & Zeeky AI. Building the future of social communication from Chicago, IL. 🎨🚀',
      location: 'Chicago, IL',
      website: 'https://github.com/joachimaross',
      joinDate: new Date('2023-01-15'),
      followers: 1247,
      following: 892,
      posts: 156,
      isVerified: true,
      coverImage: '/api/placeholder/800/300'
    }

    // Mock Zeeky insights
    const mockInsights: ZeekyInsight[] = [
      {
        id: '1',
        title: 'Your Social Peak Hours',
        content: 'You\'re most active on social media between 7-9 PM. Your posts from this time get 40% more engagement!',
        timestamp: new Date(Date.now() - 86400000),
        category: 'activity',
        icon: '📊'
      },
      {
        id: '2',
        title: 'Content Trend Alert',
        content: 'Posts about "AI innovation" are trending in your network. You\'ve engaged with 12 similar posts this week.',
        timestamp: new Date(Date.now() - 172800000),
        category: 'trends',
        icon: '📈'
      },
      {
        id: '3',
        title: 'Connection Insights',
        content: 'Sarah Chen and Alex Rodriguez both commented on your recent design post. They might be interested in collaborating!',
        timestamp: new Date(Date.now() - 259200000),
        category: 'social',
        icon: '🤝'
      }
    ]

    setUser(mockUser)
    setZeekyInsights(mockInsights)

    // Mock posts
    const mockPosts = [
      {
        id: '1',
        type: 'image',
        content: 'Working on something exciting! The future of messaging is here. 🚀',
        author: mockUser,
        timestamp: new Date(Date.now() - 3600000),
        likes: 89,
        comments: 23,
        shares: 12,
        media: { url: '/api/placeholder/400/400' },
        platform: 'jacameno',
        tags: ['innovation', 'tech', 'messaging']
      }
    ]

    setPosts(mockPosts)
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'social': return 'from-blue-500 to-purple-500'
      case 'content': return 'from-green-500 to-teal-500'
      case 'activity': return 'from-orange-500 to-red-500'
      case 'trends': return 'from-pink-500 to-rose-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600">
        {user.coverImage && (
          <Image
            src={user.coverImage}
            alt="Cover"
            layout="fill"
            objectFit="cover"
          />
        )}

        {/* Profile Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70">
            <FaCog className="h-5 w-5" />
          </button>
          <button className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70">
            <FaEdit className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative px-4 pb-4">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <div className="relative inline-block">
            <Image
              src={user.avatar}
              alt={user.name}
              width={128}
              height={128}
              className="rounded-full border-4 border-white dark:border-gray-800 cursor-pointer"
              onClick={() => user.livePhoto && setShowLivePhoto(true)}
            />
            {user.livePhoto && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🎥</span>
              </div>
            )}
            {user.isVerified && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Name and Handle */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            {user.name}
            {user.isVerified && (
              <span className="ml-2 text-blue-500">✓</span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">@{user.handle}</p>
        </div>

        {/* Bio */}
        <p className="text-gray-900 dark:text-white mb-4 leading-relaxed">
          {user.bio}
        </p>

        {/* Location, Website, Join Date */}
        <div className="flex flex-wrap gap-4 mb-4 text-gray-500 dark:text-gray-400">
          {user.location && (
            <div className="flex items-center space-x-1">
              <FaMapMarkerAlt className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center space-x-1">
              <FaLink className="h-4 w-4" />
              <a href={user.website} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                {user.website.replace('https://', '')}
              </a>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <FaCalendarAlt className="h-4 w-4" />
            <span>Joined {user.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex space-x-6 mb-6">
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white">{formatNumber(user.posts)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white">{formatNumber(user.followers)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white">{formatNumber(user.following)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
          </div>
        </div>

        {/* Zeeky Insights */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            Zeeky AI Insights
          </h2>
          <div className="space-y-3">
            {zeekyInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg bg-gradient-to-r ${getInsightColor(insight.category)} text-white`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{insight.title}</h3>
                    <p className="text-sm opacity-90">{insight.content}</p>
                    <p className="text-xs opacity-75 mt-2">
                      {insight.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          {[
            { id: 'posts', label: 'Posts', icon: FaTh },
            { id: 'tagged', label: 'Tagged', icon: FaTag },
            { id: 'saved', label: 'Saved', icon: FaBookmark }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'posts' && posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={(id) => console.log('Like', id)}
              onComment={(id) => console.log('Comment', id)}
              onShare={(id) => console.log('Share', id)}
              onBookmark={(id) => console.log('Bookmark', id)}
              onProfileClick={(id) => console.log('Profile', id)}
            />
          ))}

          {activeTab === 'tagged' && (
            <div className="text-center py-12">
              <FaTag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No tagged posts yet</p>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="text-center py-12">
              <FaBookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No saved posts yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Live Photo Modal */}
      <AnimatePresence>
        {showLivePhoto && user.livePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
            onClick={() => setShowLivePhoto(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={user.livePhoto}
                alt="Live Photo"
                width={400}
                height={600}
                className="rounded-lg"
              />
              <button
                onClick={() => setShowLivePhoto(false)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
