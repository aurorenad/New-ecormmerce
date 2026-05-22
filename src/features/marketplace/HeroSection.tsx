import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Navbar from '../../shared/components/nav';
import DeviceCard from './DeviceCard';
import Footer from '../../shared/components/Footer';
import LoadingSpinner from '../../shared/components/loading-spinner';
import { Link } from 'react-router-dom'; // Imported Link for React Router compatibility

export default function HeroSection() {
  // 1. Move state and lifecycle hooks to the top of the function
  const [isLoading, setIsLoading] = useState(true);

  // Fake network delay simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Conditional rendering handled cleanly outside of the return statement
  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner  />
        <Footer />
      </>
    );
  }

  // 3. Main layout rendered once loading concludes
  return (
    <>
      <Navbar />
      
      <main className='max-w-7xl mx-auto px-6 py-8'>
        {/* Parent Card Container with Relative Positioning */}
        <div className='relative overflow-hidden p-8 md:p-16 text-white rounded-3xl min-h-[480px] flex items-center shadow-xl'>
          
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
          <div className='relative z-20 flex flex-col items-start space-y-5 max-w-2xl'>
            <span className='inline-block bg-[#EF9F27] text-gray-950 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md'>
              New Arrival
            </span>

            <h1 className='text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-sm'>
              Renewed Tech, <br />
              <span className='text-[#EF9F27]'>Financed for you.</span>
            </h1>

            <p className='text-[#D5E4E1] text-base md:text-lg leading-relaxed max-w-lg drop-shadow-sm'>
              Get certified pre-owned devices with transparent trust scores and
              instant financing approvals.
            </p>
            
            {/* Updated to use React Router Link instead of an HTML <a> tag */}
            <Link 
              to="/marketplace" 
              className='group flex items-center gap-3 bg-[#EF9F27] text-gray-950 font-bold px-6 py-3.5 rounded-full hover:scale-101 transition-all duration-300 shadow-lg shadow-black/20'
            >
              <span>Browse Marketplace</span>
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>

          </div>
        </div>
      </main>

      <DeviceCard />

      <Footer />
    </>
  );
}
