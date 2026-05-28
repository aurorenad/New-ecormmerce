import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useSupport } from '../../../context/SupportContext'

const CATEGORIES = [
  'Order & Delivery',
  'Product Quality',
  'Financing',
  'Returns & Refunds',
  'Technical Support',
  'Account',
  'Other',
]

type WidgetStep = 'idle' | 'form' | 'sent'

export default function SupportChatWidget() {
  const { user } = useAuth()
  const { createTicket } = useSupport()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<WidgetStep>('idle')
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createdId, setCreatedId] = useState('')

  const panelRef = useRef<HTMLDivElement>(null)

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('idle')
        setSubject('')
        setMessage('')
        setCategory(CATEGORIES[0])
      }, 300)
    }
  }, [open])

  function handleOpen() {
    setOpen(true)
    if (user && user.role === 'customer') {
      setStep('form')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !subject.trim() || !message.trim()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    const ticket = createTicket({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      subject: subject.trim(),
      category,
      firstMessage: message.trim(),
    })
    setCreatedId(ticket.id)
    setStep('sent')
    setSubmitting(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open support chat"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#025c50] hover:bg-[#027a6b] text-white px-4 py-3 rounded-full shadow-2xl shadow-[#025c50]/40 transition-all duration-200 active:scale-95 font-semibold text-sm"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Support</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 pointer-events-none">
          <div
            ref={panelRef}
            className="pointer-events-auto w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: '80vh', border: '1px solid #e5e7eb' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#025c50] text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">Customer Support</p>
                  <p className="text-xs text-white/70 leading-tight">Jaribu Help Center</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Not logged in */}
              {!user && (
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-[#f0faf8] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#025c50" strokeWidth="2" aria-hidden>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">Sign in to get support</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Log in with your account to contact our support team and track your requests.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full bg-[#025c50] hover:bg-[#027a6b] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="w-full border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Logged in but not customer (agent / admin etc.) */}
              {user && user.role !== 'customer' && (
                <div className="flex flex-col items-center text-center gap-3 py-4">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f0ab3c" strokeWidth="2" aria-hidden>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-700 text-sm">
                    Support chat is for customers only.
                  </p>
                  {user.role === 'agent' && (
                    <button
                      type="button"
                      onClick={() => navigate('/agent')}
                      className="text-[#025c50] underline text-sm font-medium"
                    >
                      Go to Agent Dashboard
                    </button>
                  )}
                </div>
              )}

              {/* Customer — form step */}
              {user && user.role === 'customer' && step === 'form' && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">Hi, {user.name.split(' ')[0]}!</p>
                    <p className="text-xs text-gray-500">Tell us how we can help you today.</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#025c50]/30 focus:border-[#025c50]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. My order hasn't arrived"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#025c50]/30 focus:border-[#025c50]"
                      required
                      maxLength={120}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue in detail..."
                      rows={4}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#025c50]/30 focus:border-[#025c50]"
                      required
                      maxLength={800}
                    />
                    <span className="text-xs text-gray-400 self-end">{message.length}/800</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !subject.trim() || !message.trim()}
                    className="w-full bg-[#025c50] hover:bg-[#027a6b] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        Send Request
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Sent confirmation */}
              {user && user.role === 'customer' && step === 'sent' && (
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-[#f0faf8] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#025c50" strokeWidth="2.5" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base">Request submitted!</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Our support team will respond shortly.
                    </p>
                    <p className="text-xs text-[#025c50] font-semibold mt-2">Ticket ID: {createdId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-sm text-[#025c50] underline font-medium"
                  >
                    Submit another request
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 text-center">
              <span className="text-xs text-gray-400">Powered by Jaribu Support · Avg. response &lt; 2 hrs</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
