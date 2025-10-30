'use client'

import { useState } from 'react'
import { FaBell, FaShieldAlt, FaPalette, FaGlobe, FaSave, FaToggleOn, FaToggleOff } from 'react-icons/fa'

interface UserSettingsProps {
  onSave: (settings: UserSettings) => void
  initialSettings?: Partial<UserSettings>
}

interface UserSettings {
  notifications: {
    enabled: boolean
    platforms: string[]
    sound: boolean
    desktop: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    messageRequests: boolean
    readReceipts: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'system'
    messageDensity: 'comfortable' | 'compact'
    fontSize: 'small' | 'medium' | 'large'
  }
  platforms: {
    enabled: string[]
    defaultPlatform: string
    crossPost: boolean
  }
}

export default function UserSettings({ onSave, initialSettings }: UserSettingsProps) {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      enabled: true,
      platforms: ['twitter', 'facebook', 'sms'],
      sound: true,
      desktop: true,
      ...initialSettings?.notifications
    },
    privacy: {
      profileVisibility: 'public',
      messageRequests: true,
      readReceipts: true,
      ...initialSettings?.privacy
    },
    appearance: {
      theme: 'system',
      messageDensity: 'comfortable',
      fontSize: 'medium',
      ...initialSettings?.appearance
    },
    platforms: {
      enabled: ['twitter', 'facebook', 'instagram', 'sms', 'email'],
      defaultPlatform: 'sms',
      crossPost: false,
      ...initialSettings?.platforms
    }
  })

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.')
    setSettings(prev => {
      const newSettings = { ...prev }
      let current: any = newSettings
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  const handleSave = () => {
    onSave(settings)
  }

  const platformOptions = [
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'discord', name: 'Discord', icon: '💬' },
    { id: 'telegram', name: 'Telegram', icon: '✈️' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💚' },
    { id: 'sms', name: 'SMS', icon: '📱' },
    { id: 'email', name: 'Email', icon: '✉️' },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your messaging experience
        </p>
      </div>

      <div className="space-y-8">
        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <FaBell className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Notifications
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications for new messages
                </p>
              </div>
              <button
                onClick={() => updateSetting('notifications.enabled', !settings.notifications.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications.enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.notifications.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notification Platforms
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {platformOptions.map((platform) => (
                      <label key={platform.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.notifications.platforms.includes(platform.id)}
                          onChange={(e) => {
                            const newPlatforms = e.target.checked
                              ? [...settings.notifications.platforms, platform.id]
                              : settings.notifications.platforms.filter(p => p !== platform.id)
                            updateSetting('notifications.platforms', newPlatforms)
                          }}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {platform.icon} {platform.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sound Notifications
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Play sound for new messages
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('notifications.sound', !settings.notifications.sound)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.sound ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.sound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Desktop Notifications
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Show notifications on desktop
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('notifications.desktop', !settings.notifications.desktop)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.desktop ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.desktop ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <FaShieldAlt className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Privacy
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Visibility
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => updateSetting('privacy.profileVisibility', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message Requests
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow message requests from non-contacts
                </p>
              </div>
              <button
                onClick={() => updateSetting('privacy.messageRequests', !settings.privacy.messageRequests)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.privacy.messageRequests ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy.messageRequests ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Read Receipts
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Show when messages are read
                </p>
              </div>
              <button
                onClick={() => updateSetting('privacy.readReceipts', !settings.privacy.readReceipts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.privacy.readReceipts ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy.readReceipts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <FaPalette className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => updateSetting('appearance.theme', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Density
              </label>
              <select
                value={settings.appearance.messageDensity}
                onChange={(e) => updateSetting('appearance.messageDensity', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => updateSetting('appearance.fontSize', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <FaGlobe className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Platforms
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enabled Platforms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {platformOptions.map((platform) => (
                  <label key={platform.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.platforms.enabled.includes(platform.id)}
                      onChange={(e) => {
                        const newEnabled = e.target.checked
                          ? [...settings.platforms.enabled, platform.id]
                          : settings.platforms.enabled.filter(p => p !== platform.id)
                        updateSetting('platforms.enabled', newEnabled)
                      }}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {platform.icon} {platform.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Platform
              </label>
              <select
                value={settings.platforms.defaultPlatform}
                onChange={(e) => updateSetting('platforms.defaultPlatform', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {platformOptions
                  .filter(p => settings.platforms.enabled.includes(p.id))
                  .map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cross-Platform Posting
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Post to multiple platforms simultaneously
                </p>
              </div>
              <button
                onClick={() => updateSetting('platforms.crossPost', !settings.platforms.crossPost)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.platforms.crossPost ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.platforms.crossPost ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            <FaSave className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}