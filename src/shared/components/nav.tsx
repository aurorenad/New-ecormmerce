import { useState } from 'react';
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Search,
  Heart,
  ShoppingCart
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Brand Logo */}
          <div className='text-2xl font-black tracking-tight text-gray-950 cursor-pointer hover:opacity-80 transition-opacity'>
            Jaribu
          </div>

          {/* Modern Search Bar (Hidden on small mobile screens) */}
          <div className='relative hidden sm:block group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-950 transition-colors' />
            <input
              type='text'
              placeholder='Search devices, brands, or financing plans...'
              className='w-80 md:w-96 pl-10 pr-4 py-2.5 bg-gray-100/70 border border-transparent rounded-xl text-sm font-medium text-gray-950 placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-gray-950'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-2 sm:gap-4'>
            {/* Mobile Search Trigger Icon (Only visible on tiny screens) */}
            <button
              className='p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors sm:hidden'
              aria-label='Search'
            >
              <Search className='w-5 h-5' />
            </button>

            <button
              className='p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200'
              aria-label='Favorites'
            >
              <Heart className='w-5 h-5' />
            </button>

            <button
              className='p-2 text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-xl transition-all duration-200 relative'
              aria-label='Shopping Cart'
            >
              <ShoppingCart className='w-5 h-5' />
              {/* Active Cart Notification Badge */}
              <span className='absolute top-1 right-1 bg-gray-950 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white'>
                3
              </span>
            </button>

            <div className='h-6 w-px bg-gray-200 mx-1 hidden sm:block'></div>
          </div>

          {/* Desktop Authentication Call to Action Buttons */}
          <div className='hidden md:flex items-center gap-4'>
            <a
              href='/login'
              className='inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#127058] transition-colors px-3 py-2'
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </a>
            <a
              href='/register'
              className='inline-flex items-center gap-1.5 text-sm font-semibold bg-[#127058] hover:bg-[#0e5845] text-white px-4 py-2 rounded-xl transition-colors shadow-sm'
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </a>
          </div>

          {/* Hamburger Mobile Menu Toggle Button */}
          <div className='flex md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-[#127058] hover:bg-gray-50 focus:outline-none transition-all'
              aria-expanded={isOpen}
            >
              <span className='sr-only'>Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dynamic Dropdown Menu View Panel */}
      {isOpen && (
        <div className='md:hidden bg-white border-b border-gray-100 animate-fade-in'>
          <div className='px-4 pt-2 pb-4 space-y-3 shadow-inner'>

            {/* Separator Divider Line */}
            <div className='border-t border-gray-100 my-2'></div>

            {/* Styled Authentication Menu Options */}
            <div className='space-y-2'>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1'>
                Account Portal
              </p>

              {/* Mobile Sign In */}
              <a
                href='/login'
                className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors'
              >
                <LogIn size={18} className='text-[#127058]' />
                <span>Sign In to Account</span>
              </a>

              {/* Mobile Sign Up (Uses full platform primary green color) */}
              <a
                href='/register'
                className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#127058] hover:bg-[#0e5845] transition-colors shadow-sm'
              >
                <UserPlus size={18} className='text-[#ef9f27]' />
                <span>Create Free Account</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
