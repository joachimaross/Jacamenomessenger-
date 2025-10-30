import { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';

let subscriptions: any[] = []; // In-memory subscription storage

webpush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { title, body } = req.body;

    const notificationPayload = JSON.stringify({ title, body });

    Promise.all(
      subscriptions.map(subscription =>
        webpush.sendNotification(subscription, notificationPayload)
      )
    )
      .then(() => res.status(200).json({ message: 'Notification sent successfully.' }))
      .catch(err => {
        console.error('Error sending notification, reason: ', err);
        res.status(500).json({ message: 'Failed to send notification.' });
      });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
