'use client'

import { useState } from 'react'
import { FaImage, FaVideo, FaFile, FaDownload, FaShare, FaTimes } from 'react-icons/fa'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail?: string
  filename: string
  size: number
  timestamp: Date
  sender: string
}

interface MediaGalleryProps {
  mediaItems: MediaItem[]
  onDownload: (item: MediaItem) => void
  onShare: (item: MediaItem) => void
  onClose: () => void
}

export default function MediaGallery({ mediaItems, onDownload, onShare, onClose }: MediaGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>('all')

  const filteredItems = mediaItems.filter(item =>
    filter === 'all' || item.type === filter
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Media Gallery
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 p-4 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'all', label: 'All', icon: null },
            { key: 'image', label: 'Images', icon: FaImage },
            { key: 'video', label: 'Videos', icon: FaVideo },
            { key: 'document', label: 'Documents', icon: FaFile }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                filter === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="relative group cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {item.type === 'image' && (
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.filename}
                    className="w-full h-32 object-cover"
                  />
                )}
                {item.type === 'video' && (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <FaVideo className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {item.type === 'document' && (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <FaFile className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDownload(item)
                      }}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                    >
                      <FaDownload className="h-4 w-4 text-gray-900" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onShare(item)
                      }}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                    >
                      <FaShare className="h-4 w-4 text-gray-900" />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <p className="text-xs truncate">{item.filename}</p>
                  <p className="text-xs opacity-75">{formatFileSize(item.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Viewer Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
            <div className="relative max-w-4xl max-h-full">
              {selectedItem.type === 'image' && (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.filename}
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {selectedItem.type === 'video' && (
                <video
                  src={selectedItem.url}
                  controls
                  className="max-w-full max-h-full"
                />
              )}
              {selectedItem.type === 'document' && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg">
                  <FaFile className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-center text-gray-900 dark:text-white">
                    {selectedItem.filename}
                  </p>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(selectedItem.size)}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <FaTimes className="h-5 w-5" />
              </button>

              {/* Action Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={() => onDownload(selectedItem)}
                  className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                >
                  <FaDownload className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onShare(selectedItem)}
                  className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                >
                  <FaShare className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}