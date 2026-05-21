import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* Header section with brand context */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to manage your devices and installments
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          
          {/* Email Field Wrapper */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 block">
              Email address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                placeholder="name@company.com" 
                required 
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all"
              />
            </div>
          </div>

          {/* Password Field Wrapper */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <a 
                href="/forget-password" 
                className="text-xs font-semibold text-[#127058] hover:text-[#0e5845] transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-gray-400">
                <Lock size={18} />
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button using custom deep green */}
          <button 
            type="submit" 
            className="w-full mt-2 bg-[#127058] hover:bg-[#0e5845] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 group shadow-sm"
          >
            <span>Sign in</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Form Footer / Registration Anchor */}
        <p className="text-center text-sm text-gray-600 pt-2">
          Don't have an account?{' '}
          <a 
            href="/register" 
            className="font-bold text-[#ef9f27] hover:text-[#d68a1d] transition-colors"
          >
            Register now
          </a>
        </p>

      </div>
    </div>
  );
}
