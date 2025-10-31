
import { platforms } from "@/lib/platforms";
import { Message } from "@/types/speech";

interface PlatformTabsProps {
  activePlatform: string;
  setActivePlatform: (platform: string) => void;
  messages: Message[];
}

export default function PlatformTabs({ activePlatform, setActivePlatform, messages }: PlatformTabsProps) {
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="flex space-x-1 mt-4 overflow-x-auto">
      <button
        onClick={() => setActivePlatform('all')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
          activePlatform === 'all'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        <span>All</span>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {platforms.map((platform) => {
        const Icon = platform.icon;
        const platformUnread = messages.filter(m => m.platform === platform.id && !m.read).length;
        return (
          <button
            key={platform.id}
            onClick={() => setActivePlatform(platform.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activePlatform === platform.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{platform.name}</span>
            {platformUnread > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {platformUnread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
