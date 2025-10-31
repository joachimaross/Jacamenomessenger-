'use client'

import { useState, useRef, useEffect } from 'react'
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaRobot, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  content: string
  sender: 'user' | 'zeeky'
  timestamp: Date
  type?: 'text' | 'suggestion' | 'action'
}

interface ZeekyAIProps {
  isOpen: boolean
  onClose: () => void
  context?: string
}

export default function ZeekyAI({ isOpen, onClose, context }: ZeekyAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi! I\'m Zeeky AI, your personal social concierge. How can I help you today?',
      sender: 'zeeky',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (context) {
      // Add context-aware message
      const contextMessage: Message = {
        id: Date.now().toString(),
        content: `I see you're ${context}. How can I assist you with that?`,
        sender: 'zeeky',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, contextMessage])
    }
  }, [context])

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognitionCtor()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onstart = () => {
      setIsListening(true)
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response (in real app, call OpenAI API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      const zeekyMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'zeeky',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, zeekyMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('meme') || input.includes('funny')) {
      return 'I\'d love to help you find a meme! Based on your recent conversations about technology, here\'s a perfect one: [AI taking over the world but still needs coffee] ☕🤖. Want me to suggest more?'
    }

    if (input.includes('restaurant') || input.includes('food') || input.includes('eat')) {
      return 'Great choice! Based on your location and preferences for Italian food, I recommend Giovanni\'s Trattoria on Rush Street. They have amazing pasta carbonara and their tiramisu is legendary! 🍝 Would you like me to make a reservation?'
    }

    if (input.includes('song') || input.includes('music') || input.includes('playlist')) {
      return 'Music is my jam! 🎵 Since you\'ve been listening to indie rock lately, you might love "Electric Feel" by MGMT or "Take Me Out" by Franz Ferdinand. I can create a custom playlist for your current mood if you\'d like!'
    }

    if (input.includes('weather') || input.includes('rain') || input.includes('sunny')) {
      return 'Let me check the weather for you! 🌤️ Currently in Chicago, it\'s 72°F with partly cloudy skies. No rain expected today, perfect for that outdoor activity you mentioned. Should I suggest some indoor alternatives just in case?'
    }

    if (input.includes('remind') || input.includes('reminder') || input.includes('schedule')) {
      return 'I\'ve got you covered for reminders! 📅 I can set up a reminder for your dentist appointment tomorrow at 2 PM. Would you like me to add it to your calendar and send you a notification 30 minutes before?'
    }

    if (input.includes('translate') || input.includes('language')) {
      return 'Language barriers? No problem! 🌍 I can translate between 50+ languages. For example, "Hello, how are you?" in Spanish is "Hola, ¿cómo estás?" What would you like me to translate?'
    }

    if (input.includes('joke') || input.includes('funny') || input.includes('laugh')) {
      return 'Why did the AI go to therapy? 🤖🛋️ It had too many unresolved issues with its training data! 😄 Want another one?'
    }

    if (input.includes('help') || input.includes('what can you do')) {
      return 'I\'m here to help with anything! I can: 🎯 Find memes, restaurants, and songs 🎵 Set reminders and manage your schedule 📅 Translate languages 🌍 Tell jokes 😄 Check weather 🌤️ Create content ideas 💡 And much more! What would you like assistance with?'
    }

    return 'That\'s interesting! I\'m learning from our conversation to better assist you. Based on what you\'ve shared, I think you might enjoy exploring some new restaurants in Wicker Park or checking out the latest indie music releases. Would you like recommendations for either?'
  }

  const quickSuggestions = [
    'Find me a funny meme',
    'Suggest a good restaurant',
    'Play some music',
    'Check the weather',
    'Set a reminder',
    'Tell me a joke'
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <FaRobot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Zeeky AI</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your personal assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {isListening ? <FaMicrophoneSlash className="h-5 w-5" /> : <FaMicrophone className="h-5 w-5" />}
              </button>

              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className={`p-2 rounded-full ${
                  input.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaPaperPlane className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}