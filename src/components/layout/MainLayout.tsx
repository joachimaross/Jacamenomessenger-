
import BottomNavbar from './BottomNavbar';
import FloatingActionButton from './FloatingActionButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="pb-16">{children}</main>
      <FloatingActionButton />
      <BottomNavbar />
    </div>
  );
}
