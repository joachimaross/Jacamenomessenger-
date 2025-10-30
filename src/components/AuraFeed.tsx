'use client'

import { useState, useEffect, useRef } from 'react'
import { FaHeart, FaComment, FaShare, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface Post {
  id: string
  type: 'video' | 'image' | 'text' | 'aura_insight'
  content: string
  author: {
    name: string
    avatar: string
    verified?: boolean
  }
  timestamp: Date
  likes: number
  comments: number
  shares: number
  media?: {
    url: string
    thumbnail?: string
  }
  platform: string
  tags?: string[]
}

export default function AuraFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockPosts: Post[] = [
      {
        id: '1',
        type: 'video',
        content: 'Just finished an amazing hike! The views were incredible 🌄',
        author: {
          name: 'Sarah Chen',
          avatar: '/api/placeholder/100/100',
          verified: true
        },
        timestamp: new Date(Date.now() - 3600000),
        likes: 1247,
        comments: 89,
        shares: 23,
        media: {
          url: '/api/placeholder/400/600',
          thumbnail: '/api/placeholder/400/600'
        },
        platform: 'instagram',
        tags: ['hiking', 'nature', 'adventure']
      },
      {
        id: '2',
        type: 'aura_insight',
        content: 'Zeeky AI noticed you\'ve been interested in hiking lately. Here are 3 nearby trails with stunning fall colors, perfect for this weekend! 🍂',
        author: {
          name: 'Zeeky AI',
          avatar: '/api/placeholder/100/100',
        },
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        platform: 'aura'
      },
      {
        id: '3',
        type: 'text',
        content: 'Working on something exciting... Can\'t wait to share it with you all! 🚀',
        author: {
          name: 'Alex Rodriguez',
          avatar: '/api/placeholder/100/100',
        },
        timestamp: new Date(Date.now() - 7200000),
        likes: 456,
        comments: 34,
        shares: 12,
        platform: 'twitter'
      },
      {
        id: '4',
        type: 'image',
        content: 'Coffee and code - the perfect combination ☕💻',
        author: {
          name: 'Mia Johnson',
          avatar: '/api/placeholder/100/100',
          verified: true
        },
        timestamp: new Date(Date.now() - 10800000),
        likes: 892,
        comments: 67,
        shares: 45,
        media: {
          url: '/api/placeholder/400/400'
        },
        platform: 'instagram',
        tags: ['coffee', 'coding', 'productivity']
      }
    ]

    setPosts(mockPosts)
  }, [])

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (direction === 'down' && currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const currentPost = posts[currentIndex]

  if (!currentPost) return null

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full relative"
        >
          {/* Media Content */}
          {currentPost.type === 'video' && currentPost.media && (
            <div className="relative h-full w-full">
              <video
                ref={videoRef}
                src={currentPost.media.url}
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
              />

              {/* Video Controls */}
              <div className="absolute bottom-20 right-4 flex flex-col space-y-4">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                >
                  {isPlaying ? <FaPause className="h-5 w-5" /> : <FaPlay className="h-5 w-5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                >
                  {isMuted ? <FaVolumeMute className="h-5 w-5" /> : <FaVolumeUp className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {currentPost.type === 'image' && currentPost.media && (
            <img
              src={currentPost.media.url}
              alt={currentPost.content}
              className="h-full w-full object-cover"
            />
          )}

          {(currentPost.type === 'text' || currentPost.type === 'aura_insight') && (
            <div className="h-full w-full flex items-center justify-center p-8">
              <div className="max-w-md text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {currentPost.author.name.charAt(0)}
                  </span>
                </div>
                <p className="text-white text-xl leading-relaxed">
                  {currentPost.content}
                </p>
              </div>
            </div>
          )}

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black bg-opacity-50">
            {/* Author Info */}
            <div className="absolute top-8 left-4 right-20 flex items-center space-x-3">
              <img
                src={currentPost.author.avatar}
                alt={currentPost.author.name}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div className="text-white">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{currentPost.author.name}</span>
                  {currentPost.author.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-300">
                  {currentPost.timestamp.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
              <button className="flex flex-col items-center space-y-1 text-white">
                <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all">
                  <FaHeart className="h-6 w-6" />
                </div>
                <span className="text-sm">{currentPost.likes.toLocaleString()}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex flex-col items-center space-y-1 text-white"
              >
                <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all">
                  <FaComment className="h-6 w-6" />
                </div>
                <span className="text-sm">{currentPost.comments.toLocaleString()}</span>
              </button>

              <button className="flex flex-col items-center space-y-1 text-white">
                <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all">
                  <FaShare className="h-6 w-6" />
                </div>
                <span className="text-sm">{currentPost.shares.toLocaleString()}</span>
              </button>
            </div>

            {/* Content Text */}
            <div className="absolute bottom-8 left-4 right-20">
              <p className="text-white text-lg leading-relaxed mb-2">
                {currentPost.content}
              </p>
              {currentPost.tags && (
                <div className="flex flex-wrap gap-2">
                  {currentPost.tags.map((tag) => (
                    <span key={tag} className="text-blue-400 text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1 h-12 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white'
                : 'bg-white bg-opacity-30 hover:bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Comments Panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Comments ({currentPost.comments})
                </h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Comments feature coming soon...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center opacity-50">
        <p className="text-sm">Swipe up/down to navigate</p>
      </div>
    </div>
  )
}