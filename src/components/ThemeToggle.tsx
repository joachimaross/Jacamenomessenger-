'use client'

import { useState, useEffect } from 'react'
import { FaSun, FaMoon, FaCog } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('jacameno-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)

    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('jacameno-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('jacameno-theme', 'light')
    }
  }

  const quickActions = [
    {
      icon: FaSun,
      label: 'Toggle Theme',
      action: toggleTheme,
      active: isDark
    },
    {
      icon: FaCog,
      label: 'Settings',
      action: () => console.log('Open settings'),
      active: false
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setShowQuickActions(!showQuickActions)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Quick actions"
      >
        <FaCog className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {showQuickActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
        >
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.action()
                setShowQuickActions(false)
              }}
              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <action.icon className={`h-5 w-5 ${action.active ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className="text-sm text-gray-900 dark:text-white">{action.label}</span>
              {action.active && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}