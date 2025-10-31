'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaShoppingCart, FaGamepad, FaCreditCard, FaUsers, FaCalendar, FaStar, FaFire, FaRocket } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface MiniApp {
  id: string
  name: string
  description: string
  icon: string
  category: 'shopping' | 'games' | 'payments' | 'utilities'
  rating: number
  downloads: number
  featured?: boolean
}

interface Community {
  id: string
  name: string
  description: string
  avatar: string
  members: number
  category: string
  featured?: boolean
}

interface TrendingItem {
  id: string
  type: 'creator' | 'hashtag' | 'challenge'
  name: string
  avatar?: string
  posts: number
  growth: number
}

export default function ExploreHub() {
  const [activeTab, setActiveTab] = useState<'discover' | 'communities' | 'trending'>('discover')
  const [miniApps, setMiniApps] = useState<MiniApp[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockMiniApps: MiniApp[] = [
      {
        id: '1',
        name: 'ShopHub',
        description: 'Social commerce platform',
        icon: '🛍️',
        category: 'shopping',
        rating: 4.8,
        downloads: 1250000,
        featured: true
      },
      {
        id: '2',
        name: 'GameZone',
        description: 'Mini-games and entertainment',
        icon: '🎮',
        category: 'games',
        rating: 4.6,
        downloads: 890000,
        featured: true
      },
      {
        id: '3',
        name: 'PayFlow',
        description: 'Seamless payments and transfers',
        icon: '💳',
        category: 'payments',
        rating: 4.9,
        downloads: 2100000
      },
      {
        id: '4',
        name: 'TaskMaster',
        description: 'Productivity and task management',
        icon: '📋',
        category: 'utilities',
        rating: 4.4,
        downloads: 450000
      }
    ]

    const mockCommunities: Community[] = [
      {
        id: '1',
        name: 'Tech Innovators',
        description: 'Discussing the latest in technology and innovation',
        avatar: '/api/placeholder/100/100',
        members: 125000,
        category: 'Technology',
        featured: true
      },
      {
        id: '2',
        name: 'Creative Minds',
        description: 'Artists, designers, and creative professionals',
        avatar: '/api/placeholder/100/100',
        members: 89000,
        category: 'Creative',
        featured: true
      },
      {
        id: '3',
        name: 'Fitness & Wellness',
        description: 'Health, fitness, and wellness community',
        avatar: '/api/placeholder/100/100',
        members: 156000,
        category: 'Health'
      }
    ]

    const mockTrending: TrendingItem[] = [
      {
        id: '1',
        type: 'creator',
        name: 'AlexCreates',
        avatar: '/api/placeholder/100/100',
        posts: 1250,
        growth: 45
      },
      {
        id: '2',
        type: 'hashtag',
        name: '#AIArt',
        posts: 89000,
        growth: 120
      },
      {
        id: '3',
        type: 'challenge',
        name: 'DanceChallenge2024',
        posts: 67000,
        growth: 89
      }
    ]

    setMiniApps(mockMiniApps)
    setCommunities(mockCommunities)
    setTrendingItems(mockTrending)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shopping': return <FaShoppingCart className="h-5 w-5" />
      case 'games': return <FaGamepad className="h-5 w-5" />
      case 'payments': return <FaCreditCard className="h-5 w-5" />
      default: return <FaRocket className="h-5 w-5" />
    }
  }

  const renderDiscover = () => (
    <div className="space-y-6">
      {/* Featured Mini Apps */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FaStar className="h-5 w-5 text-yellow-500 mr-2" />
          Featured Apps
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {miniApps.filter(app => app.featured).map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{app.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{app.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{app.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-500">★ {app.rating}</span>
                <span className="text-gray-500">{(app.downloads / 1000000).toFixed(1)}M downloads</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Mini Apps */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Apps</h3>
        <div className="space-y-3">
          {miniApps.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{app.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{app.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{app.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(app.category)}
                  <span className="text-sm text-gray-500">{app.rating}★</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCommunities = () => (
    <div className="space-y-6">
      {/* Featured Communities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FaFire className="h-5 w-5 text-orange-500 mr-2" />
          Featured Communities
        </h3>
        <div className="space-y-3">
          {communities.filter(community => community.featured).map((community) => (
            <motion.div
              key={community.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <Image
                  src={community.avatar}
                  alt={community.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{community.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{community.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-500">{community.category}</span>
                    <span className="text-gray-500">{(community.members / 1000).toFixed(0)}K members</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Communities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Communities</h3>
        <div className="space-y-3">
          {communities.map((community) => (
            <motion.div
              key={community.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <Image
                  src={community.avatar}
                  alt={community.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{community.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{community.description}</p>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-blue-500">{community.category}</span>
                    <span className="text-gray-500">{(community.members / 1000).toFixed(0)}K members</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTrending = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FaRocket className="h-5 w-5 text-purple-500 mr-2" />
          Trending Now
        </h3>
        <div className="space-y-3">
          {trendingItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                {item.avatar && (
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                {!item.avatar && (
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {item.type === 'hashtag' ? '#' : item.type === 'challenge' ? '🏆' : '👤'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{(item.posts / 1000).toFixed(0)}K posts</span>
                    <span className="text-green-500">+{item.growth}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Explore</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex">
          {[
            { id: 'discover', label: 'Discover' },
            { id: 'communities', label: 'Communities' },
            { id: 'trending', label: 'Trending' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'discover' && renderDiscover()}
            {activeTab === 'communities' && renderCommunities()}
            {activeTab === 'trending' && renderTrending()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}