import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string; // Optional message to show under the spinner
}

export default function LoadingSpinner({ message = 'Loading deals...' }: LoadingSpinnerProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] w-full p-6 text-center'>
      {/* The rotating spinner icon */}
      <Loader2 className='w-10 h-10 text-[#127058] animate-spin' />
      
      {/* Optional helper text */}
      {message && (
        <p className='mt-4 text-sm font-medium text-gray-500 tracking-wide'>
          {message}
        </p>
      )}
    </div>
  );
}
