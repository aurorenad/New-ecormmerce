export default function Footer() {
  return (
    <footer className='bg-[#127058] text-white'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
        {/* Brand Column */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='flex items-center gap-2'>
            <span className='h-8 w-8 rounded-lg bg-[#ef9f27] flex items-center justify-center font-bold text-white text-lg'>
              R
            </span>
            <span className='text-xl font-bold tracking-tight'>ReviveTech.</span>
          </div>
          <p className='text-sm text-white max-w-sm leading-relaxed'>
            Your trusted marketplace for high-quality, affordable secondhand
            electronics. Transparent inspection grades, easy device financing,
            and reliable warrantee support.
          </p>
        </div>

        {/* Links Column 1: Marketplace */}
        <div>
          <h4 className='text-sm font-semibold uppercase tracking-wider text-[#ef9f27] mb-4'>
            Marketplace
          </h4>
          <ul className='space-y-2 text-sm text-white'>
            <li>
              <a href='#phones' className='hover:underline '>
                Smartphones
              </a>
            </li>
            <li>
              <a
                href='#laptops'
                className='hover:underline'
              >
                Laptops
              </a>
            </li>
            <li>
              <a
                href='#tablets'
                className='hover:underline'
              >
                Tablets & iPads
              </a>
            </li>
            <li>
              <a
                href='#financing'
                className='hover:underline'
              >
                Financing Plans
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Business & Quality */}
        <div>
          <h4 className='text-sm font-semibold uppercase tracking-wider text-[#ef9f27] mb-4'>
            Our Process
          </h4>
          <ul className='space-y-2 text-sm text-white'>
            <li>
              <a
                href='#refurbish'
                className='hover:underline'
              >
                How We Refurbish
              </a>
            </li>
            <li>
              <a
                href='#grading'
                className='hover:underline'
              >
                Grading Guide
              </a>
            </li>
            <li>
              <a href='#sell' className='hover:underline'>
                Trade-In Your Device
              </a>
            </li>
            <li>
              <a href='#support' className='hover:underline'>
                Support & Repairs
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup Column */}
        <div>
          <h4 className='text-sm font-semibold uppercase tracking-wider text-[#ef9f27] mb-4'>
            Stay Updated
          </h4>
          <p className='text-xs text-white mb-3'>
            Get notified when fresh inventory or limited flash sales drop.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className='flex flex-col gap-2'
          >
            <input
              type='email'
              placeholder='Your email address'
              className='w-full bg-black/20 border border-[#6E9F94]/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#ef9f27] text-white placeholder-[#6E9F94]'
            />
            <button className='w-full bg-[#ef9f27] hover:bg-[#d68a1d] text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors'>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className='border-t border-[#6E9F94]/20 bg-black/20'>
        <div className='max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white'>
          <p>
            &copy; {new Date().getFullYear()} ReviveTech Platform. All rights
            reserved.
          </p>
          <div className='flex gap-6'>
            <a href='#privacy' className='hover:text-white transition-colors'>
              Privacy Policy
            </a>
            <a href='#terms' className='hover:text-white transition-colors'>
              Terms of Financing
            </a>
            <a href='#cookies' className='hover:text-white transition-colors'>
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
