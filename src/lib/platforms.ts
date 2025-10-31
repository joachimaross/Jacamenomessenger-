
import {
  FaTwitter, FaFacebook, FaInstagram, FaDiscord,
  FaTelegram, FaWhatsapp, FaSms, FaEnvelope,
} from 'react-icons/fa';

export const platforms = [
  { id: 'twitter', name: 'Twitter', icon: FaTwitter, color: 'text-blue-400' },
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  { id: 'discord', name: 'Discord', icon: FaDiscord, color: 'text-indigo-500' },
  { id: 'telegram', name: 'Telegram', icon: FaTelegram, color: 'text-blue-500' },
  { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-500' },
  { id: 'sms', name: 'SMS', icon: FaSms, color: 'text-gray-600' },
  { id: 'email', name: 'Email', icon: FaEnvelope, color: 'text-red-500' },
];
