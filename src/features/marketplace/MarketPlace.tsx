import { useState, useEffect } from 'react';
import { baseListings } from '../../data/listings';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../shared/components/loading-spinner';
import { Link } from "react-router-dom";
import Navbar from '../../shared/components/nav';
import Footer from '../../shared/components/Footer'; 

export default function Marketplace() {
  const [isLoading, setIsLoading] = useState(true);
  // 1. Define states for search text and category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fake network delay simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // 1. If it's loading, show the spinner instead of the items
  if (isLoading) {
    return <LoadingSpinner message='Fetching the best device deals...' />;
  }

  // 2. Extract unique categories from baseListings dynamically for the dropdown
  const categories = [
    'All',
    ...new Set(baseListings.map((device) => device.category)),
  ];

  // 3. Filter the listings based on search text AND selected category
  const filteredListings = baseListings.filter((device) => {
    const matchesSearch =
      device.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || device.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
    <Navbar />
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Header Section */}
      <div className='mb-8'>
        <Link
          to={`/`}
          className='inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#127058] transition-colors mb-6 group'
        >
          <ArrowLeft
            size={16}
            className='transition-transform group-hover:-translate-x-1'
          />
          <span>Back</span>
        </Link>
        <h3 className='text-3xl font-bold bg-gradient-to-r from-[#6E9F94] to-[#127058] bg-clip-text text-black'>
          Browse Deals
        </h3>
        <p className='text-gray-600 mt-1 font-medium'>
          Upgrade your lifestyle with expert-refurbished devices. Transparent
          grading, 12-month warranty, and flexible financing that fits your
          budget.
        </p>
      </div>

      {/* Controls Section: Search Bar & Filter Dropdown */}
      <div className='flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between'>
        {/* Search Input Control */}
        <div className='relative w-full sm:w-80 md:w-96 group'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-950 transition-colors' />
          <input
            type='text'
            placeholder='Search devices, brands, or plans...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search state
            className='w-full pl-10 pr-4 py-2.5 bg-gray-100/70 border border-transparent rounded-xl text-sm font-medium text-gray-950 placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-gray-950'
          />
        </div>

        {/* Category Filter Dropdown Control */}
        <div className='relative w-full sm:w-48 flex items-center gap-2'>
          <SlidersHorizontal className='w-4 h-4 text-gray-500 hidden sm:block' />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)} // Update category state
            className='w-full bg-gray-100/70 border border-transparent rounded-xl px-4 py-2.5 text-sm font-medium text-gray-950 outline-none cursor-pointer focus:bg-white focus:border-gray-950 transition-all'
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State Notice */}
      {filteredListings.length === 0 && (
        <div className='text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200'>
          <p className='text-gray-500 font-medium'>
            No devices found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className='mt-2 text-sm text-[#127058] font-bold hover:underline'
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Listings Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredListings.map((device) => (
          <div
            key={device.id}
            className='border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col'
          >
            {/* Image Container */}
            <div className='relative h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden'>
              <img
                src={device.img}
                alt={device.title}
                className='object-cover w-full h-full hover:scale-105 transition-transform duration-300'
              />

              {/* Category Badge */}
              <span className='absolute top-3 left-3 bg-[#ef9f27] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm capitalize'>
                {device.category}
              </span>
            </div>

            {/* Device Details */}
            <div className='p-4 flex flex-col flex-grow'>
              <h4 className='font-bold text-gray-800 text-lg line-clamp-1 mb-2'>
                {device.title}
              </h4>

              {/* Pricing section with installment context */}
              <div className='flex items-baseline gap-2 mb-4 mt-auto'>
                <span className='text-xl font-extrabold text-gray-900'>
                  ${device.current_price}
                </span>
                <span className='text-sm text-gray-400 line-through'>
                  ${device.original_price}
                </span>
                <span className='text-xs text-emerald-600 font-medium ml-auto bg-emerald-50 px-2 py-0.5 rounded'>
                  From ${(device.current_price / 12).toFixed(0)}/mo
                </span>
              </div>

              {/* View Details CTA */}
              <Link 
                to={`/marketplace/${device.id}`}
                className="w-full bg-[#127058] hover:bg-[#0e5845] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm text-center block"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
