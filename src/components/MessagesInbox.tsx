'use client'

import { useState, useEffect } from 'react'
import { FaSearch, FaPlus, FaPaperPlane, FaMicrophone, FaImage, FaVideo, FaSmile, FaPhone, FaVideo as FaVideoCall } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import ZeekyAI from './ZeekyAI'

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar: string
    isOnline?: boolean
  }[]
  lastMessage: {
    content: string
    timestamp: Date
    senderId: string
  }
  unreadCount: number
  platform: string
}

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  type: 'text' | 'image' | 'video' | 'audio'
  reactions?: { emoji: string; count: number; users: string[] }[]
}

export default function MessagesInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showZeekyAI, setShowZeekyAI] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participants: [
          { id: '1', name: 'Sarah Chen', avatar: '/api/placeholder/100/100', isOnline: true },
          { id: 'current', name: 'You', avatar: '/api/placeholder/100/100' }
        ],
        lastMessage: {
          content: 'Hey! How was your hike yesterday?',
          timestamp: new Date(Date.now() - 3600000),
          senderId: '1'
        },
        unreadCount: 2,
        platform: 'imessage'
      },
      {
        id: '2',
        participants: [
          { id: '2', name: 'Alex Rodriguez', avatar: '/api/placeholder/100/100', isOnline: false }
        ],
        lastMessage: {
          content: 'Thanks for the coffee recommendation!',
          timestamp: new Date(Date.now() - 7200000),
          senderId: '2'
        },
        unreadCount: 0,
        platform: 'twitter'
      },
      {
        id: '3',
        participants: [
          { id: '3', name: 'Mia Johnson', avatar: '/api/placeholder/100/100', isOnline: true }
        ],
        lastMessage: {
          content: 'The new design looks amazing! 🚀',
          timestamp: new Date(Date.now() - 10800000),
          senderId: '3'
        },
        unreadCount: 1,
        platform: 'instagram'
      }
    ]

    setConversations(mockConversations)
  }, [])

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'current',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'imessage': return '💬'
      case 'twitter': return '🐦'
      case 'instagram': return '📷'
      case 'facebook': return '👥'
      case 'whatsapp': return '💚'
      default: return '💬'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'imessage': return 'bg-blue-500'
      case 'twitter': return 'bg-blue-400'
      case 'instagram': return 'bg-pink-500'
      case 'facebook': return 'bg-blue-600'
      case 'whatsapp': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
              <FaPlus className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.participants[0].avatar}
                    alt={conversation.participants[0].name}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.participants[0].isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                  <div className={`absolute -top-1 -right-1 w-5 h-5 ${getPlatformColor(conversation.platform)} rounded-full flex items-center justify-center text-white text-xs`}>
                    {getPlatformIcon(conversation.platform)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {conversation.participants[0].name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {conversation.lastMessage.content}
                  </p>

                  {conversation.unreadCount > 0 && (
                    <div className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full mt-1">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={conversations.find(c => c.id === selectedConversation)?.participants[0].avatar}
                  alt="Chat participant"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {conversations.find(c => c.id === selectedConversation)?.participants[0].name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {conversations.find(c => c.id === selectedConversation)?.participants[0].isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaPhone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaVideoCall className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.senderId === 'current'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowZeekyAI(true)}
                  className="p-2 text-purple-500 hover:text-purple-600 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <FaSmile className="h-5 w-5" />
                </button>

                <div className="flex-1 flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                  />

                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <FaImage className="h-5 w-5" />
                  </button>

                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <FaVideo className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-1 rounded-full ${
                      isRecording
                        ? 'text-red-500 animate-pulse'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <FaMicrophone className="h-5 w-5" />
                  </button>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full ${
                    newMessage.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaPaperPlane className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Zeeky AI Modal */}
      <ZeekyAI
        isOpen={showZeekyAI}
        onClose={() => setShowZeekyAI(false)}
        context="messaging"
      />
    </div>
  )
}