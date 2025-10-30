import { NextApiRequest, NextApiResponse } from 'next';

let notifications = [
  {
    id: '1',
    title: 'New Message',
    body: 'You have a new message from @elonmusk',
    platform: 'twitter',
    timestamp: new Date(Date.now() - 300000),
    read: false,
    type: 'message'
  },
  {
    id: '2',
    title: 'SMS Received',
    body: 'New SMS from +1234567890',
    platform: 'sms',
    timestamp: new Date(Date.now() - 600000),
    read: false,
    type: 'message'
  },
  {
    id: '3',
    title: 'Email Alert',
    body: 'New email from support@jacameno.com',
    platform: 'email',
    timestamp: new Date(Date.now() - 900000),
    read: true,
    type: 'message'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    res.status(200).json(notifications);
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { read } = req.body;
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = read;
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    notifications = notifications.filter(n => n.id !== id);
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
