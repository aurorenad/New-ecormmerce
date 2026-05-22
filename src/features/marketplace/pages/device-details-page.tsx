import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseListings } from '../../../data/listings';
import {
  ArrowLeft,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  ShoppingCart,
} from 'lucide-react';
import { useCart } from '../../../context/useCart';
import { Link } from "react-router-dom";


export default function DeviceDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [financingMonths, setFinancingMonths] = useState(12);

  // 3. Find the matching listing by converting the URL string ID into a number
  const device =
    baseListings.find((item) => item.id === Number(id)) || baseListings[0];

  const monthlyInstallment = (device.current_price / financingMonths).toFixed(
    0,
  );
  const totalSavings = device.original_price - device.current_price;

  return (
    <>
    <div className='min-h-screen bg-gray-50/50 pb-12'>
      <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
        {/* Back Link */}
        <Link
          to={`/marketplace`}
          className='inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#127058] transition-colors mb-6 group'
        >
          <ArrowLeft
            size={16}
            className='transition-transform group-hover:-translate-x-1'
          />
          <span>Back to Marketplace</span>
        </Link>

        {/* Main Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start'>
          {/* Left Column: Product Image Gallery Layout */}
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-center overflow-hidden min-h-[350px] sm:min-h-[450px] relative'>
            <img
              src={device.img}
              alt={device.title}
              className='object-contain max-h-[400px] w-full hover:scale-102 transition-transform duration-300'
            />
            {/* Category Badge */}
            <span className='absolute top-6 left-6 bg-[#ef9f27] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm capitalize tracking-wide'>
              {device.category}
            </span>
          </div>

          {/* Right Column: Device Purchasing Details Info */}
          <div className='flex flex-col'>
            {/* Title & Taglines */}
            <h1 className='text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-tight'>
              {device.title}
            </h1>

            {/* Price Presentation Block */}
            <div className='mt-4 flex items-baseline gap-3 flex-wrap'>
              <span className='text-3xl font-black text-gray-950'>
                ${device.current_price}
              </span>
              <span className='text-lg text-gray-400 line-through font-medium'>
                ${device.original_price}
              </span>
              <span className='text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg'>
                Save ${totalSavings}
              </span>
            </div>

            <p className='text-gray-600 mt-6 leading-relaxed font-medium text-sm sm:text-base'>
              {device.description}
            </p>

            {/* Technical Quick Specs Table Section */}
            <div className='mt-6 border border-gray-100 bg-white rounded-2xl p-4 shadow-inner-sm'>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>
                Device Specifications
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                {device.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className='border-b border-gray-50 pb-2 last:border-0'
                  >
                    <p className='text-xs text-gray-400 font-medium'>
                      {spec.label}
                    </p>
                    <p className='text-sm text-gray-900 font-bold mt-0.5'>
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Flexible Financing Plan Selector UI Toggle */}
            <div className='mt-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
              <div className='flex items-center gap-2 text-[#127058] mb-3'>
                <CreditCard size={18} />
                <h3 className='font-bold text-sm text-gray-950'>
                  Flexible Financing Plan
                </h3>
              </div>
              <p className='text-xs text-gray-500 font-medium mb-4'>
                Choose a plan duration that fits your monthly checkout budget
                comfortably.
              </p>

              {/* Radio Action Choice Buttons */}
              <div className='grid grid-cols-3 gap-3'>
                {[3, 6, 12].map((months) => (
                  <button
                    key={months}
                    type='button'
                    onClick={() => setFinancingMonths(months)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      financingMonths === months
                        ? 'border-[#127058] bg-[#127058]/5 text-[#127058] ring-2 ring-[#127058]/20'
                        : 'border-gray-200 bg-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {months} Months
                  </button>
                ))}
              </div>

              {/* Installment Pricing Summary banner text block */}
              <div className='mt-4 pt-4 border-t border-gray-50 flex items-center justify-between'>
                <span className='text-xs font-semibold text-gray-500'>
                  Estimated payment:
                </span>
                <span className='text-base font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg'>
                  From ${monthlyInstallment}/mo
                </span>
              </div>
            </div>

            {/* Call To Action Buttons (Add To Cart) */}
            <div className='mt-8'>
              <button
                onClick={() => addToCart(device)} // Pass the whole loaded item object structure here
                className='w-full bg-[#127058] hover:bg-[#0e5845] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2.5 group text-base'
              >
                <ShoppingCart
                  size={20}
                  className='transition-transform group-hover:scale-110'
                />
                <span>Add Device to Cart</span>
              </button>
            </div>

            {/* Consumer Trust Guarantees Grid Row */}
            <div className='mt-6 grid grid-cols-3 gap-2 text-center'>
              <div className='flex flex-col items-center p-3 bg-gray-50 rounded-xl'>
                <Shield size={18} className='text-[#127058] mb-1' />
                <span className='text-[10px] font-bold text-gray-700 leading-snug'>
                  12-Mo Warranty
                </span>
              </div>
              <div className='flex flex-col items-center p-3 bg-gray-50 rounded-xl'>
                <Truck size={18} className='text-[#127058] mb-1' />
                <span className='text-[10px] font-bold text-gray-700 leading-snug'>
                  Free Shipping
                </span>
              </div>
              <div className='flex flex-col items-center p-3 bg-gray-50 rounded-xl'>
                <RefreshCw size={18} className='text-[#127058] mb-1' />
                <span className='text-[10px] font-bold text-gray-700 leading-snug'>
                  30-Day Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
