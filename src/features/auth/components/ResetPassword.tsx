import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Live validation checks for security
  const isMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);
  const allRequirementsMet = isMinLength && hasUppercase && hasNumberOrSymbol;

  // Confirm password matching rule
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allRequirementsMet && passwordsMatch) {
      // Connect your update password API endpoint here
      setIsSuccess(true);
    }
  };

  // Success view layout block
  if (isSuccess) {
    return (
      <div className='min-h-screen bg-[#FAFAFB] flex items-center justify-center p-4'>
        <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center space-y-6'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
            <ShieldCheck size={28} />
          </div>
          <div className='space-y-2'>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>Password Updated</h1>
            <p className='text-sm text-gray-500'>
              Your secure credentials have been successfully updated. You can now log back into the marketplace.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/login'}
            className='w-full bg-[#127058] hover:bg-[#0e5845] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2 group'
          >
            <span>Proceed to Sign In</span>
            <ArrowRight size={16} className='transform group-hover:translate-x-0.5 transition-transform' />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#FAFAFB] flex items-center justify-center p-4 py-12'>
      <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6'>
        
        {/* Header Section */}
        <div className='text-center space-y-1.5'>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900'>
            Reset Your Password
          </h1>
          <p className='text-sm text-gray-500 leading-relaxed'>
            Configure a strong, modern password to keep your device trade-ins and financing plans secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          
          {/* New Password Field */}
          <div className='space-y-1.5'>
            <label className='text-sm font-semibold text-gray-700 block'>
              New Password
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
          </div>

          {/* Confirm Password Field */}
          <div className='space-y-1.5'>
            <label className='text-sm font-semibold text-gray-700 block'>
              Confirm New Password
            </label>
            <div className='relative flex items-center'>
              <span className='absolute left-3.5 text-gray-400'>
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all'
              />
            </div>
            
            {/* Visual indicator for passwords matching validation */}
            {confirmPassword.length > 0 && (
              <div className='pt-1 px-0.5 flex items-center gap-1.5 text-xs'>
                {passwordsMatch ? (
                  <span className='text-emerald-600 flex items-center gap-1 font-medium'>
                    <CheckCircle2 size={12} /> Passwords match
                  </span>
                ) : (
                  <span className='text-rose-500 flex items-center gap-1 font-medium'>
                    <AlertCircle size={12} /> Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Interactive Requirements Checklist Card */}
          <div className='bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-2 mt-2'>
            <p className='text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1'>
              Security Status
            </p>
            <div className='space-y-1.5 text-xs'>
              <p className={`flex items-center gap-2 transition-colors ${isMinLength ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                <CheckCircle2 size={14} className={`flex-shrink-0 ${isMinLength ? 'text-emerald-500' : 'text-gray-300'}`} />
                <span>At least 8 characters</span>
              </p>
              <p className={`flex items-center gap-2 transition-colors ${hasUppercase ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                <CheckCircle2 size={14} className={`flex-shrink-0 ${hasUppercase ? 'text-emerald-500' : 'text-gray-300'}`} />
                <span>At least one uppercase letter</span>
              </p>
              <p className={`flex items-center gap-2 transition-colors ${hasNumberOrSymbol ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                <CheckCircle2 size={14} className={`flex-shrink-0 ${hasNumberOrSymbol ? 'text-emerald-500' : 'text-gray-300'}`} />
                <span>One number or symbol</span>
              </p>
            </div>
          </div>

          {/* Submission Button - Disabled until requirements are fully clear */}
          <button
            type='submit'
            disabled={!allRequirementsMet || !passwordsMatch}
            className='w-full !mt-6 bg-[#127058] hover:bg-[#0e5845] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all text-sm shadow-sm'
          >
            Update Security Credentials
          </button>
        </form>

      </div>
    </div>
  );
}
