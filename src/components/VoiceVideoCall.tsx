'use client'

import { useState, useRef, useEffect } from 'react'
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone, FaPhoneSlash, FaExpand, FaCompress } from 'react-icons/fa'

interface VoiceVideoCallProps {
  contact: {
    id: string
    name: string
    avatar?: string
    platform: string
  }
  callType: 'voice' | 'video'
  onEndCall: () => void
  isIncoming?: boolean
}

export default function VoiceVideoCall({ contact, callType, onEndCall, isIncoming = false }: VoiceVideoCallProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(callType === 'voice')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting')

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const callStartTime = useRef<Date | null>(null)

  useEffect(() => {
    // Simulate call connection
    const timer = setTimeout(() => {
      setCallStatus('connected')
      callStartTime.current = new Date()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === 'connected' && callStartTime.current) {
      interval = setInterval(() => {
        const now = new Date()
        const duration = Math.floor((now.getTime() - callStartTime.current!.getTime()) / 1000)
        setCallDuration(duration)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // In real implementation, this would control actual microphone
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    // In real implementation, this would control actual camera
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleEndCall = () => {
    setCallStatus('ended')
    onEndCall()
  }

  return (
    <div className={`fixed inset-0 bg-black z-50 flex flex-col ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Call Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {contact.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-gray-300">
                {callStatus === 'connecting' && 'Connecting...'}
                {callStatus === 'connected' && formatDuration(callDuration)}
                {callStatus === 'ended' && 'Call ended'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            {isFullscreen ? <FaCompress className="h-5 w-5" /> : <FaExpand className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {callType === 'video' && !isVideoOff ? (
          <>
            {/* Remote Video (Main) */}
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute bottom-24 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            </div>
          </>
        ) : (
          /* Voice Call Interface */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="text-center text-white">
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-6 border-4 border-white flex items-center justify-center">
                  <span className="text-6xl font-semibold">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="text-3xl font-bold mb-2">{contact.name}</h2>
              <p className="text-xl text-gray-300">
                {callStatus === 'connecting' && 'Calling...'}
                {callStatus === 'connected' && formatDuration(callDuration)}
                {callStatus === 'ended' && 'Call ended'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="bg-black bg-opacity-50 p-6">
        <div className="flex items-center justify-center space-x-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMuted ? (
              <FaMicrophoneSlash className="h-6 w-6 text-white" />
            ) : (
              <FaMicrophone className="h-6 w-6 text-white" />
            )}
          </button>

          {/* Video Toggle (Video calls only) */}
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isVideoOff
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isVideoOff ? (
                <FaVideoSlash className="h-6 w-6 text-white" />
              ) : (
                <FaVideo className="h-6 w-6 text-white" />
              )}
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
          >
            <FaPhoneSlash className="h-7 w-7 text-white" />
          </button>

          {/* Additional Controls */}
          <div className="flex space-x-4">
            {/* Speaker Toggle */}
            <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
              <FaPhone className="h-5 w-5 text-white" />
            </button>

            {/* More Options */}
            <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
              <span className="text-white font-bold">⋯</span>
            </button>
          </div>
        </div>

        {/* Call Status Text */}
        <div className="text-center mt-4">
          <p className="text-white text-sm">
            {callStatus === 'connecting' && 'Ringing...'}
            {callStatus === 'connected' && 'Connected'}
            {callStatus === 'ended' && 'Call ended'}
          </p>
        </div>
      </div>
    </div>
  )
}