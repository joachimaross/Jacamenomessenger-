'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Message } from "@/types/speech";
import { mockMessages } from '@/lib/mock-messages';
import MessagesHeader from './MessagesHeader';
import PlatformTabs from './PlatformTabs';
import MessageList from './MessageList';
import ComposerButton from './ComposerButton';
import MessageComposer from './MessageComposer';
import ChatScreen from './ChatScreen';

export default function UnifiedMessaging() {
  const [activePlatform, setActivePlatform] = useState('all')
  const [messages, setMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showComposer, setShowComposer] = useState(false)
  const [selectedChat, setSelectedChat] = useState<any>(null)

  useEffect(() => {
    setMessages(mockMessages)
  }, [])

  const filteredMessages = messages.filter(message => {
    const matchesPlatform = activePlatform === 'all' || message.platform === activePlatform
    const matchesSearch = message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesPlatform && matchesSearch
  })

  if (selectedChat) {
    return (
      <ChatScreen
        contact={selectedChat}
        onBack={() => setSelectedChat(null)}
      />
    )
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <MessagesHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      <PlatformTabs
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
        messages={messages}
      />
      <MessageList messages={filteredMessages} onSelectChat={setSelectedChat} />
      <ComposerButton setShowComposer={setShowComposer} />
      <AnimatePresence>
        {showComposer && (
          <MessageComposer
            onSendMessage={(message) => {
              console.log('Sending message:', message)
              // TODO: Implement actual message sending
            }}
            selectedPlatform={activePlatform === 'all' ? 'sms' : activePlatform}
            onClose={() => setShowComposer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
