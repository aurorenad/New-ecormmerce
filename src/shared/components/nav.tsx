import { useState } from 'react';
import { Menu, X, LogIn, UserPlus, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/useCart';
import CartSidebar from './CartSidebar';
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <>
    <nav className='bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Left: Brand Logo */}
          <Link 
          to={`/`}
          className='text-2xl font-black tracking-tight text-gray-950 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0'>
            Jaribu
          </Link>

          {/* Right: Actions (Icons + Auth Buttons combined) */}
          <div className='flex items-center gap-1 sm:gap-3'>
            {/* Favorites Icon */}
            <button
              className='p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200'
              aria-label='Favorites'
            >
              <Heart className='w-5 h-5' />
            </button>

            {/* Shopping Cart Button */}
              <button 
                onClick={() => setIsCartOpen(true)} // 3. Open the sidebar on click
                className='p-2.5 text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-xl relative' 
                aria-label='Shopping Cart'
              >
                <ShoppingCart className='w-5 h-5' />
                
                {cartCount > 0 && (
                  <span className='absolute top-1.5 right-1.5 bg-gray-950 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white'>
                    {cartCount}
                  </span>
                )}
              </button>

            {/* Subtle Divider Line (Hidden on mobile) */}
            <div className='h-5 w-px bg-gray-200 mx-1 hidden md:block'></div>

            {/* Desktop Authentication Options */}
            <div className='hidden md:flex items-center gap-2'>
              <a
                href='/login'
                className='inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#127058] hover:bg-gray-50 rounded-xl transition-all px-3 py-2'
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </a>
              <a
                href='/register'
                className='inline-flex items-center gap-1.5 text-sm font-semibold bg-[#127058] hover:bg-[#0e5845] text-white px-4 py-2 rounded-xl transition-colors shadow-sm ml-1'
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </a>
            </div>

            {/* Hamburger Mobile Menu Toggle Button */}
            <div className='flex md:hidden ml-1'>
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
      </div>

      {/* Mobile Dynamic Dropdown Menu View Panel */}
      {isOpen && (
        <div className='md:hidden bg-white border-b border-gray-100 animate-fade-in'>
          <div className='px-4 pt-2 pb-5 space-y-3 shadow-inner'>
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

              {/* Mobile Sign Up */}
              <a
                href='/register'
                className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#127058] hover:bg-[#0e5845] transition-colors shadow-sm'
              >
                <UserPlus size={18} className='text-white/80' />
                <span>Create Free Account</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
    <CartSidebar />
    </>
  );
}
