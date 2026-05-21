import { ArrowRight } from 'lucide-react';
import Navbar from '../../shared/components/nav';
import DeviceCard from './DeviceCard';
import Footer from '../../shared/components/Footer';

export default function HeroSection() {
  return (
    <>
      <Navbar />
      <main className='max-w-7xl mx-auto px-6 py-8'>
        {/* 1. Parent Card Container with Relative Positioning */}
        <div className='relative overflow-hidden p-8 md:p-16 text-white rounded-3xl min-h-[480px] flex items-center shadow-xl'>
          {/* 2. Background Image Layer */}
          <div className='absolute inset-0 z-0'>
            <img
              src='./macbook.jpg'
              alt='macbook on desk'
              className='w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-700'
            />
          </div>

          {/* 3. Brand Color Overlay (Mix Blend Mode) */}
          {/* Uses multiply blend mode so the darks of the image show through your brand colors */}
          <div className='absolute inset-0 z-10 bg-gradient-to-br from-[#6E9F94]/90 via-[#127058]/95 to-[#0b4738] mix-blend-multiply'></div>

          {/* 4. Second Subtle Gradient Overlay (For Extra Text Readability) */}
          <div className='absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-transparent'></div>

          {/* 5. Foreground Content Layer (Elevated with higher z-index) */}
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

            <button className='group flex items-center gap-3 bg-[#EF9F27] text-gray-950 font-bold px-6 py-3.5 rounded-full hover: hover:scale-101 transition-all duration-300 shadow-lg shadow-black/20'>
              Browse Marketplace
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
          </div>
        </div>
      </main>

      <DeviceCard />

      <Footer />
    </>
  );
}
