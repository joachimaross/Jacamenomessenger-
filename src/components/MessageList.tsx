
import { AnimatePresence } from 'framer-motion';
import { Message } from "@/types/speech";
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  onSelectChat?: (contact: any) => void;
}

export default function MessageList({ messages, onSelectChat }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <AnimatePresence>
        {messages.map((message) => (
          <div key={message.id} onClick={() => onSelectChat?.({
            id: message.from,
            name: message.from,
            platform: message.platform,
            avatar: undefined
          })}>
            <MessageItem message={message} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
