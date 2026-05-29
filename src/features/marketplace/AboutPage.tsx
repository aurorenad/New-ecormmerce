import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  CreditCard,
  Recycle,
  ArrowRight,
  CheckCircle2,
  Users,
  Package,
  TrendingUp,
  Smartphone,
  Search,
  BadgeCheck,
  Banknote,
  Truck,
  HeartHandshake,
  ChevronRight,
} from 'lucide-react';
import TestimonialsSection from './TestimonialsSection';
// import Navbar from '../../shared/components/nav';
// import Footer from '../../shared/components/Footer';

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '2,400+', label: 'Devices Sold', icon: Package },
  { value: '1,800+', label: 'Happy Customers', icon: Users },
  { value: '98%', label: 'Satisfaction Rate', icon: TrendingUp },
  { value: '12month', label: 'Warranty on All Devices', icon: ShieldCheck },
];

const HOW_IT_WORKS_BUYER = [
  {
    step: '01',
    icon: Search,
    title: 'Browse & Filter',
    desc: 'Search our curated catalog of professionally inspected devices. Filter by category, condition grade, and price range to find exactly what fits your needs and budget.',
  },
  {
    step: '02',
    icon: BadgeCheck,
    title: 'Review the Trust Score',
    desc: 'Every device comes with an AI-generated trust score, a detailed condition report, battery health data, and verified specs — no hidden surprises.',
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Choose Your Payment Plan',
    desc: 'Pay in full or split into monthly installments. Our AI-powered financing engine approves plans instantly based on your profile — no long forms.',
  },
  {
    step: '04',
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Your device ships within 24–48 hours, fully packaged and insured. Track it every step of the way from our warehouse to your door.',
  },
];

const HOW_IT_WORKS_SELLER = [
  {
    step: '01',
    icon: Smartphone,
    title: 'Describe Your Device',
    desc: 'Fill in our guided 5-step form with your device details — model, storage, condition, photos, and asking price. Takes under 5 minutes.',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'AI Valuation',
    desc: 'Our LangChain-powered engine cross-references your submission against live market data and condition benchmarks to give you a fair, transparent offer.',
  },
  {
    step: '03',
    icon: Banknote,
    title: 'Accept & Get Paid',
    desc: 'Accept the offer and choose your payout method — mobile money, bank transfer, or store credit. Payment is released once we verify the device.',
  },
  {
    step: '04',
    icon: HeartHandshake,
    title: 'We Handle the Rest',
    desc: 'Our team collects, refurbishes, and relists the device. Your device gets a second life and you get cash — everyone wins.',
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Radical Transparency',
    desc: 'Every device is graded using a standardized rubric (Grade A–D). Condition reports are public and detailed — no vague descriptions, no surprises.',
  },
  {
    icon: Cpu,
    title: 'AI-Assisted Fairness',
    desc: 'We use LangChain and live market data to set prices and financing terms. No human bias, no inflated markups. Just data-driven decisions.',
  },
  {
    icon: CreditCard,
    title: 'Genuine Accessibility',
    desc: 'Installment financing means a quality laptop or phone is reachable for anyone — not just those who can pay everything upfront.',
  },
  {
    icon: Recycle,
    title: 'Circular Economy',
    desc: 'Every refurbished device we sell prevents e-waste and reduces the carbon cost of manufacturing new electronics. Good for you, better for the planet.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Amina Uwase',
    role: 'Freelance Designer, Kigali',
    avatar:
      'https://api.dicebear.com/7.x/notionists/svg?seed=Amina&backgroundColor=b6e3f4',
    rating: 5,
    text: 'I got a MacBook Air M2 for $799 and chose to pay $67 a month. I was skeptical at first — but the device arrived exactly as described, Grade B with 42 battery cycles. It runs perfectly. ReviveTech changed how I think about buying tech.',
    device: 'MacBook Air M2',
  },
  {
    name: 'Eric Nzeyimana',
    role: 'Software Engineer, Musanze',
    avatar:
      'https://api.dicebear.com/7.x/notionists/svg?seed=Eric&backgroundColor=c0aede',
    rating: 5,
    text: 'Sold my old Galaxy S22 through ReviveTech and got an offer within 18 hours. The AI valuation was actually higher than what I expected. Payment hit my MTN Mobile Money the same day I dropped off the phone. Zero stress.',
    device: 'Sold: Galaxy S22',
  },
  {
    name: 'Claudine Mukamana',
    role: 'Student, University of Rwanda',
    avatar:
      'https://api.dicebear.com/7.x/notionists/svg?seed=Claudine&backgroundColor=d1f0b1',
    rating: 5,
    text: 'As a student I could never afford a new iPad. The installment plan made it possible — I pay less than my weekly transport budget. The device was clean, the warranty gave me peace of mind, and the whole process took 20 minutes.',
    device: 'iPad Air 5th Gen',
  },
  {
    name: 'Patrick Habimana',
    role: 'Small Business Owner, Huye',
    avatar:
      'https://api.dicebear.com/7.x/notionists/svg?seed=Patrick&backgroundColor=ffd5dc',
    rating: 4,
    text: 'Bought a Google Pixel 8 Pro for my business. The trust score system is the best part — I could see the battery health, condition grade, and even photos of every angle. I knew exactly what I was getting before it arrived.',
    device: 'Google Pixel 8 Pro',
  },
  {
    name: 'Josiane Ingabire',
    role: 'Teacher, Rubavu',
    avatar:
      'https://api.dicebear.com/7.x/notionists/svg?seed=Josiane&backgroundColor=ffdfbf',
    rating: 5,
    text: 'The customer support team helped me choose the right laptop for teaching purposes. I appreciated the honest recommendation — they actually told me a cheaper model would suit me better. That kind of honesty is rare.',
    device: 'MacBook Air M2',
  },
  {
    name: 'Olivier Nkurunziza',
    role: 'Content Creator, Kigali',
    avatar:
      'https://api.dicebear.com/7.x/notionists/svg?seed=Olivier&backgroundColor=b6e3f4',
    rating: 5,
    text: "I sold two old cameras and a Nintendo Switch in one go. Each got individually assessed and priced. The whole thing felt professional, fast, and genuinely fair. I've already referred four friends.",
    device: 'Sold: 2 Cameras + Switch',
  },
];

