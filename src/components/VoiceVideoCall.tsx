'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhone, FaPhoneSlash, FaExpand, FaCompress } from 'react-icons/fa'
import Webcam from 'react-webcam'
import io, { Socket } from 'socket.io-client'

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

  const localVideoRef = useRef<Webcam>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const callStartTime = useRef<Date | null>(null)
  const socket = useRef<Socket | null>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    socket.current = io("http://localhost:3001") // Replace with your signaling server URL

    socket.current.on('connect', () => {
      console.log('Connected to signaling server')
      socket.current?.emit('join-room', 'some-room-id') // Replace with a dynamic room ID
    })

    socket.current.on('other-user', (userId) => {
      if (peerConnection.current) {
        peerConnection.current.createOffer()
          .then(offer => {
            peerConnection.current?.setLocalDescription(offer)
            socket.current?.emit('offer', offer, userId)
          })
      }
    })

    socket.current.on('offer', (offer, userId) => {
      if (peerConnection.current) {
        peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))
          .then(() => peerConnection.current?.createAnswer())
          .then(answer => {
            peerConnection.current?.setLocalDescription(answer)
            socket.current?.emit('answer', answer, userId)
          })
      }
    })

    socket.current.on('answer', (answer) => {
      peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer))
    })

    socket.current.on('ice-candidate', (candidate) => {
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate))
    })

    // Set up the RTCPeerConnection
    const servers = {
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
    }
    peerConnection.current = new RTCPeerConnection(servers)

    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socket.current?.emit('ice-candidate', event.candidate, 'some-room-id')
      }
    }

    peerConnection.current.ontrack = event => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    return () => {
      socket.current?.disconnect()
      peerConnection.current?.close()
    }
  }, [])

  useEffect(() => {
    if (localVideoRef.current && localVideoRef.current.stream && peerConnection.current) {
      const stream = localVideoRef.current.stream;
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream)
      })
    }
  }, [localVideoRef.current?.stream])

  useEffect(() => {
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
    if (localVideoRef.current?.stream) {
      localVideoRef.current.stream.getAudioTracks()[0].enabled = isMuted
    }
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    if (localVideoRef.current?.stream) {
      localVideoRef.current.stream.getVideoTracks()[0].enabled = isVideoOff
    }
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
              <Image
                src={contact.avatar}
                alt={contact.name}
                width={40}
                height={40}
                className="rounded-full"
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
              <Webcam
                ref={localVideoRef}
                className="w-full h-full object-cover"
                audio={!isMuted}
                muted
              />
            </div>
          </>
        ) : (
          /* Voice Call Interface */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="text-center text-white">
              {contact.avatar ? (
                <Image
                  src={contact.avatar}
                  alt={contact.name}
                  width={128}
                  height={128}
                  className="rounded-full mx-auto mb-6 border-4 border-white"
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
