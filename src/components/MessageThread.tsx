'use client'

import { useState } from 'react'
import { FaReply, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import MessageReactions from './MessageReactions'

interface Message {
  id: string
  platform: string
  from: string
  content: string
  timestamp: Date
  read: boolean
  type: 'text' | 'image' | 'video' | 'link'
  reactions?: { [emoji: string]: number }
  replies?: Message[]
  threadId?: string
}

interface MessageThreadProps {
  message: Message
  onReply: (messageId: string, replyContent: string) => void
  onReact: (messageId: string, emoji: string) => void
}

export default function MessageThread({ message, onReply, onReact }: MessageThreadProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(message.id, replyText)
      setReplyText('')
      setShowReplyInput(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleReply()
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      {/* Main Message */}
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {message.from}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              >
                <FaReply className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {message.content}
          </p>

          {/* Reactions */}
          <MessageReactions
            messageId={message.id}
            reactions={message.reactions || {}}
            onReact={onReact}
          />
        </div>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="mt-4 pl-8">
          <div className="flex space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Reply to this message..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {/* Thread Replies */}
      {message.replies && message.replies.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {showReplies ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
            <span>{message.replies.length} {message.replies.length === 1 ? 'reply' : 'replies'}</span>
          </button>

          {showReplies && (
            <div className="mt-3 space-y-3 pl-8 border-l-2 border-gray-200 dark:border-gray-700">
              {message.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {reply.from}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {reply.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {reply.content}
                    </p>
                    {reply.reactions && Object.keys(reply.reactions).length > 0 && (
                      <MessageReactions
                        messageId={reply.id}
                        reactions={reply.reactions}
                        onReact={onReact}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}