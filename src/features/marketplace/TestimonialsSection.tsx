import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  device: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const DISPLAY_DURATION    = 5000; // ms each card is visible
const TRANSITION_DURATION = 600;  // ms for the fade/slide animation

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StarRow({ count }: { count: number }) {
  return (
    <div className='flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${
            s <= count
              ? 'text-[#EF9F27] fill-[#EF9F27]'
              : 'text-white/20 fill-white/20'
          }`}
        />
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className='inline-flex items-center gap-2 text-[#EF9F27] text-xs font-black uppercase tracking-widest mb-3'>
      <span className='w-5 h-0.5 bg-[#EF9F27] rounded-full' />
      {children}
      <span className='w-5 h-0.5 bg-[#EF9F27] rounded-full' />
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<'visible' | 'fading-out' | 'fading-in'>('visible');
  const [isPaused, setIsPaused]       = useState(false);

  // Tracks how many times we've advanced — used as a key to restart the CSS
  // progress-bar animation. Incremented as a ref to avoid triggering renders;
  // we pass it straight to a key prop so React resets the DOM node naturally.
  const progressRevRef = useRef(0);

  // ── goTo: stable reference via useCallback ──────────────────────────────────
  // Wrapping in useCallback (with testimonials.length as the only real dep)
  // lets us safely list it in the auto-advance effect's dependency array
  // without causing infinite re-renders.
  const goTo = useCallback(
    (index: number) => {
      const target = (index + testimonials.length) % testimonials.length;

      setPhase('fading-out');

      setTimeout(() => {
        progressRevRef.current += 1; // bump rev so progress bar key changes
        setActiveIndex(target);
        setPhase('fading-in');

        setTimeout(() => {
          setPhase('visible');
        }, TRANSITION_DURATION);
      }, TRANSITION_DURATION);
    },
    [testimonials.length],
  );

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      // Read the live index inside the setter so goNext itself doesn't
      // need activeIndex in its closure — keeps the dep array clean.
      goTo((current + 1) % testimonials.length);
      return current; // actual update happens inside goTo via setActiveIndex
    });
  }, [goTo, testimonials.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => {
      goTo((current - 1 + testimonials.length) % testimonials.length);
      return current;
    });
  }, [goTo, testimonials.length]);

  // ── Auto-advance ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || phase !== 'visible') return;

    const id = setTimeout(goNext, DISPLAY_DURATION);
    return () => clearTimeout(id);
  }, [activeIndex, isPaused, phase, goNext]);

  // ── Derived values (no extra state, no cascading renders) ────────────────────
  const t = testimonials[activeIndex];

  // The progress bar <div> gets this as its `key`. When the key changes React
  // unmounts + remounts the element, restarting the CSS animation — clean and
  // free of any setState-inside-effect pattern.
  const progressBarKey = `${progressRevRef.current}-${isPaused ? 'paused' : 'playing'}`;

  // ── Card transition styles ────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    opacity: phase === 'visible' ? 1 : 0,
    transform:
      phase === 'fading-out'
        ? 'translateY(-12px) scale(0.98)'
        : phase === 'fading-in'
        ? 'translateY(12px)  scale(0.98)'
        : 'translateY(0px)   scale(1)',
    transition: `opacity ${TRANSITION_DURATION}ms ease, transform ${TRANSITION_DURATION}ms ease`,
  };

  return (
    <section className='bg-[#0b4738] py-20 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6'>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className='text-center mb-12'>
          <SectionLabel>Customer Stories</SectionLabel>
          <h2 className='text-3xl md:text-4xl font-black text-white mt-2'>
            Real people. Real results.
          </h2>
          <p className='text-[#a8d5c5] mt-3 max-w-xl mx-auto text-sm leading-relaxed'>
            Over 1,800 customers have bought or sold through ReviveTech. Here's
            what some of them say.
          </p>
        </div>

        {/* ── Single Card ─────────────────────────────────────────────────── */}
        <div className='max-w-2xl mx-auto'>

          {/* Card */}
          <div
            style={cardStyle}
            className='relative bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col'
          >
            <Quote className='w-10 h-10 text-[#EF9F27]/20 mb-4 flex-shrink-0' />

            <p className='text-[#d5e9e4] text-base md:text-lg leading-relaxed flex-grow font-medium'>
              "{t.text}"
            </p>

            <div className='mt-5 mb-5'>
              <span className='text-xs bg-[#EF9F27]/20 text-[#EF9F27] font-semibold px-3 py-1.5 rounded-full'>
                {t.device}
              </span>
            </div>

            <div className='flex items-center gap-4 pt-5 border-t border-white/10'>
              <img
                src={t.avatar}
                alt={t.name}
                className='w-12 h-12 rounded-full bg-white/10 flex-shrink-0 ring-2 ring-white/10'
              />
              <div className='flex-1 min-w-0'>
                <p className='text-white font-bold truncate'>{t.name}</p>
                <p className='text-[#a8d5c5] text-xs truncate mt-0.5'>{t.role}</p>
              </div>
              <StarRow count={t.rating} />
            </div>
          </div>

          {/* Progress bar — key change restarts the CSS animation */}
          <div className='mt-5 h-0.5 bg-white/10 rounded-full overflow-hidden'>
            <div
              key={progressBarKey}
              className='h-full bg-[#EF9F27] rounded-full'
              style={{
                animation: isPaused
                  ? 'none'
                  : `progress-fill ${DISPLAY_DURATION}ms linear forwards`,
                width: isPaused ? '0%' : undefined,
              }}
            />
          </div>

          {/* Controls */}
          <div className='mt-5 flex items-center justify-between'>

            {/* Dot indicators */}
            <div className='flex items-center gap-2'>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-6 h-2 bg-[#EF9F27]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Pause / Prev / Next */}
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setIsPaused((p) => !p)}
                className='w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors'
                aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              >
                {isPaused
                  ? <Play  className='w-3.5 h-3.5 text-white' />
                  : <Pause className='w-3.5 h-3.5 text-white' />
                }
              </button>

              <button
                onClick={goPrev}
                className='w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors'
                aria-label='Previous testimonial'
              >
                <ChevronLeft className='w-4 h-4 text-white' />
              </button>

              <button
                onClick={goNext}
                className='w-9 h-9 rounded-full bg-[#EF9F27]/20 hover:bg-[#EF9F27]/40 flex items-center justify-center transition-colors'
                aria-label='Next testimonial'
              >
                <ChevronRight className='w-4 h-4 text-[#EF9F27]' />
              </button>
            </div>
          </div>

          <p className='text-center text-[#a8d5c5] text-xs font-medium mt-4'>
            {activeIndex + 1} / {testimonials.length}
          </p>
        </div>

        {/* Average rating strip */}
        <div className='mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 text-center'>
          <div className='flex gap-1'>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className='w-5 h-5 text-[#EF9F27] fill-[#EF9F27]' />
            ))}
          </div>
          <p className='text-white font-bold'>4.9 / 5</p>
          <p className='text-[#a8d5c5] text-sm'>
            based on 1,800+ verified customer reviews
          </p>
        </div>
      </div>

      <style>{`
        @keyframes progress-fill {
          from { width: 0%;   }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}