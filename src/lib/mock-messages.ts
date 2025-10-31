
import { Message } from "@/types/speech";

export const mockMessages: Message[] = [
      {
        id: '1',
        platform: 'twitter',
        from: 'elonmusk',
        content: 'Mars colony update: First crew arriving in 2029 🚀',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        type: 'text'
      },
      {
        id: '2',
        platform: 'facebook',
        from: 'markzuckerberg',
        content: 'Excited about the future of the metaverse!',
        timestamp: new Date(Date.now() - 600000),
        read: true,
        type: 'text'
      },
      {
        id: '3',
        platform: 'sms',
        from: '+1234567890',
        content: 'Your package has been delivered',
        timestamp: new Date(Date.now() - 900000),
        read: false,
        type: 'text'
      },
      {
        id: '4',
        platform: 'email',
        from: 'support@jacameno.com',
        content: 'Welcome to Jacameno Messaging!',
        timestamp: new Date(Date.now() - 1200000),
        read: true,
        type: 'text'
      }
    ]
