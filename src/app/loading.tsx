import { FaSpinner } from 'react-icons/fa'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Loading Jacameno Messaging
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Connecting to your messages...
        </p>
      </div>
    </div>
  )
}