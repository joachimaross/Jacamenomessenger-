'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { FaArrowLeft, FaPhone, FaVideo, FaPaperclip, FaSmile, FaMicrophone, FaPaperPlane, FaLock } from 'react-icons/fa'
import MessageThread from './MessageThread'
import VoiceVideoCall from './VoiceVideoCall'
import FileUploader from './FileUploader'

interface Message {
  id: string
  platform: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
  type: 'text' | 'image' | 'video' | 'link'
  reactions?: { [emoji: string]: number }
  replies?: Message[]
  threadId?: string
}

interface Participant {
  id: string
  name: string
  avatar: string
}

interface ChatScreenProps {
  contact: {
    id: string
    name: string
    avatar?: string
    platform: string
  }
  onBack: () => void
  isGroup?: boolean
  participants?: Participant[]
}

export default function ChatScreen({ contact, onBack, isGroup = false, participants = [] }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      platform: contact.platform,
      senderId: 'user1',
      content: 'Hey there! How are you doing?',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      type: 'text',
      reactions: { '👍': 1 }
    },
    {
      id: '2',
      platform: contact.platform,
      senderId: contact.id,
      content: 'Hi! I\'m doing great, thanks for asking. How about you?',
      timestamp: new Date(Date.now() - 3000000),
      read: true,
      type: 'text'
    },
    {
      id: '3',
      platform: contact.platform,
      senderId: 'user1',
      content: 'Pretty good! Just working on some new features.',
      timestamp: new Date(Date.now() - 1800000),
      read: false,
      type: 'text'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showCall, setShowCall] = useState(false)
  const [callType, setCallType] = useState<'voice' | 'video'>('voice')
  const [showFileUploader, setShowFileUploader] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        platform: contact.platform,
        senderId: 'user1',
        content: newMessage,
        timestamp: new Date(),
        read: false,
        type: 'text'
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReply = (messageId: string, replyContent: string) => {
    const reply: Message = {
      id: Date.now().toString(),
      platform: contact.platform,
      senderId: 'user1',
      content: replyContent,
      timestamp: new Date(),
      read: false,
      type: 'text',
      threadId: messageId
    }

    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, replies: [...(msg.replies || []), reply] }
        : msg
    ))
  }

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: (msg.reactions?.[emoji] || 0) + 1
            }
          }
        : msg
    ))
  }

  const handleFileUpload = (files: File[]) => {
    // Handle file upload logic here
    console.log('Uploading files:', files)
    setShowFileUploader(false)
  }

  const startCall = (type: 'voice' | 'video') => {
    setCallType(type)
    setShowCall(true)
  }

  if (showCall) {
    return (
      <VoiceVideoCall
        contact={contact}
        callType={callType}
        onEndCall={() => setShowCall(false)}
      />
    )
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            {contact.avatar ? (
              <Image
                src={contact.avatar}
                alt={contact.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {contact.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {contact.platform} • {isGroup ? `${participants.length} members` : 'Online'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => startCall('voice')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            <FaPhone className="h-5 w-5" />
          </button>
          <button
            onClick={() => startCall('video')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            <FaVideo className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-1 text-green-500">
            <FaLock className="h-4 w-4" />
            <span className="text-xs">Encrypted</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageThread
            key={message.id}
            message={message}
            participants={participants}
            isGroup={isGroup}
            onReply={handleReply}
            onReact={handleReact}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File Uploader */}
      {showFileUploader && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <FileUploader onFileUpload={handleFileUpload} />
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFileUploader(!showFileUploader)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          >
            <FaPaperclip className="h-5 w-5" />
          </button>

          <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
            />
            <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <FaSmile className="h-5 w-5" />
            </button>
          </div>

          {newMessage.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            >
              <FaPaperPlane className="h-5 w-5" />
            </button>
          ) : (
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <FaMicrophone className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}