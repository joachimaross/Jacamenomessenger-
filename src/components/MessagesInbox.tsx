'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { FaSearch, FaPlus, FaPaperPlane, FaMicrophone, FaImage, FaVideo, FaSmile, FaPhone, FaVideo as FaVideoCall, FaPaperclip } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import ZeekyAI from './ZeekyAI'
import FileUploader from './FileUploader'

interface Conversation {
  id: string
  name?: string
  isGroup?: boolean
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
  type: 'text' | 'image' | 'video' | 'audio' | 'file'
  fileUrl?: string
  fileName?: string
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
  const [showFileUploader, setShowFileUploader] = useState(false)

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
      },
      {
        id: '4',
        name: 'Project Team',
        isGroup: true,
        participants: [
          { id: '1', name: 'Sarah Chen', avatar: '/api/placeholder/100/100', isOnline: true },
          { id: '2', name: 'Alex Rodriguez', avatar: '/api/placeholder/100/100', isOnline: false },
          { id: '3', name: 'Mia Johnson', avatar: '/api/placeholder/100/100', isOnline: true },
          { id: 'current', name: 'You', avatar: '/api/placeholder/100/100' }
        ],
        lastMessage: {
          content: 'I just pushed the latest updates to the main branch.',
          timestamp: new Date(Date.now() - 86400000),
          senderId: '2'
        },
        unreadCount: 5,
        platform: 'slack'
      },
    ]

    setConversations(mockConversations)
  }, [])

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleFileUpload = async (files: File[]) => {
    if (!selectedConversation) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { fileUrl, fileName } = response.data;

        const message: Message = {
          id: Date.now().toString(),
          content: '',
          senderId: 'current',
          timestamp: new Date(),
          type: 'file',
          fileUrl,
          fileName,
        };

        setMessages(prev => [...prev, message]);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setShowFileUploader(false)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'imessage': return '💬'
      case 'twitter': return '🐦'
      case 'instagram': return '📷'
      case 'facebook': return '👥'
      case 'whatsapp': return '💚'
      case 'slack': return '#'
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
      case 'slack': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

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
                  {conversation.isGroup ? (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-500 dark:text-gray-400">{conversation.name?.charAt(0)}</span>
                    </div>
                  ) : (
                    <Image
                      src={conversation.participants[0].avatar}
                      alt={conversation.participants[0].name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  {conversation.participants[0].isOnline && !conversation.isGroup && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                  <div className={`absolute -top-1 -right-1 w-5 h-5 ${getPlatformColor(conversation.platform)} rounded-full flex items-center justify-center text-white text-xs`}>
                    {getPlatformIcon(conversation.platform)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {conversation.isGroup ? conversation.name : conversation.participants[0].name}
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
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {selectedConv.isGroup ? (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400">{selectedConv.name?.charAt(0)}</span>
                  </div>
                ) : (
                  <Image
                    src={selectedConv.participants[0].avatar}
                    alt={selectedConv.participants[0].name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedConv.isGroup ? selectedConv.name : selectedConv.participants[0].name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedConv.isGroup ? `${selectedConv.participants.length} members` : (selectedConv.participants[0].isOnline ? 'Online' : 'Offline')}
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
                    {message.type === 'file' && message.fileUrl ? (
                      <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                        <FaPaperclip className="h-5 w-5" />
                        <span>{message.fileName}</span>
                      </a>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
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

                  <button onClick={() => setShowFileUploader(true)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <FaPaperclip className="h-5 w-5" />
                  </button>

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

      {/* File Uploader Modal */}
      {showFileUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload Files</h2>
            <FileUploader onFileUpload={handleFileUpload} />
            <button
              onClick={() => setShowFileUploader(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Zeeky AI Modal */}
      <ZeekyAI
        isOpen={showZeekyAI}
        onClose={() => setShowZeekyAI(false)}
        context="messaging"
      />
    </div>
  )
}
