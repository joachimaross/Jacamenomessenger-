'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTwitter, FaFacebook, FaInstagram, FaDiscord,
  FaTelegram, FaWhatsapp, FaSms, FaEnvelope,
  FaSearch, FaFilter, FaCog, FaPlus
} from 'react-icons/fa'

interface Message {
  id: string
  platform: string
  from: string
  content: string
  timestamp: Date
  read: boolean
  type: 'text' | 'image' | 'video' | 'link'
}

const platforms = [
  { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'text-blue-400' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  { id: 'discord', name: 'Discord', icon: FaDiscord, color: 'text-indigo-500' },
  { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: 'text-blue-500' },
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-500' },
  { id: 'sms', name: 'SMS', icon: FaSms, color: 'text-gray-600' },
  { id: 'email', name: 'Email', icon: FaEnvelope, color: 'text-red-500' },
]

export default function UnifiedMessaging() {
  const [activePlatform, setActivePlatform] = useState('all')
  const [messages, setMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from APIs
    const mockMessages: Message[] = [
      {
        id: '1',
        platform: 'twitter',
        from: 'elonmusk',
        content: 'Mars colony update: First crew arriving in 2029 🚀',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        type: 'text'
      },
      {
        id: '2',
        platform: 'facebook',
        from: 'markzuckerberg',
        content: 'Excited about the future of the metaverse!',
        timestamp: new Date(Date.now() - 600000),
        read: true,
        type: 'text'
      },
      {
        id: '3',
        platform: 'sms',
        from: '+1234567890',
        content: 'Your package has been delivered',
        timestamp: new Date(Date.now() - 900000),
        read: false,
        type: 'text'
      },
      {
        id: '4',
        platform: 'email',
        from: 'support@jacameno.com',
        content: 'Welcome to Jacameno Messaging!',
        timestamp: new Date(Date.now() - 1200000),
        read: true,
        type: 'text'
      }
    ]
    setMessages(mockMessages)
  }, [])

  const filteredMessages = messages.filter(message => {
    const matchesPlatform = activePlatform === 'all' || message.platform === activePlatform
    const matchesSearch = message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesPlatform && matchesSearch
  })

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Jacameno Messaging
          </h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaCog className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex space-x-1 mt-4 overflow-x-auto">
          <button
            onClick={() => setActivePlatform('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activePlatform === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>All</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {platforms.map((platform) => {
            const Icon = platform.icon
            const platformUnread = messages.filter(m => m.platform === platform.id && !m.read).length
            return (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activePlatform === platform.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{platform.name}</span>
                {platformUnread > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {platformUnread}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredMessages.map((message) => {
            const platform = platforms.find(p => p.id === message.platform)
            const Icon = platform?.icon || FaEnvelope
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                  !message.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${platform?.color} bg-gray-100 dark:bg-gray-700`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {message.from}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                  {!message.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Compose Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
          <FaPlus className="h-5 w-5" />
          <span>Compose New Message</span>
        </button>
      </div>
    </div>
  )
}