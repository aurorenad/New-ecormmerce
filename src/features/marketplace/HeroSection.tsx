import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Navbar from '../../shared/components/nav';
import DeviceCard from './DeviceCard';
import Footer from '../../shared/components/Footer';
import LoadingSpinner from '../../shared/components/loading-spinner';
import { Link } from 'react-router-dom';
import AboutPage from './AboutPage';
import SupportChatWidget from './components/SupportChatWidget';

export default function HeroSection() {
  // 1. Move state and lifecycle hooks to the top of the function
  const [isLoading, setIsLoading] = useState(true);

  // Fake network delay simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // 2. Conditional rendering handled cleanly outside of the return statement
  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </>
    );
  }

  // 3. Main layout rendered once loading concludes
  return (
    <>
      <Navbar />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-4'>
        {/* Parent Card Container with Relative Positioning */}
        <div className='relative overflow-hidden p-5 md:p-8 text-white rounded-2xl min-h-[200px] md:min-h-[240px] flex items-center shadow-lg'>
          {/* Background Image Layer */}
          <div className='absolute inset-0 z-0'>
            <img
              src='./macbook.jpg'
              alt='macbook on desk'
              className='w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-700'
            />
          </div>

          {/* Brand Color Overlay (Mix Blend Mode) */}
          <div className='absolute inset-0 z-10 bg-gradient-to-br from-[#6E9F94]/90 via-[#127058]/95 to-[#0b4738] mix-blend-multiply'></div>

          {/* Second Subtle Gradient Overlay (For Extra Text Readability) */}
          <div className='absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-transparent'></div>

          {/* Foreground Content Layer */}
          <div className='relative z-20 flex flex-col items-start space-y-2 md:space-y-3 max-w-xl'>
            <span className='inline-block bg-[#EF9F27] text-gray-950 text-[10px] md:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md'>
              Quality Devices. Flexible Payments.
            </span>

            <h1 className='text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight'>
              Affordable tech,{' '}
              <span className='text-[#EF9F27]'>fairly priced.</span>
              <br />
              No compromise.
            </h1>

            <p className='text-[#D5E4E1] text-sm md:text-base leading-snug max-w-md drop-shadow-sm line-clamp-2 md:line-clamp-none'>
              Buy and sell certified refurbished electronics with transparent grading,
              AI pricing, and flexible monthly payments.
            </p>

            <div className='flex flex-wrap gap-2 pt-1'>
              <Link
                to='/marketplace'
                className='inline-flex items-center gap-1.5 bg-[#EF9F27] hover:bg-[#d98f20] text-gray-950 text-sm font-bold px-4 py-2 rounded-full transition-all shadow-md shadow-[#EF9F27]/20 active:scale-[0.97]'
              >
                Shop Devices <ArrowRight className='w-3.5 h-3.5' />
              </Link>
              <Link
                to='/Sell-Your-Device'
                className='inline-flex items-center gap-1.5 border border-white/30 hover:border-white/60 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all'
              >
                Sell Your Device <ChevronRight className='w-3.5 h-3.5' />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <DeviceCard />

      <AboutPage />

      <Footer />

      <SupportChatWidget />
    </>
  );
}
