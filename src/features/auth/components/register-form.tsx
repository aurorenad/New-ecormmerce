import { useState } from 'react';
import {
  User,
  Mail,
  Info,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  CircleCheckBig,
} from 'lucide-react';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  // Live validation checks
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <div className='min-h-screen bg-[#FAFAFB] flex items-center justify-center p-4 py-12'>
      <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6'>
        
        {/* Header section with brand context */}
        <div className='text-center space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
            Create your account
          </h1>
          <p className='text-sm text-gray-500'>
            Join the transparent marketplace for certified tech.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
          
          {/* Name Field Wrapper */}
          <div className='space-y-1.5'>
            <label className='text-sm font-semibold text-gray-700 block'>
              Full Name
            </label>
            <div className='relative flex items-center'>
              <span className='absolute left-3.5 text-gray-400'>
                <User size={18} />
              </span>
              <input
                type='text'
                placeholder='John Doe'
                required
                className='w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all'
              />
            </div>
          </div>

          {/* Email Field Wrapper */}
          <div className='space-y-1.5'>
            <label className='text-sm font-semibold text-gray-700 block'>
              Email address
            </label>
            <div className='relative flex items-center'>
              <span className='absolute left-3.5 text-gray-400'>
                <Mail size={18} />
              </span>
              <input
                type='email'
                placeholder='john@example.com'
                required
                className='w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all'
              />
            </div>
            
            <div className='flex items-start gap-2 pt-0.5 px-0.5'>
              <Info size={16} className='text-gray-400 mt-0.5 flex-shrink-0' />
              <p className='text-gray-500 text-xs leading-normal'>
                We'll send a verification code here.
              </p>
            </div>
          </div>

          {/* Phone Field Wrapper */}
          <div className='space-y-1.5'>
            <label className='text-sm font-semibold text-gray-700 block'>
              Phone Number
            </label>
            <div className='relative flex items-center'>
              <span className='absolute left-3.5 text-gray-400'>
                <Phone size={18} />
              </span>
              <input
                type='tel'
                placeholder='0788 888-888'
                required
                className='w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all'
              />
            </div>
          </div>

          {/* Password Field Wrapper */}
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700 block'>
              Password
            </label>

            <div className='relative flex items-center'>
              <span className='absolute left-3.5 text-gray-400'>
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Live Security Requirements Checklist */}
            <div className='bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-2 mt-2'>
              <p className='text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1'>
                Security Requirements
              </p>
              <div className='space-y-1.5 text-xs'>
                
                {/* Rule 1: Length */}
                <p className={`flex items-center gap-2 transition-colors ${isMinLength ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                  <CircleCheckBig 
                    size={14} 
                    className={`flex-shrink-0 transition-all ${isMinLength ? 'text-emerald-500 scale-110' : 'text-gray-300'}`} 
                  />
                  <span>At least 8 characters</span>
                </p>

                {/* Rule 2: Uppercase */}
                <p className={`flex items-center gap-2 transition-colors ${hasUppercase ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                  <CircleCheckBig 
                    size={14} 
                    className={`flex-shrink-0 transition-all ${hasUppercase ? 'text-emerald-500 scale-110' : 'text-gray-300'}`} 
                  />
                  <span>At least one uppercase letter</span>
                </p>

                {/* Rule 3: Number or Symbol */}
                <p className={`flex items-center gap-2 transition-colors ${hasNumberOrSymbol ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                  <CircleCheckBig 
                    size={14} 
                    className={`flex-shrink-0 transition-all ${hasNumberOrSymbol ? 'text-emerald-500 scale-110' : 'text-gray-300'}`} 
                  />
                  <span>One number or symbol</span>
                </p>

              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full !mt-6 bg-[#127058] hover:bg-[#0e5845] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 group shadow-sm'
          >
            <span>Create Account</span>
            <ArrowRight
              size={16}
              className='transform group-hover:translate-x-0.5 transition-transform'
            />
          </button>
        </form>

        {/* Form Footer */}
        <p className='text-center text-sm text-gray-600 pt-2'>
          Already have an account?{' '}
          <a
            href='/login'
            className='font-bold text-[#ef9f27] hover:text-[#d68a1d] transition-colors'
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
