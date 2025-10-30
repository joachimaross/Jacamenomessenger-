'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { FaBell, FaTimes } from 'react-icons/fa'
import axios from 'axios'

interface Notification {
  id: string
  title: string
  body: string
  platform: string
  timestamp: Date
  read: boolean
  type: 'message' | 'mention' | 'like' | 'follow' | 'system'
}

export default function NotificationManager() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPermission(Notification.permission)

      navigator.serviceWorker.ready.then(registration => {
        if (permission === 'granted') {
          subscribeUserToPush(registration)
        }
      })
    }

    fetchNotifications()
  }, [permission])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications')
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const subscribeUserToPush = async (registration: ServiceWorkerRegistration) => {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      return // User is already subscribed
    }

    try {
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      await axios.post('/api/subscribe', newSubscription)
      toast.success('Successfully subscribed to notifications!')
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      toast.error('Failed to subscribe to notifications.')
    }
  }

  const requestPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          subscribeUserToPush(registration)
        })
      } else {
        toast.error('Notifications denied.')
      }
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`/api/notifications/${id}`, { read: true })
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const dismissNotification = async (id: string) => {
    try {
      await axios.delete(`/api/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Error dismissing notification:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => {
            if (permission !== 'granted') {
              requestPermission()
            }
          }}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
        >
          <FaBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {notifications.length > 0 && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {notification.platform}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.body}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {permission !== 'granted' && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={requestPermission}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Enable Notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
