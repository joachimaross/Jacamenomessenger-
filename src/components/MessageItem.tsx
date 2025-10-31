
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import { Message } from "@/types/speech";
import { platforms } from "@/lib/platforms";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const platform = platforms.find(p => p.id === message.platform);
  const Icon = platform?.icon || FaEnvelope;

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
        !message.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${platform?.color} bg-gray-100 dark:bg-gray-700`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {message.from}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {message.content}
          </p>
        </div>
        {!message.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
        )}
      </div>
    </motion.div>
  );
}
