'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  FaPaperclip, FaImage, FaVideo, FaMicrophone,
  FaSmile, FaPaperPlane, FaTimes, FaMapMarkerAlt
} from 'react-icons/fa'

interface MessageComposerProps {
  onSendMessage: (message: {
    content: string
    type: 'text' | 'image' | 'video' | 'audio' | 'location'
    platform: string
    attachments?: File[]
  }) => void
  selectedPlatform: string
  onClose: () => void
}

export default function MessageComposer({ onSendMessage, selectedPlatform, onClose }: MessageComposerProps) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage({
        content: message,
        type: attachments.length > 0 ? 'image' : 'text',
        platform: selectedPlatform,
        attachments
      })
      setMessage('')
      setAttachments([])
      onClose()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Message
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Platform Selector */}
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">To:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
              {selectedPlatform}
            </span>
          </div>
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith('image/') ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <FaPaperclip className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex-1 p-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full h-full resize-none border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
            rows={4}
          />
        </div>

        {/* Toolbar */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* File Attachment */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaPaperclip className="h-5 w-5" />
              </button>

              {/* Image */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaImage className="h-5 w-5" />
              </button>

              {/* Video */}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <FaVideo className="h-5 w-5" />
              </button>

              {/* Voice Recording */}
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isRecording ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <FaMicrophone className="h-5 w-5" />
              </button>

              {/* Location */}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <FaMapMarkerAlt className="h-5 w-5" />
              </button>

              {/* Emoji */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaSmile className="h-5 w-5" />
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!message.trim() && attachments.length === 0}
              className={`p-3 rounded-full ${
                message.trim() || attachments.length > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              <FaPaperPlane className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}