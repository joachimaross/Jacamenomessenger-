
import { FaSearch, FaCog } from 'react-icons/fa';
import NotificationManager from './NotificationManager';

interface MessagesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export default function MessagesHeader({ searchQuery, setSearchQuery, showSettings, setShowSettings }: MessagesHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Jacameno Messaging
        </h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <NotificationManager />
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaCog className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
