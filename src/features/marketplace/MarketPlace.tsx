import { useState, useEffect, useMemo } from 'react';
import { baseListings } from '../../data/listings';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  ArrowUpDown,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react';
import LoadingSpinner from '../../shared/components/loading-spinner';
import { Link } from 'react-router-dom';
import Navbar from '../../shared/components/nav';
import Footer from '../../shared/components/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';
type ViewMode = 'grid' | 'list';

// ─── Trust / Value Proposition Badges ─────────────────────────────────────────
// const TRUST_BADGES = [
//   {
//     icon: ShieldCheck,
//     title: '12-Month Warranty',
//     desc: 'Every device is covered after purchase.',
//   },
//   {
//     icon: CreditCard,
//     title: 'Pay in Installments',
//     desc: 'Split into easy monthly payments.',
//   },
//   {
//     icon: BadgePercent,
//     title: 'AI-Powered Pricing',
//     desc: 'Fair valuations, no hidden markups.',
//   },
//   {
//     icon: Truck,
//     title: 'Fast Delivery',
//     desc: 'Shipped within 24–48 hours.',
//   },
// ];

// ─── Price Range Presets ───────────────────────────────────────────────────────
const PRICE_PRESETS = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $200', min: 0, max: 200 },
  { label: '$200 – $500', min: 200, max: 500 },
  { label: '$500 – $1,000', min: 500, max: 1000 },
  { label: 'Over $1,000', min: 1000, max: Infinity },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

