'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaTimes, FaHeart, FaComment, FaShare, FaPlay, FaPause } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface Story {
  id: string
  userId: string
  username: string
  avatar: string
  media: {
    type: 'image' | 'video'
    url: string
  }
  timestamp: Date
  expiresAt: Date
  likes: number
  comments: number
}

interface StoryViewerProps {
  stories: Story[]
  initialIndex?: number
  onClose: () => void
  onLike: (storyId: string) => void
  onComment: (storyId: string) => void
  onShare: (storyId: string) => void
}

export default function StoryViewer({
  stories,
  initialIndex = 0,
  onClose,
  onLike,
  onComment,
  onShare
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const currentStory = stories[currentIndex]
  const storyDuration = 5000 // 5 seconds per story

  useEffect(() => {
    if (!isPlaying || isPaused) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Move to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1)
            return 0
          } else {
            onClose()
            return 100
          }
        }
        return prev + (100 / (storyDuration / 100))
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex, isPlaying, isPaused, stories.length, storyDuration, onClose])

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  if (!currentStory) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onClick={handleNext}
      >
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="flex space-x-1">
            {stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="absolute top-6 right-4 z-20 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* User Info */}
        <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src={currentStory.avatar}
              alt={currentStory.username}
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
            />
            <div>
              <p className="text-white font-semibold">{currentStory.username}</p>
              <p className="text-gray-300 text-sm">
                {new Date(currentStory.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Pause/Play Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              togglePause()
            }}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            {isPaused ? <FaPlay className="h-5 w-5" /> : <FaPause className="h-5 w-5" />}
          </button>
        </div>

        {/* Story Media */}
        <div className="relative w-full h-full flex items-center justify-center">
          {currentStory.media.type === 'image' ? (
            <Image
              src={currentStory.media.url}
              alt="Story"
              fill
              className="object-cover"
            />
          ) : (
            <video
              src={currentStory.media.url}
              autoPlay
              muted
              className="w-full h-full object-cover"
              onEnded={handleNext}
            />
          )}
        </div>

        {/* Navigation Areas */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 z-10" onClick={handlePrevious} />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 z-10" onClick={handleNext} />

        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-4 right-4 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onLike(currentStory.id)
                }}
                className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors"
              >
                <FaHeart className="h-6 w-6" />
                <span>{currentStory.likes}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onComment(currentStory.id)
                }}
                className="flex items-center space-x-2 text-white hover:text-blue-500 transition-colors"
              >
                <FaComment className="h-6 w-6" />
                <span>{currentStory.comments}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onShare(currentStory.id)
                }}
                className="flex items-center space-x-2 text-white hover:text-green-500 transition-colors"
              >
                <FaShare className="h-6 w-6" />
              </button>
            </div>

            <div className="text-white text-sm opacity-75">
              {currentIndex + 1} / {stories.length}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}