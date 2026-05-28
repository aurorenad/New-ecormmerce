import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth, MOCK_USERS } from '../../../context/AuthContext'

const ROLE_LABELS: Record<string, string> = {
  customer:   'Customer',
  admin:      'Admin',
  finance:    'Finance Officer',
  technician: 'Technician',
  agent:      'Support Agent',
}

const ROLE_COLORS: Record<string, string> = {
  customer:   'bg-blue-100 text-blue-700',
  admin:      'bg-purple-100 text-purple-700',
  finance:    'bg-amber-100 text-amber-700',
  technician: 'bg-green-100 text-green-700',
  agent:      'bg-teal-100 text-teal-700',
}

export default function LoginForm() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [hintsOpen, setHintsOpen]       = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const user = await login(email.trim(), password)
      navigate(user.redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function fillCredentials(userEmail: string, userPassword: string) {
    setEmail(userEmail)
    setPassword(userPassword)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">

        {/* ── Demo credentials hint panel ─────────────────────────────── */}
        <div className="bg-white border border-dashed border-[#127058]/40 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setHintsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#127058] hover:bg-[#127058]/5 transition-colors"
          >
            <span>Test credentials — click a role to fill the form</span>
            {hintsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {hintsOpen && (
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => fillCredentials(u.email, u.password)}
                  className="text-left p-3 rounded-xl border border-gray-100 hover:border-[#127058]/30 hover:bg-[#127058]/5 transition-all group"
                >
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${ROLE_COLORS[u.role]}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                  <p className="text-xs font-medium text-gray-800 truncate">{u.email}</p>
                  <p className="text-xs text-gray-400">{u.password}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Login card ──────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6">

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-500">Sign in to manage your devices and installments</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 block">Email address</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400"><Mail size={18} /></span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="/forget-password" className="text-xs font-semibold text-[#127058] hover:text-[#0e5845] transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-gray-400"><Lock size={18} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none disabled:opacity-40"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#127058] hover:bg-[#0e5845] active:bg-[#0b4a3a] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 group shadow-sm disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#127058]/40"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 pt-2">
            Don't have an account?{' '}
            <a href="/register" className="font-bold text-[#ef9f27] hover:text-[#d68a1d] transition-colors">
              Register now
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}
