
import { AnimatePresence } from 'framer-motion';
import { Message } from "@/types/speech";
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <AnimatePresence>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </AnimatePresence>
    </div>
  );
}
