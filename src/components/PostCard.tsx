'use client'

import { useState, useRef } from 'react'
import { FaHeart, FaComment, FaShare, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaBookmark, FaEllipsisH } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface PostCardProps {
  post: {
    id: string
    type: 'video' | 'image' | 'text' | 'zeeky_insight'
    content: string
    author: {
      name: string
      avatar: string
      verified?: boolean
      handle?: string
    }
    timestamp: Date
    likes: number
    comments: number
    shares: number
    media?: {
      url: string
      thumbnail?: string
      duration?: number
    }
    platform: string
    tags?: string[]
    location?: string
    isLiked?: boolean
    isBookmarked?: boolean
  }
  onLike: (postId: string) => void
  onComment: (postId: string) => void
  onShare: (postId: string) => void
  onBookmark: (postId: string) => void
  onProfileClick: (authorId: string) => void
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onProfileClick
}: PostCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showComments, setShowComments] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'twitter': return 'text-blue-400'
      case 'instagram': return 'text-pink-500'
      case 'facebook': return 'text-blue-600'
      case 'tiktok': return 'text-black dark:text-white'
      case 'youtube': return 'text-red-500'
      case 'zeeky': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3" onClick={() => onProfileClick(post.author.name)}>
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-500 transition-colors">
                {post.author.name}
              </span>
              {post.author.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{post.author.handle || `@${post.author.name.toLowerCase().replace(/\s+/g, '')}`}</span>
              <span>•</span>
              <span>{post.timestamp.toLocaleDateString()}</span>
              <span>•</span>
              <span className={`font-medium ${getPlatformColor(post.platform)}`}>
                {post.platform}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaEllipsisH className="h-4 w-4" />
        </button>
      </div>

      {/* Options Menu */}
      {showOptions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-4 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10"
        >
          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Report post
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Hide post
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            Block user
          </button>
        </motion.div>
      )}

      {/* Media Content */}
      {post.media && (
        <div className="relative bg-black">
          {post.type === 'video' ? (
            <div className="relative">
              <video
                ref={videoRef}
                src={post.media.url}
                poster={post.media.thumbnail}
                className="w-full max-h-96 object-contain"
                loop
                muted={isMuted}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Video Controls */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                >
                  {isPlaying ? <FaPause className="h-6 w-6" /> : <FaPlay className="h-6 w-6 ml-1" />}
                </button>
              </div>

              {/* Video Overlay Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70"
                >
                  {isMuted ? <FaVolumeMute className="h-4 w-4" /> : <FaVolumeUp className="h-4 w-4" />}
                </button>
              </div>

              {/* Duration */}
              {post.media.duration && (
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                  {Math.floor(post.media.duration / 60)}:{(post.media.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          ) : (
            <img
              src={post.media.url}
              alt={post.content}
              className="w-full max-h-96 object-cover"
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-900 dark:text-white mb-3 leading-relaxed">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-blue-500 text-sm hover:text-blue-600 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        {post.location && (
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
            <span>📍</span>
            <span>{post.location}</span>
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 transition-colors ${
                post.isLiked
                  ? 'text-red-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
              }`}
            >
              <FaHeart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{formatNumber(post.likes)}</span>
            </button>

            <button
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
            >
              <FaComment className="h-5 w-5" />
              <span className="text-sm">{formatNumber(post.comments)}</span>
            </button>

            <button
              onClick={() => onShare(post.id)}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors"
            >
              <FaShare className="h-5 w-5" />
              <span className="text-sm">{formatNumber(post.shares)}</span>
            </button>
          </div>

          <button
            onClick={() => onBookmark(post.id)}
            className={`p-2 rounded-full transition-colors ${
              post.isBookmarked
                ? 'text-yellow-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500'
            }`}
          >
            <FaBookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}