// ─── Condition Badge Colors ────────────────────────────────────────────────────
function conditionBadge(condition?: string) {
  switch (condition?.toLowerCase()) {
    case 'excellent':
      return 'bg-emerald-100 text-emerald-700';
    case 'good':
      return 'bg-blue-100 text-blue-700';
    case 'fair':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  pricePresetIndex: number;
  onPricePresetChange: (i: number) => void;
  onReset: () => void;
  activeFilterCount: number;
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  pricePresetIndex,
  onPricePresetChange,
  onReset,
  activeFilterCount,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-30 lg:hidden'
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white z-40 shadow-2xl overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:h-auto lg:shadow-none lg:z-auto lg:w-64 lg:min-w-[16rem]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className='flex items-center justify-between p-5 border-b border-gray-100 lg:hidden'>
          <span className='font-bold text-gray-900 text-base'>Filters</span>
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <X className='w-4 h-4 text-gray-600' />
          </button>
        </div>

        <div className='p-5 space-y-7'>
          {/* Reset */}
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className='w-full flex items-center justify-between text-sm font-semibold text-[#127058] hover:text-[#0e5845] transition-colors'
            >
              <span>Clear all filters</span>
              <span className='bg-[#127058] text-white text-xs px-2 py-0.5 rounded-full'>
                {activeFilterCount}
              </span>
            </button>
          )}

          {/* Category Filter */}
          <div>
            <p className='text-xs font-black uppercase tracking-widest text-gray-400 mb-3'>
              Category
            </p>
            <ul className='space-y-1'>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onCategoryChange(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      selectedCategory === cat
                        ? 'bg-[#127058] text-white shadow-sm shadow-[#127058]/30'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {cat === 'All' ? 'All Devices' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div>
            <p className='text-xs font-black uppercase tracking-widest text-gray-400 mb-3'>
              Price Range
            </p>
            <ul className='space-y-1'>
              {PRICE_PRESETS.map((preset, i) => (
                <li key={preset.label}>
                  <button
                    onClick={() => onPricePresetChange(i)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      pricePresetIndex === i
                        ? 'bg-[#127058] text-white shadow-sm shadow-[#127058]/30'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {preset.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Financing Info Box */}
          <div className='bg-gradient-to-br from-[#6E9F94]/10 to-[#127058]/10 border border-[#127058]/20 rounded-2xl p-4'>
            <p className='text-xs font-black uppercase tracking-wider text-[#127058] mb-1.5'>
              Monthly Financing
            </p>
            <p className='text-xs text-gray-600 leading-relaxed'>
              Every device can be paid for over 12 months. No upfront payment
              needed — just pick a plan that fits your budget.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Device Card (Grid) ────────────────────────────────────────────────────────
function DeviceCard({ device }: { device: (typeof baseListings)[0] }) {
  const monthlyPrice = Math.ceil(device.current_price / 12);
  const discountPct = Math.round(
    ((device.original_price - device.current_price) / device.original_price) *
      100,
  );

  return (
    <div className='group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#127058]/30 transition-all duration-300 bg-white flex flex-col'>
      {/* Image */}
      <div className='relative h-48 w-full bg-gray-50 overflow-hidden'>
        <img
          src={device.img}
          alt={device.title}
          className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-500'
        />

        {/* Discount badge */}
        {discountPct > 0 && (
          <span className='absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm'>
            -{discountPct}%
          </span>
        )}

        {/* Category badge */}
        <span className='absolute top-3 left-3 bg-[#ef9f27] text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm capitalize'>
          {device.category}
        </span>

        {/* Condition badge (if present) */}
        {device.condition && (
          <span
            className={`absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${conditionBadge(device.condition)}`}
          >
            {device.condition}
          </span>
        )}
      </div>

      {/* Details */}
      <div className='p-4 flex flex-col flex-grow'>
        <h4 className='font-bold text-gray-800 text-base line-clamp-1 mb-1'>
          {device.title}
        </h4>

        {/* Star rating placeholder */}
        <div className='flex items-center gap-1 mb-3'>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3.5 h-3.5 ${s <= (device.rating ?? 4) ? 'text-[#EF9F27] fill-[#EF9F27]' : 'text-gray-200 fill-gray-200'}`}
            />
          ))}
          <span className='text-xs text-gray-400 ml-1'>
            ({device.reviewCount ?? '24'})
          </span>
        </div>

        {/* Pricing */}
        <div className='mt-auto'>
          <div className='flex items-baseline gap-2 mb-1'>
            <span className='text-xl font-extrabold text-gray-900'>
              ${device.current_price.toLocaleString()}
            </span>
            <span className='text-sm text-gray-400 line-through'>
              ${device.original_price.toLocaleString()}
            </span>
          </div>
          <p className='text-xs text-emerald-700 font-semibold bg-emerald-50 inline-block px-2 py-0.5 rounded-full mb-4'>
            or from ${monthlyPrice}/mo over 12 months
          </p>
        </div>

        <Link
          to={`/marketplace/${device.id}`}
          className='w-full bg-[#127058] hover:bg-[#0e5845] active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm shadow-sm text-center block'
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

// ─── Device Row (List View) ────────────────────────────────────────────────────
function DeviceRow({ device }: { device: (typeof baseListings)[0] }) {
  const monthlyPrice = Math.ceil(device.current_price / 12);
  const discountPct = Math.round(
    ((device.original_price - device.current_price) / device.original_price) *
      100,
  );

  return (
    <div className='group flex gap-4 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#127058]/30 transition-all duration-300 bg-white p-4'>
      {/* Image */}
      <div className='relative w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden'>
        <img
          src={device.img}
          alt={device.title}
          className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-500'
        />
        {discountPct > 0 && (
          <span className='absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className='flex flex-col flex-grow min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <div>
            <span className='text-xs font-bold text-[#ef9f27] capitalize'>
              {device.category}
            </span>
            <h4 className='font-bold text-gray-800 text-base line-clamp-1'>
              {device.title}
            </h4>
          </div>
          {device.condition && (
            <span
              className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${conditionBadge(device.condition)}`}
            >
              {device.condition}
            </span>
          )}
        </div>

        <div className='flex items-center gap-1 mt-1 mb-2'>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3 h-3 ${s <= (device.rating ?? 4) ? 'text-[#EF9F27] fill-[#EF9F27]' : 'text-gray-200 fill-gray-200'}`}
            />
          ))}
          <span className='text-xs text-gray-400 ml-1'>
            ({device.reviewCount ?? '24'})
          </span>
        </div>

        <div className='flex items-center justify-between mt-auto flex-wrap gap-2'>
          <div>
            <div className='flex items-baseline gap-2'>
              <span className='text-lg font-extrabold text-gray-900'>
                ${device.current_price.toLocaleString()}
              </span>
              <span className='text-sm text-gray-400 line-through'>
                ${device.original_price.toLocaleString()}
              </span>
            </div>
            <p className='text-xs text-emerald-700 font-semibold'>
              from ${monthlyPrice}/mo
            </p>
          </div>
          <Link
            to={`/marketplace/${device.id}`}
            className='bg-[#127058] hover:bg-[#0e5845] text-white font-semibold py-2 px-5 rounded-xl transition-all text-sm shadow-sm text-center'
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Marketplace Component ───────────────────────────────────────────────
export default function Marketplace() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pricePresetIndex, setPricePresetIndex] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(baseListings.map((d) => d.category))],
    [],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (pricePresetIndex !== 0) count++;
    return count;
  }, [selectedCategory, pricePresetIndex]);

  const filteredListings = useMemo(() => {
    const { min, max } = PRICE_PRESETS[pricePresetIndex];

    let results = baseListings.filter((device) => {
      const matchesSearch =
        device.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || device.category === selectedCategory;

      const matchesPrice =
        device.current_price >= min && device.current_price <= max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort
    if (sortBy === 'price-asc')
      results = [...results].sort((a, b) => a.current_price - b.current_price);
    else if (sortBy === 'price-desc')
      results = [...results].sort((a, b) => b.current_price - a.current_price);
    else if (sortBy === 'name-asc')
      results = [...results].sort((a, b) => a.title.localeCompare(b.title));

    return results;
  }, [searchQuery, selectedCategory, pricePresetIndex, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPricePresetIndex(0);
    setSortBy('default');
  };

  if (isLoading) {
    return <LoadingSpinner message='Fetching the best device deals...' />;
  }

  return (
    <>
      <Navbar />

      {/* ── Trust Banner ────────────────────────────────────────────────────── */}
      {/* <div className='border-b border-gray-100 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-6 py-3'>
          <div className='flex items-center justify-between gap-4 overflow-x-auto scrollbar-none'>
            {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className='flex items-center gap-2.5 flex-shrink-0'
              >
                <div className='w-8 h-8 rounded-full bg-[#127058]/10 flex items-center justify-center flex-shrink-0'>
                  <Icon className='w-4 h-4 text-[#127058]' />
                </div>
                <div className='hidden sm:block'>
                  <p className='text-xs font-bold text-gray-800 leading-tight'>
                    {title}
                  </p>
                  <p className='text-xs text-gray-500 leading-tight'>{desc}</p>
                </div>
                <p className='text-xs font-bold text-gray-700 sm:hidden'>
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* ── Page Body ────────────────────────────────────────────────────────── */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Header */}
        <div className='mb-7'>
          <h1 className='text-3xl font-black text-gray-900 tracking-tight'>
            Browse Devices
          </h1>
          <p className='text-gray-500 mt-1 text-sm max-w-xl'>
            Professionally refurbished phones, laptops, and tablets — all with
            transparent grading, a 12-month warranty, and flexible monthly
            payment plans.
          </p>
        </div>

        {/* Search + Toolbar Row */}
        <div className='flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center justify-between'>
          {/* Search */}
          <div className='relative w-full sm:w-80 md:w-96 group'>
            <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-950 transition-colors' />
            <input
              type='text'
              placeholder='Search by name, brand, or category...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl text-sm font-medium text-gray-950 placeholder:text-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-[#127058]/20'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            )}
          </div>

          {/* Right controls */}
          <div className='flex items-center gap-2'>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className='lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
            >
              <Filter className='w-4 h-4' />
              Filters
              {activeFilterCount > 0 && (
                <span className='bg-[#127058] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold'>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className='relative'>
              <button
                onClick={() => setSortDropdownOpen((v) => !v)}
                className='flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
              >
                <ArrowUpDown className='w-4 h-4' />
                <span className='hidden sm:inline'>
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {sortDropdownOpen && (
                <div className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[180px] py-1 overflow-hidden'>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? 'bg-[#127058]/10 text-[#127058] font-bold'
                          : 'text-gray-700 hover:bg-gray-50 font-medium'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View mode toggle */}
            <div className='flex items-center border border-gray-200 rounded-xl overflow-hidden'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#127058] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <LayoutGrid className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#127058] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <List className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Results count line */}
        <p className='text-sm text-gray-500 font-medium mb-5'>
          Showing{' '}
          <span className='text-gray-900 font-bold'>
            {filteredListings.length}
          </span>{' '}
          device{filteredListings.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && (
            <span>
              {' '}
              in{' '}
              <span className='text-[#127058] font-bold'>
                {selectedCategory}
              </span>
            </span>
          )}
        </p>

        {/* ── Layout: Sidebar + Content ────────────────────────────────────── */}
        <div className='flex gap-8 items-start'>
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            pricePresetIndex={pricePresetIndex}
            onPricePresetChange={setPricePresetIndex}
            onReset={handleReset}
            activeFilterCount={activeFilterCount}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main content area */}
          <div className='flex-1 min-w-0'>
            {/* Empty state */}
            {filteredListings.length === 0 && (
              <div className='text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200'>
                <SlidersHorizontal className='w-10 h-10 text-gray-300 mx-auto mb-3' />
                <p className='text-gray-600 font-semibold text-base'>
                  No devices match your filters.
                </p>
                <p className='text-gray-400 text-sm mt-1 mb-4'>
                  Try adjusting your search or clearing filters.
                </p>
                <button
                  onClick={handleReset}
                  className='text-sm text-white bg-[#127058] hover:bg-[#0e5845] font-bold px-5 py-2 rounded-xl transition-colors'
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Grid view */}
            {viewMode === 'grid' && filteredListings.length > 0 && (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                {filteredListings.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            )}

            {/* List view */}
            {viewMode === 'list' && filteredListings.length > 0 && (
              <div className='flex flex-col gap-4'>
                {filteredListings.map((device) => (
                  <DeviceRow key={device.id} device={device} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