const TEAM = [
  {
    name: 'Aurore Nadine Ishimwe',
    role: 'CEO',
    avatar: 'https://res.cloudinary.com/dk7aohjpm/image/upload/v1779798096/Aurore_iagtbs.jpg',
    bio: 'Former fintech engineer with a passion for making technology accessible across Africa.',
  },
  {
    name: 'Emmanuel Ntakirutimana',
    role: 'Head of Operations',
    avatar: 'https://res.cloudinary.com/dk7aohjpm/image/upload/v1779798104/Emmy_j6awhb.png',
    bio: 'Supply chain expert who built our refurbishment quality process from the ground up.',
  },
  {
    name: 'Uwase Rwagasana Kellia',
    role: 'Financial Officer',
    avatar: 'https://res.cloudinary.com/dk7aohjpm/image/upload/v1779798097/kellia_jdloqx.jpg',
    bio: 'Built our payment and risk infrastructure',
  },
  {
    name: 'Igiraneza Aubin Joanes',
    role: 'Lead AI Engineer',
    avatar: 'https://res.cloudinary.com/dk7aohjpm/image/upload/v1779798096/Aubin_cmswkh.jpg',
    bio: 'Built our LangChain valuation and credit-scoring pipeline.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className='inline-flex items-center gap-2 text-[#127058] text-xs font-black uppercase tracking-widest mb-3'>
      <span className='w-5 h-0.5 bg-[#127058] rounded-full' />
      {children}
      <span className='w-5 h-0.5 bg-[#127058] rounded-full' />
    </p>
  );
}

// function StarRow({ count }: { count: number }) {
//   return (
//     <div className='flex gap-0.5'>
//       {[1, 2, 3, 4, 5].map((s) => (
//         <Star
//           key={s}
//           className={`w-4 h-4 ${s <= count ? 'text-[#EF9F27] fill-[#EF9F27]' : 'text-gray-200 fill-gray-200'}`}
//         />
//       ))}
//     </div>
//   );
// }

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* <Navbar /> */}

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section className='bg-[#F9FAFB] border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-6 py-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className='flex flex-col items-center text-center gap-3'
              >
                <div className='w-12 h-12 rounded-2xl bg-[#127058]/10 flex items-center justify-center'>
                  <Icon className='w-6 h-6 text-[#127058]' />
                </div>
                <div>
                  <p className='text-3xl font-black text-gray-900'>{value}</p>
                  <p className='text-sm text-gray-500 font-medium mt-0.5'>
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────────────── */}
      <section className='max-w-7xl mx-auto px-6 py-20'>
        <div className='grid md:grid-cols-2 gap-14 items-center'>
          {/* Left text */}
          <div>
            <SectionLabel>Our Mission</SectionLabel>
            <h2 className='text-3xl md:text-4xl font-black text-gray-900 leading-tight mt-2'>
              Quality devices shouldn't be a{' '}
              <span className='text-[#127058]'>privilege.</span>
            </h2>
            <p className='text-gray-600 mt-5 leading-relaxed'>
              In most markets, buying a quality laptop or smartphone means
              paying hundreds of dollars upfront — money most people simply
              don't have available at once. Meanwhile, millions of usable
              devices sit in drawers, slowly becoming e-waste.
            </p>
            <p className='text-gray-600 mt-4 leading-relaxed'>
              ReviveTech was built to fix both problems at once. We refurbish,
              fairly price, and finance devices so more people can access the
              tools they need — and we give sellers a fast, honest way to turn
              their old tech into money.
            </p>
            <ul className='mt-6 space-y-3'>
              {[
                'Every device professionally inspected & graded',
                'AI-powered pricing based on live market data',
                'Installment plans that fit any income level',
                'E-waste reduced with every device we refurbish',
              ].map((item) => (
                <li
                  key={item}
                  className='flex items-start gap-3 text-sm text-gray-700 font-medium'
                >
                  <CheckCircle2 className='w-4 h-4 text-[#127058] flex-shrink-0 mt-0.5' />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right visual */}
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#6E9F94]/20 to-[#127058]/10 rounded-3xl' />
            <div className='relative bg-gradient-to-br from-[#0b4738] to-[#127058] rounded-3xl p-8 text-white overflow-hidden'>
              <div className='absolute top-0 right-0 w-40 h-40 bg-[#EF9F27]/10 rounded-full blur-2xl' />
              <p className='text-[#a8d5c5] text-xs font-black uppercase tracking-widest mb-4'>
                What sets us apart
              </p>
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className='flex gap-4 mb-6 last:mb-0'>
                  <div className='w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0'>
                    <Icon className='w-4 h-4 text-[#EF9F27]' />
                  </div>
                  <div>
                    <p className='font-bold text-sm text-white'>{title}</p>
                    <p className='text-[#a8d5c5] text-xs mt-1 leading-relaxed'>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works: Buyers ─────────────────────────────────────────────── */}
      <section className='bg-gray-50 border-y border-gray-100 py-20'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center mb-14'>
            <SectionLabel>For Buyers</SectionLabel>
            <h2 className='text-3xl md:text-4xl font-black text-gray-900 mt-2'>
              How buying works
            </h2>
            <p className='text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed'>
              From browsing to delivery — a clear, simple process with no hidden
              steps.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {HOW_IT_WORKS_BUYER.map(({ step, icon: Icon, title, desc }, i) => (
              <div
                key={step}
                className='relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#127058]/30 transition-all duration-300'
              >
                {/* Connector arrow between steps */}
                {i < HOW_IT_WORKS_BUYER.length - 1 && (
                  <ArrowRight className='absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 hidden lg:block z-10' />
                )}
                <div className='flex items-start justify-between mb-4'>
                  <div className='w-11 h-11 bg-[#127058]/10 rounded-xl flex items-center justify-center'>
                    <Icon className='w-5 h-5 text-[#127058]' />
                  </div>
                  <span className='text-3xl font-black text-gray-100'>
                    {step}
                  </span>
                </div>
                <h3 className='font-bold text-gray-900 text-base mb-2'>
                  {title}
                </h3>
                <p className='text-gray-500 text-sm leading-relaxed'>{desc}</p>
              </div>
            ))}
          </div>

          <div className='text-center mt-10'>
            <Link
              to='/marketplace'
              className='inline-flex items-center gap-2 bg-[#127058] hover:bg-[#0e5845] text-white font-bold px-7 py-3.5 rounded-full transition-all shadow-sm active:scale-[0.97]'
            >
              Browse Devices <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works: Sellers ────────────────────────────────────────────── */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center mb-14'>
            <SectionLabel>For Sellers</SectionLabel>
            <h2 className='text-3xl md:text-4xl font-black text-gray-900 mt-2'>
              Turn your old device into cash
            </h2>
            <p className='text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed'>
              List in minutes, get an AI valuation, and receive payment fast.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {HOW_IT_WORKS_SELLER.map(({ step, icon: Icon, title, desc }, i) => (
              <div
                key={step}
                className='relative bg-[#0b4738]/[0.03] border border-[#127058]/15 rounded-2xl p-6 hover:bg-[#0b4738]/[0.06] transition-all duration-300'
              >
                {i < HOW_IT_WORKS_SELLER.length - 1 && (
                  <ArrowRight className='absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-[#127058]/30 hidden lg:block z-10' />
                )}
                <div className='flex items-start justify-between mb-4'>
                  <div className='w-11 h-11 bg-[#127058] rounded-xl flex items-center justify-center'>
                    <Icon className='w-5 h-5 text-white' />
                  </div>
                  <span className='text-3xl font-black text-[#127058]/10'>
                    {step}
                  </span>
                </div>
                <h3 className='font-bold text-gray-900 text-base mb-2'>
                  {title}
                </h3>
                <p className='text-gray-500 text-sm leading-relaxed'>{desc}</p>
              </div>
            ))}
          </div>

          <div className='text-center mt-10'>
            <Link
              to='/Sell-Your-Device'
              className='inline-flex items-center gap-2 border-2 border-[#127058] text-[#127058] hover:bg-[#127058] hover:text-white font-bold px-7 py-3.5 rounded-full transition-all active:scale-[0.97]'
            >
              Sell a Device <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <TestimonialsSection testimonials={TESTIMONIALS} />

      {/* ── Team ─────────────────────────────────────────────────────────────── */}
      <section className='max-w-7xl mx-auto px-6 py-20'>
        <div className='text-center mb-14'>
          <SectionLabel>The Team</SectionLabel>
          <h2 className='text-3xl md:text-4xl font-black text-gray-900 mt-2'>
            Built by people who care
          </h2>
          <p className='text-gray-500 mt-3 max-w-xl mx-auto text-sm'>
            A small, focused team combining fintech, logistics, and AI
            expertise.
          </p>
        </div>

        <div className='flex flex-wrap justify-center gap-6'>
          {TEAM.map(({ name, role, avatar, bio }) => (
            <div
              key={name}
              className='bg-white border border-gray-200 rounded-2xl p-6 text-center w-64 shadow-sm hover:shadow-md hover:border-[#127058]/30 transition-all'
            >
              <img
                src={avatar}
                alt={name}
                className='w-23 h-23 rounded-full mx-auto bg-gray-100 mb-4'
              />
              <p className='font-black text-gray-900 text-base'>{name}</p>
              <p className='text-xs font-semibold text-[#127058] mt-0.5 mb-3'>
                {role}
              </p>
              <p className='text-gray-500 text-xs leading-relaxed'>{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className='max-w-7xl mx-auto px-6 pb-20'>
        <div className='relative overflow-hidden bg-gradient-to-br from-[#0b4738] via-[#127058] to-[#6E9F94] rounded-3xl p-10 md:p-14 text-white text-center'>
          <div className='absolute top-0 right-0 w-80 h-80 bg-[#EF9F27]/10 rounded-full blur-3xl pointer-events-none' />
          <div className='absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none' />
          <div className='relative'>
            <p className='text-[#a8d5c5] text-xs font-black uppercase tracking-widest mb-3'>
              Ready to start?
            </p>
            <h2 className='text-3xl md:text-4xl font-black tracking-tight'>
              Your next device is waiting.
            </h2>
            <p className='text-[#c5e3da] mt-3 mb-8 max-w-lg mx-auto text-sm leading-relaxed'>
              Browse hundreds of verified, refurbished devices — or sell yours
              today and get a fair AI-powered offer in under 24 hours.
            </p>
            <div className='flex flex-wrap gap-4 justify-center'>
              <Link
                to='/marketplace'
                className='inline-flex items-center gap-2 bg-[#EF9F27] hover:bg-[#d98f20] text-gray-950 font-bold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-black/20 active:scale-[0.97]'
              >
                Shop Devices <ArrowRight className='w-4 h-4' />
              </Link>
              <Link
                to='/Sell-Your-Device'
                className='inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full transition-all active:scale-[0.97]'
              >
                Sell Your Device <ChevronRight className='w-4 h-4' />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
}
