
'use client'

import { useState } from 'react';
import BottomNavbar from './BottomNavbar';
import FloatingActionButton from './FloatingActionButton';
import UnifiedMessaging from '@/components/UnifiedMessaging';
import Camera from '@/components/Camera';
import AuraFeed from '@/components/AuraFeed';
import ThreadsFeed from '@/components/ThreadsFeed';
import ExploreHub from '@/components/ExploreHub';
import ProfilePage from '@/components/ProfilePage';
import StoryViewer from '@/components/StoryViewer';
import NotificationsPanel from '@/components/NotificationsPanel';
import ThemeToggle from '@/components/ThemeToggle';

interface MainLayoutProps {
  children?: React.ReactNode;
}

interface StoryMedia {
  type: 'image' | 'video';
  url: string;
}

interface StoryItem {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  media: StoryMedia;
  timestamp: Date;
  expiresAt: Date;
  likes: number;
  comments: number;
}

export default function MainLayout({ children }: MainLayoutProps = {}) {
  const [activeTab, setActiveTab] = useState('Chats');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleCapture = (media: { type: 'photo' | 'video'; url: string }) => {
    // Add captured media to stories
    const newStory: StoryItem = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      avatar: '/default-avatar.png',
      media: {
        type: media.type === 'photo' ? 'image' : 'video',
        url: media.url
      },
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      likes: 0,
      comments: 0
    };
    setStories(prev => [newStory, ...prev]);
    setIsCameraOpen(false);
  };

  const renderContent = () => {
    if (showStoryViewer) {
      return (
        <StoryViewer
          stories={stories}
          initialIndex={currentStoryIndex}
          onClose={() => setShowStoryViewer(false)}
          onLike={(storyId) => console.log('Liked story:', storyId)}
          onComment={(storyId) => console.log('Commented on story:', storyId)}
          onShare={(storyId) => console.log('Shared story:', storyId)}
        />
      );
    }

    switch (activeTab) {
      case 'Chats':
        return <UnifiedMessaging />;
      case 'Stories':
        return (
          <div className="h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Stories</h2>
              <button
                onClick={() => setIsCameraOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                Create Story
              </button>
            </div>
            <div className="space-y-4">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setCurrentStoryIndex(index);
                    setShowStoryViewer(true);
                  }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer"
                >
                  <p className="font-medium">{story.username}</p>
                  <p className="text-sm text-gray-500">{story.timestamp.toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
            <Camera
              isOpen={isCameraOpen}
              onClose={() => setIsCameraOpen(false)}
              onCapture={handleCapture}
            />
          </div>
        );
      case 'Feed':
        return <AuraFeed />;
      case 'Threads':
        return <ThreadsFeed />;
      case 'Explore':
        return <ExploreHub />;
      case 'Profile':
        return <ProfilePage />;
      case 'Notifications':
        return <NotificationsPanel />;
      default:
        return children;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <main className="pb-16">{renderContent()}</main>
      <FloatingActionButton />
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
