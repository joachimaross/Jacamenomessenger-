'use client'

import { useState, useRef } from 'react'
import { FaImage, FaVideo, FaLink, FaPoll, FaCalendar, FaGlobe, FaLock, FaUsers } from 'react-icons/fa'

interface PostingInterfaceProps {
  onPost: (post: {
    content: string
    platforms: string[]
    media?: File[]
    scheduledDate?: Date
    privacy: 'public' | 'friends' | 'private'
  }) => void
  availablePlatforms: string[]
}

export default function PostingInterface({ onPost, availablePlatforms }: PostingInterfaceProps) {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public')
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const platformIcons = {
    twitter: '🐦',
    facebook: '📘',
    instagram: '📷',
    linkedin: '💼',
    discord: '💬',
    telegram: '✈️'
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setMediaFiles(prev => [...prev, ...files])
  }

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handlePost = () => {
    if (content.trim() || mediaFiles.length > 0) {
      onPost({
        content,
        platforms: selectedPlatforms,
        media: mediaFiles.length > 0 ? mediaFiles : undefined,
        scheduledDate: scheduledDate || undefined,
        privacy
      })

      // Reset form
      setContent('')
      setSelectedPlatforms([])
      setMediaFiles([])
      setScheduledDate(null)
      setPrivacy('public')
    }
  }

  const characterCount = content.length
  const maxCharacters = 280 // Twitter limit

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Create Post
      </h2>

      {/* Content Input */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={maxCharacters}
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`text-sm ${characterCount > maxCharacters * 0.9 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {characterCount}/{maxCharacters}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Add media"
            >
              <FaImage className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSchedulePicker(!showSchedulePicker)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Schedule post"
            >
              <FaCalendar className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Picker */}
      {showSchedulePicker && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Schedule Post
          </label>
          <input
            type="datetime-local"
            value={scheduledDate ? scheduledDate.toISOString().slice(0, 16) : ''}
            onChange={(e) => setScheduledDate(e.target.value ? new Date(e.target.value) : null)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
          />
        </div>
      )}

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative">
                {file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                {file.type.startsWith('video/') && (
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <FaVideo className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={() => removeMedia(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Post to platforms
        </label>
        <div className="flex flex-wrap gap-2">
          {availablePlatforms.map((platform) => (
            <button
              key={platform}
              onClick={() => handlePlatformToggle(platform)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPlatforms.includes(platform)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{platformIcons[platform as keyof typeof platformIcons] || '📱'}</span>
              <span className="capitalize">{platform}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Privacy
        </label>
        <div className="flex gap-2">
          {[
            { value: 'public', label: 'Public', icon: FaGlobe },
            { value: 'friends', label: 'Friends', icon: FaUsers },
            { value: 'private', label: 'Private', icon: FaLock }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setPrivacy(value as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                privacy === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Post Button */}
      <div className="flex justify-end">
        <button
          onClick={handlePost}
          disabled={!content.trim() && mediaFiles.length === 0 || selectedPlatforms.length === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            content.trim() || mediaFiles.length > 0 && selectedPlatforms.length > 0
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {scheduledDate ? 'Schedule Post' : 'Post Now'}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}