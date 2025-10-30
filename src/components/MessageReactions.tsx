'use client'

import { useState } from 'react'
import { FaHeart, FaThumbsUp, FaLaugh, FaAngry, FaFrown, FaSurprise } from 'react-icons/fa'

interface MessageReactionsProps {
  messageId: string
  reactions: { [emoji: string]: number }
  onReact: (messageId: string, emoji: string) => void
  showPicker?: boolean
}

const reactionEmojis = [
  { emoji: '❤️', icon: FaHeart, label: 'Love' },
  { emoji: '👍', icon: FaThumbsUp, label: 'Like' },
  { emoji: '😂', icon: FaLaugh, label: 'Laugh' },
  { emoji: '😢', icon: FaFrown, label: 'Sad' },
  { emoji: '😮', icon: FaSurprise, label: 'Surprise' },
  { emoji: '😠', icon: FaAngry, label: 'Angry' },
]

export default function MessageReactions({ messageId, reactions, onReact, showPicker = false }: MessageReactionsProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(showPicker)

  const handleReaction = (emoji: string) => {
    onReact(messageId, emoji)
    setShowReactionPicker(false)
  }

  return (
    <div className="flex items-center space-x-1 mt-2">
      {/* Existing Reactions */}
      {Object.entries(reactions).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => handleReaction(emoji)}
          className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full px-2 py-1 text-xs transition-colors"
        >
          <span>{emoji}</span>
          <span className="text-gray-600 dark:text-gray-400">{count}</span>
        </button>
      ))}

      {/* Add Reaction Button */}
      <button
        onClick={() => setShowReactionPicker(!showReactionPicker)}
        className="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs transition-colors"
      >
        +
      </button>

      {/* Reaction Picker */}
      {showReactionPicker && (
        <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
          <div className="flex space-x-1">
            {reactionEmojis.map(({ emoji, icon: Icon, label }) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title={label}
              >
                <span className="text-lg">{emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}