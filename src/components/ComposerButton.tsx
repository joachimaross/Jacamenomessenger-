
import { FaPlus } from 'react-icons/fa';

interface ComposerButtonProps {
  setShowComposer: (show: boolean) => void;
}

export default function ComposerButton({ setShowComposer }: ComposerButtonProps) {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setShowComposer(true)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
      >
        <FaPlus className="h-5 w-5" />
        <span>Compose New Message</span>
      </button>
    </div>
  );
}
