
'use client';

import { FaComment, FaBolt, FaRetweet, FaCompass, FaBell } from 'react-icons/fa';

const navItems = [
  { name: 'Chats', icon: FaComment },
  { name: 'Stories', icon: FaBolt },
  { name: 'Feed', icon: FaRetweet },
  { name: 'Threads', icon: FaRetweet },
  { name: 'Explore', icon: FaCompass },
  { name: 'Notifications', icon: FaBell },
];

export default function BottomNavbar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors ${
              activeTab === item.name
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
            }`}>
            <item.icon className="h-6 w-6" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
