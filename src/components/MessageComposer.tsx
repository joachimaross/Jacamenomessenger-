
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { platforms } from '@/lib/platforms';

interface MessageComposerProps {
  onSendMessage: (message: { platform: string; to: string; content: string }) => void;
  selectedPlatform: string;
  onClose: () => void;
}

export default function MessageComposer({ onSendMessage, selectedPlatform, onClose }: MessageComposerProps) {
  const [platform, setPlatform] = useState(selectedPlatform);
  const [to, setTo] = useState('');
  const [content, setContent] = useState('');
  const composerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (to && content) {
      onSendMessage({ platform, to, content });
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (composerRef.current && !composerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div ref={composerRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold">New Message</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {platforms.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To
            </label>
            <input
              type="text"
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder={platform === 'email' ? 'recipient@example.com' : (platform === 'sms' ? '+1234567890' : '@username')}
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="content"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message..."
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!to || !content}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
            <span>Send</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
