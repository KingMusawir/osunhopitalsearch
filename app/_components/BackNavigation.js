'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackNavigation() {
  const router = useRouter();
  console.log(router);

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className='flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500'
    >
      <ArrowLeft className='w-5 h-5 mr-2' />
      Back
    </button>
  );
}
