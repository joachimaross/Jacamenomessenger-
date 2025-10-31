'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaBell, FaHeart, FaComment, FaUserPlus, FaRetweet, FaAt, FaFilter, FaCheck, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'repost' | 'mention' | 'group_invite' | 'story_view'
  from: {
    id: string
    name: string
    avatar: string
  }
  content?: string
  postId?: string
  timestamp: Date
  read: boolean
  platform: string
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeFilter, setActiveFilter] = useState<'all' | 'chats' | 'stories' | 'feed' | 'threads'>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        from: {
          id: 'sarah',
          name: 'Sarah Chen',
          avatar: '/api/placeholder/100/100'
        },
        content: 'liked your post',
        postId: 'post-1',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        platform: 'instagram'
      },
      {
        id: '2',
        type: 'comment',
        from: {
          id: 'alex',
          name: 'Alex Rodriguez',
          avatar: '/api/placeholder/100/100'
        },
        content: 'Amazing work! Keep it up! 🚀',
        postId: 'post-2',
        timestamp: new Date(Date.now() - 900000),
        read: false,
        platform: 'twitter'
      },
      {
        id: '3',
        type: 'follow',
        from: {
          id: 'mia',
          name: 'Mia Johnson',
          avatar: '/api/placeholder/100/100'
        },
        content: 'started following you',
        timestamp: new Date(Date.now() - 1800000),
        read: true,
        platform: 'jacameno'
      },
      {
        id: '4',
        type: 'mention',
        from: {
          id: 'david',
          name: 'David Kim',
          avatar: '/api/placeholder/100/100'
        },
        content: 'mentioned you in a post: "Check out @joachimaross amazing work!"',
        postId: 'post-3',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        platform: 'threads'
      },
      {
        id: '5',
        type: 'group_invite',
        from: {
          id: 'group-admin',
          name: 'Tech Innovators',
          avatar: '/api/placeholder/100/100'
        },
        content: 'invited you to join the group',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        platform: 'facebook'
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <FaHeart className="h-4 w-4 text-red-500" />
      case 'comment': return <FaComment className="h-4 w-4 text-blue-500" />
      case 'follow': return <FaUserPlus className="h-4 w-4 text-green-500" />
      case 'repost': return <FaRetweet className="h-4 w-4 text-purple-500" />
      case 'mention': return <FaAt className="h-4 w-4 text-orange-500" />
      case 'group_invite': return <FaUserPlus className="h-4 w-4 text-indigo-500" />
      default: return <FaBell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'twitter': return 'bg-blue-500'
      case 'facebook': return 'bg-blue-600'
      case 'threads': return 'bg-black'
      case 'jacameno': return 'bg-gradient-to-r from-blue-500 to-purple-600'
      default: return 'bg-gray-500'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true
    // Map filter types to notification platforms/types
    switch (activeFilter) {
      case 'chats': return ['comment', 'mention'].includes(notification.type)
      case 'stories': return notification.type === 'story_view'
      case 'feed': return ['like', 'repost'].includes(notification.type)
      case 'threads': return notification.platform === 'threads'
      default: return true
    }
  })

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaBell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Mark all read
              </button>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaFilter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'chats', label: 'Chats' },
                  { id: 'stories', label: 'Stories' },
                  { id: 'feed', label: 'Feed' },
                  { id: 'threads', label: 'Threads' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <FaBell className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              When someone interacts with your content, you&apos;ll see it here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      <Image
                        src={notification.from.avatar}
                        alt={notification.from.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      {/* Notification Type Icon */}
                      <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-gray-800 rounded-full">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.from.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getPlatformColor(notification.platform)}`} />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {notification.content}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-4 mt-3">
                        {notification.type === 'follow' && (
                          <button className="px-4 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors">
                            Follow back
                          </button>
                        )}

                        {notification.type === 'group_invite' && (
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors">
                              <FaCheck className="h-3 w-3 inline mr-1" />
                              Accept
                            </button>
                            <button className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
                              <FaTimes className="h-3 w-3 inline mr-1" />
                              Decline
                            </button>
                          </div>
                        )}

                        {(notification.type === 'like' || notification.type === 'comment' || notification.type === 'mention') && (
                          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            View post
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}