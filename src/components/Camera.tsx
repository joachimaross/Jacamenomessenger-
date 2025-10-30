'use client'

import { useState, useRef, useEffect } from 'react'
import { FaCamera, FaVideo, FaMagic, FaRedo, FaCheck, FaTimes, FaBolt, FaPalette, FaMusic } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface CameraProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (media: { type: 'photo' | 'video', url: string, zeekyEnhanced?: boolean }) => void
}

export default function Camera({ isOpen, onClose, onCapture }: CameraProps) {
  const [mode, setMode] = useState<'photo' | 'video' | 'zeeky'>('photo')
  const [isRecording, setIsRecording] = useState(false)
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [zeekyPrompt, setZeekyPrompt] = useState('')
  const [showZeekyOptions, setShowZeekyOptions] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isOpen])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: mode === 'video' || mode === 'zeeky'
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedMedia(photoUrl)
      }
    }
  }

  const startRecording = () => {
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9'
      })

      chunksRef.current = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const videoUrl = URL.createObjectURL(blob)
        setCapturedMedia(videoUrl)
        setIsRecording(false)
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const processWithZeeky = async () => {
    if (!capturedMedia || !zeekyPrompt.trim()) return

    setIsProcessing(true)

    // Simulate Zeeky AI processing (in real app, send to AI service)
    setTimeout(() => {
      // For demo, just add a filter effect
      setIsProcessing(false)
      onCapture({
        type: mode === 'photo' ? 'photo' : 'video',
        url: capturedMedia,
        zeekyEnhanced: true
      })
      resetCamera()
    }, 2000)
  }

  const resetCamera = () => {
    setCapturedMedia(null)
    setZeekyPrompt('')
    setShowZeekyOptions(false)
    setIsProcessing(false)
  }

  const zeekySuggestions = [
    'Add sunset filter with dreamy music',
    'Create a boomerang effect',
    'Apply cinematic color grading',
    'Add particle effects and glow',
    'Transform into animated style',
    'Add text overlay with custom font'
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50"
      >
        {/* Camera View */}
        <div className="relative h-full w-full">
          {!capturedMedia ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="relative h-full w-full">
              {mode === 'video' ? (
                <video
                  src={capturedMedia}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={capturedMedia}
                  alt="Captured"
                  className="h-full w-full object-cover"
                />
              )}

              {/* Zeeky Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaMagic className="h-12 w-12 mx-auto mb-4 animate-spin text-purple-500" />
                    <p className="text-xl font-semibold">Zeeky AI is creating magic...</p>
                    <p className="text-sm opacity-75 mt-2">Applying {zeekyPrompt}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <button
              onClick={onClose}
              className="p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            {/* Mode Selector */}
            <div className="flex bg-black bg-opacity-50 rounded-full p-1">
              {[
                { id: 'photo', label: 'Photo', icon: FaCamera },
                { id: 'video', label: 'Video', icon: FaVideo },
                { id: 'zeeky', label: 'Zeeky AI', icon: FaMagic }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMode(id as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                    mode === id
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Zeeky AI Prompt Input */}
          {mode === 'zeeky' && !capturedMedia && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-24 left-4 right-4"
            >
              <div className="bg-black bg-opacity-50 rounded-2xl p-4">
                <input
                  type="text"
                  value={zeekyPrompt}
                  onChange={(e) => setZeekyPrompt(e.target.value)}
                  placeholder="Describe what you want Zeeky to create..."
                  className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none text-lg"
                />

                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {zeekySuggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setZeekyPrompt(suggestion)}
                      className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm text-white hover:bg-opacity-30"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            {!capturedMedia ? (
              <div className="flex justify-center">
                <button
                  onClick={mode === 'video' ? (isRecording ? stopRecording : startRecording) : takePhoto}
                  className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ${
                    isRecording
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                >
                  {isRecording ? (
                    <div className="w-6 h-6 bg-white rounded-sm" />
                  ) : (
                    <FaCamera className="h-8 w-8 text-white" />
                  )}
                </button>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetCamera}
                  className="p-4 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                >
                  <FaRedo className="h-6 w-6" />
                </button>

                {mode === 'zeeky' && (
                  <button
                    onClick={processWithZeeky}
                    disabled={!zeekyPrompt.trim() || isProcessing}
                    className={`p-4 rounded-full text-white ${
                      zeekyPrompt.trim() && !isProcessing
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FaMagic className="h-6 w-6" />
                  </button>
                )}

                <button
                  onClick={() => {
                    onCapture({
                      type: mode === 'photo' ? 'photo' : 'video',
                      url: capturedMedia,
                      zeekyEnhanced: mode === 'zeeky'
                    })
                    resetCamera()
                    onClose()
                  }}
                  className="p-4 bg-green-500 hover:bg-green-600 rounded-full text-white"
                >
                  <FaCheck className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="font-medium">Recording</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}