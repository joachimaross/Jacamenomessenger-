'use client'

import { useState, useRef } from 'react'
import { FaCamera, FaPlay, FaPause, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingProps {
  onComplete: (profile: { name: string; avatar: string; livePhoto?: string }) => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({
    name: '',
    avatar: '',
    livePhoto: ''
  })
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const steps = [
    {
      title: 'Welcome to Jacameno Messenger',
      subtitle: 'Your AI-powered social concierge',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">📱</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Experience the future of messaging with Zeeky AI - your personal social concierge that learns from your interactions.
          </p>
        </div>
      )
    },
    {
      title: 'Unified Messaging',
      subtitle: 'All your conversations in one place',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            SMS, email, social media - everything synchronized and intelligently organized.
          </p>
        </div>
      )
    },
    {
      title: 'AI-Powered Insights',
      subtitle: 'Zeeky learns what you love',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">🤖</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Personalized recommendations, smart content discovery, and contextual assistance.
          </p>
        </div>
      )
    },
    {
      title: 'Create Your Profile',
      subtitle: 'Tell us about yourself',
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What's your name?
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={takePhoto}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <FaCamera className="h-5 w-5" />
                <span>Take Photo</span>
              </button>

              {profile.avatar && (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-gray-300"
                />
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Live Photo Magic',
      subtitle: 'Add a moving profile picture',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create a live photo that animates when someone taps and holds on your profile picture.
            </p>
          </div>

          <div className="relative">
            {!recordedVideo ? (
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-lg"
                  autoPlay
                  playsInline
                  muted
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <video
                  src={recordedVideo}
                  className="w-full h-full object-cover rounded-lg"
                  controls
                  loop
                />
              </div>
            )}

            <div className="flex justify-center space-x-4">
              {!recordedVideo ? (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              ) : (
                <>
                  <button
                    onClick={resetRecording}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors"
                  >
                    Retake
                  </button>
                  <button
                    onClick={() => setProfile(prev => ({ ...prev, livePhoto: recordedVideo! }))}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors"
                  >
                    Use This
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )
    }
  ]

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const takePhoto = async () => {
    await startCamera()

    setTimeout(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current
        const video = videoRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const photoUrl = canvas.toDataURL('image/jpeg', 0.8)
          setProfile(prev => ({ ...prev, avatar: photoUrl }))
        }
      }
    }, 1000)
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
        setRecordedVideo(videoUrl)
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

  const resetRecording = () => {
    setRecordedVideo(null)
    setIsRecording(false)
  }

  const nextStep = () => {
    if (step === steps.length - 1) {
      onComplete(profile)
    } else {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    if (step === 3) return profile.name.trim() && profile.avatar
    if (step === 4) return profile.livePhoto
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                index <= step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {steps[step].title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {steps[step].subtitle}
              </p>
            </div>

            {steps[step].content}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevStep}
                disabled={step === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  step === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FaArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>{step === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                {step !== steps.length - 1 && <FaArrowRight className="h-4 w-4" />}
                {step === steps.length - 1 && <FaCheck className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}