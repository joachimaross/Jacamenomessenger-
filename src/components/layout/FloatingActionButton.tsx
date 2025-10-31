
'use client';

import { FaPlus } from 'react-icons/fa';

export default function FloatingActionButton() {
  return (
    <button className="fixed bottom-20 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110">
      <FaPlus className="h-6 w-6" />
    </button>
  );
}
