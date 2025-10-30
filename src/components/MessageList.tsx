'use client'

import { useState } from 'react'

interface Message {
  id: number
  text: string
  sender: string
  timestamp: Date
}

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Welcome to Jacameno Messaging App!',
      sender: 'System',
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'You',
        timestamp: new Date(),
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Messages
      </h2>
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.sender === 'You'
                ? 'bg-blue-100 dark:bg-blue-900 ml-12'
                : 'bg-gray-100 dark:bg-gray-700 mr-12'
            }`}
          >
            <div className="font-semibold text-gray-800 dark:text-white">
              {message.sender}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {message.text}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}