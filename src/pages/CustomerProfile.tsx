import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, ShoppingBag, CreditCard, Heart, Shield,
  Edit3, Check, X, LogOut, ArrowRight, Trash2,
  ShoppingCart, ChevronRight, Bell, Lock, Smartphone,
  Star, Package, Calendar, TrendingUp,
} from 'lucide-react'
import Navbar from '../shared/components/nav'
import Footer from '../shared/components/Footer'
import { useAuth } from '../context/AuthContext'
import { baseListings } from '../data/listings'
import { useCart } from '../context/useCart'

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: 'ORD-2841', device: 'iPhone 15 Pro', condition: 'Excellent' as const,
    price: 840, date: 'May 15, 2025', status: 'Delivered',
    img: 'https://images.unsplash.com/photo-1730036900477-09391e7a5414?q=80&w=580&auto=format&fit=crop',
  },
  {
    id: 'ORD-2756', device: 'MacBook Air M2', condition: 'Good' as const,
    price: 799, date: 'Apr 22, 2025', status: 'Shipped',
    img: 'https://images.unsplash.com/photo-1650750018363-ff7ffe460f4b?q=80&w=709&auto=format&fit=crop',
  },
  {
    id: 'ORD-2601', device: 'Samsung Galaxy S24 Ultra', condition: 'Excellent' as const,
    price: 950, date: 'Mar 10, 2025', status: 'Processing',
    img: 'https://images.unsplash.com/photo-1738830246146-599b67d009db?q=80&w=1032&auto=format&fit=crop',
  },
  {
    id: 'ORD-2490', device: 'iPad Air 5th Gen', condition: 'Fair' as const,
    price: 420, date: 'Feb 4, 2025', status: 'Delivered',
    img: 'https://images.unsplash.com/photo-1703756847845-0fbe0be766ee?q=80&w=1032&auto=format&fit=crop',
  },
]

const MOCK_INSTALLMENTS = [
  {
    ref: 'INS-7741', device: 'MacBook Air M2', monthly: 89.90,
    paid: 3, total: 12, nextDue: 'Jun 1, 2025', status: 'Active',
    img: 'https://images.unsplash.com/photo-1650750018363-ff7ffe460f4b?q=80&w=709&auto=format&fit=crop',
  },
  {
    ref: 'INS-6820', device: 'iPhone 15 Pro', monthly: 70.00,
    paid: 6, total: 12, nextDue: 'Jun 1, 2025', status: 'Active',
    img: 'https://images.unsplash.com/photo-1730036900477-09391e7a5414?q=80&w=580&auto=format&fit=crop',
  },
]

const MOCK_ACTIVITY = [
  { id: 1, icon: ShoppingBag, text: 'Order ORD-2841 delivered', time: '2 days ago', color: 'text-emerald-600' },
  { id: 2, icon: CreditCard, text: 'Installment payment — INS-7741', time: '5 days ago', color: 'text-blue-600' },
  { id: 3, icon: Heart, text: 'Saved Google Pixel 8 Pro', time: '1 week ago', color: 'text-rose-500' },
  { id: 4, icon: Package, text: 'Order ORD-2756 shipped', time: '1 week ago', color: 'text-amber-600' },
]

const CONDITION_STYLES = {
  Excellent: 'bg-emerald-100 text-emerald-700',
  Good:      'bg-blue-100 text-blue-700',
  Fair:      'bg-amber-100 text-amber-700',
}

const STATUS_STYLES: Record<string, string> = {
  Delivered:  'bg-emerald-100 text-emerald-700',
  Shipped:    'bg-blue-100 text-blue-700',
  Processing: 'bg-amber-100 text-amber-700',
  Active:     'bg-[#127058]/10 text-[#127058]',
  Completed:  'bg-gray-100 text-gray-500',
}

// ── Tabs definition ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',      label: 'Overview',        icon: TrendingUp  },
  { id: 'orders',        label: 'Orders',           icon: ShoppingBag },
  { id: 'installments',  label: 'Installments',     icon: CreditCard  },
  { id: 'saved',         label: 'Saved Devices',    icon: Heart       },
  { id: 'security',      label: 'Security',         icon: Shield      },
]

const SAVED_IDS = [1, 3, 5, 6]

export default function CustomerProfile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [activeTab, setActiveTab]         = useState('overview')
  const [editing, setEditing]             = useState(false)
  const [name, setName]                   = useState(user?.name ?? '')
  const [phone, setPhone]                 = useState('+250 788 123 456')
  const [draftName, setDraftName]         = useState(name)
  const [draftPhone, setDraftPhone]       = useState(phone)
  const [orderFilter, setOrderFilter]     = useState('All')
  const [savedIds, setSavedIds]           = useState<number[]>(SAVED_IDS)
  const [addedId, setAddedId]             = useState<number | null>(null)
  const [notifications, setNotifications] = useState({ orders: true, installments: true, promotions: false })
  const [pwForm, setPwForm]               = useState({ current: '', next: '', confirm: '' })
  const [pwSaved, setPwSaved]             = useState(false)

  const initials = name
    ? name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const savedDevices = baseListings.filter((l) => savedIds.includes(l.id))
  const filteredOrders = orderFilter === 'All'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === orderFilter)

  const totalMonthly = MOCK_INSTALLMENTS.reduce((s, i) => s + i.monthly, 0)

  function saveProfile() {
    setName(draftName)
    setPhone(draftPhone)
    setEditing(false)
  }

  function cancelEdit() {
    setDraftName(name)
    setDraftPhone(phone)
    setEditing(false)
  }

  function removeFromSaved(id: number) {
    setSavedIds((prev) => prev.filter((i) => i !== id))
  }

  function handleAddToCart(listing: typeof baseListings[0]) {
    addToCart({ ...listing, quantity: 1 })
    setAddedId(listing.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  function handlePwSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm || !pwForm.current) return
    setPwSaved(true)
    setPwForm({ current: '', next: '', confirm: '' })
    setTimeout(() => setPwSaved(false), 3000)
  }

  return (
    <>
      <Navbar />
      <div className='bg-[#FAFAFB] min-h-screen'>
        <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'>

          {/* ── Profile header card ───────────────────────────────────── */}
          <div className='bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden'>
            {/* Gradient banner */}
            <div className='h-24 bg-gradient-to-r from-[#127058] via-[#1a8f6e] to-[#6E9F94]' />
            <div className='px-6 pb-6'>
              <div className='flex flex-wrap items-end justify-between gap-4 -mt-10'>
                {/* Avatar */}
                <div className='flex items-end gap-4'>
                  <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-[#127058] to-[#0b4738] flex items-center justify-center text-white text-2xl font-black ring-4 ring-white shadow-lg flex-shrink-0'>
                    {initials}
                  </div>
                  <div className='mb-1'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <h1 className='text-xl font-bold text-gray-900'>{name}</h1>
                      <span className='inline-flex items-center gap-1 text-[11px] font-semibold bg-[#127058]/10 text-[#127058] px-2.5 py-0.5 rounded-full'>
                        <span className='w-1.5 h-1.5 rounded-full bg-green-500 inline-block' />
                        Customer
                      </span>
                    </div>
                    <p className='text-sm text-gray-500 mt-0.5'>{user?.email}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 mb-1'>
                  {!editing ? (
                    <button
                      type='button'
                      onClick={() => setEditing(true)}
                      className='inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#127058] hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-xl transition-all'
                    >
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button type='button' onClick={saveProfile} className='inline-flex items-center gap-1.5 text-sm font-semibold bg-[#127058] text-white px-3 py-2 rounded-xl transition-all hover:bg-[#0e5845]'>
                        <Check size={14} /> Save
                      </button>
                      <button type='button' onClick={cancelEdit} className='inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-xl transition-all'>
                        <X size={14} /> Cancel
                      </button>
                    </>
                  )}
                  <button
                    type='button'
                    onClick={handleLogout}
                    className='inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-200 px-3 py-2 rounded-xl transition-all'
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              </div>

              {/* Editable fields */}
              {editing ? (
                <div className='mt-5 grid sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>Full Name</label>
                    <input
                      type='text'
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all'
                    />
                  </div>
                  <div>
                    <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>Phone</label>
                    <input
                      type='tel'
                      value={draftPhone}
                      onChange={(e) => setDraftPhone(e.target.value)}
                      className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all'
                    />
                  </div>
                  <div>
                    <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>Email</label>
                    <input
                      type='email'
                      value={user?.email}
                      readOnly
                      className='w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed'
                    />
                    <p className='text-[11px] text-gray-400 mt-1'>Contact support to change your email.</p>
                  </div>
                </div>
              ) : (
                <div className='mt-5 flex flex-wrap gap-x-8 gap-y-2'>
                  <div>
                    <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wide'>Phone</span>
                    <p className='text-sm font-medium text-gray-800 mt-0.5'>{phone}</p>
                  </div>
                  <div>
                    <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wide'>Email</span>
                    <p className='text-sm font-medium text-gray-800 mt-0.5'>{user?.email}</p>
                  </div>
                  <div>
                    <span className='text-[11px] font-semibold text-gray-400 uppercase tracking-wide'>Member since</span>
                    <p className='text-sm font-medium text-gray-800 mt-0.5'>Jan 2025</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Tab navigation ────────────────────────────────────────── */}
          <div className='flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide'>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type='button'
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === id
                    ? 'bg-[#127058] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#127058]/30 hover:text-[#127058] hover:bg-[#127058]/5'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab content ───────────────────────────────────────────── */}

          {/* OVERVIEW ──────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className='space-y-6'>
              {/* Stats */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                {[
                  { label: 'Total Orders',         value: MOCK_ORDERS.length,   icon: ShoppingBag, color: 'from-blue-500 to-indigo-600' },
                  { label: 'Active Plans',          value: MOCK_INSTALLMENTS.length, icon: CreditCard, color: 'from-[#127058] to-[#0b4738]' },
                  { label: 'Monthly Payment',       value: `$${totalMonthly.toFixed(0)}`, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
                  { label: 'Saved Devices',         value: savedIds.length,      icon: Heart,       color: 'from-rose-500 to-pink-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
                      <Icon size={18} />
                    </div>
                    <p className='text-2xl font-black text-gray-900'>{value}</p>
                    <p className='text-xs text-gray-500 mt-0.5'>{label}</p>
                  </div>
                ))}
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                {/* Recent orders */}
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-sm font-bold text-gray-900'>Recent Orders</h2>
                    <button type='button' onClick={() => setActiveTab('orders')} className='text-xs font-semibold text-[#127058] hover:underline flex items-center gap-1'>
                      View all <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className='space-y-3'>
                    {MOCK_ORDERS.slice(0, 2).map((o) => (
                      <div key={o.id} className='flex items-center gap-3'>
                        <img src={o.img} alt={o.device} className='w-11 h-11 rounded-xl object-cover bg-gray-100 flex-shrink-0' />
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-semibold text-gray-900 truncate'>{o.device}</p>
                          <p className='text-xs text-gray-500'>{o.id} · {o.date}</p>
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active installments */}
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5'>
                  <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-sm font-bold text-gray-900'>Active Installments</h2>
                    <button type='button' onClick={() => setActiveTab('installments')} className='text-xs font-semibold text-[#127058] hover:underline flex items-center gap-1'>
                      View all <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className='space-y-3'>
                    {MOCK_INSTALLMENTS.map((ins) => {
                      const pct = Math.round((ins.paid / ins.total) * 100)
                      return (
                        <div key={ins.ref}>
                          <div className='flex items-center justify-between mb-1'>
                            <p className='text-sm font-semibold text-gray-900 truncate'>{ins.device}</p>
                            <p className='text-sm font-bold text-[#127058] flex-shrink-0 ml-2'>${ins.monthly}/mo</p>
                          </div>
                          <div className='w-full h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                            <div className='h-full bg-[#127058] rounded-full transition-all' style={{ width: `${pct}%` }} />
                          </div>
                          <p className='text-[11px] text-gray-400 mt-1'>{ins.paid} of {ins.total} payments · Next: {ins.nextDue}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5'>
                <h2 className='text-sm font-bold text-gray-900 mb-4'>Recent Activity</h2>
                <ul className='space-y-3'>
                  {MOCK_ACTIVITY.map(({ id, icon: Icon, text, time, color }) => (
                    <li key={id} className='flex items-center gap-3'>
                      <span className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon size={15} />
                      </span>
                      <p className='text-sm text-gray-700 flex-1'>{text}</p>
                      <span className='text-xs text-gray-400 flex-shrink-0'>{time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ORDERS ─────────────────────────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div className='space-y-4'>
              {/* Filter pills */}
              <div className='flex gap-2 flex-wrap'>
                {['All', 'Delivered', 'Shipped', 'Processing'].map((f) => (
                  <button
                    key={f}
                    type='button'
                    onClick={() => setOrderFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      orderFilter === f
                        ? 'bg-[#127058] text-white border-[#127058]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#127058]/40'
                    }`}
                  >
                    {f}
                    {f === 'All' && <span className='ml-1 text-[10px] opacity-70'>({MOCK_ORDERS.length})</span>}
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center'>
                  <Package size={36} className='mx-auto text-gray-300 mb-3' />
                  <p className='text-sm font-semibold text-gray-500'>No {orderFilter.toLowerCase()} orders</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {filteredOrders.map((o) => (
                    <div key={o.id} className='bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-wrap items-center gap-4'>
                      <img src={o.img} alt={o.device} className='w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0' />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-bold text-gray-900'>{o.device}</p>
                        <div className='flex items-center gap-2 mt-1 flex-wrap'>
                          <span className='text-xs text-gray-500'>{o.id}</span>
                          <span className='text-gray-300'>·</span>
                          <span className='text-xs text-gray-500'>{o.date}</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CONDITION_STYLES[o.condition]}`}>
                            {o.condition}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center gap-3 flex-shrink-0'>
                        <p className='text-base font-black text-gray-900'>${o.price}</p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>
                          {o.status}
                        </span>
                        <Link
                          to='/marketplace'
                          className='text-xs font-semibold text-[#127058] hover:underline flex items-center gap-1'
                        >
                          Details <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INSTALLMENTS ───────────────────────────────────────────────── */}
          {activeTab === 'installments' && (
            <div className='space-y-4'>
              {/* Summary bar */}
              <div className='bg-gradient-to-br from-[#127058]/10 to-[#6E9F94]/10 border border-[#127058]/20 rounded-2xl p-4 flex flex-wrap gap-6'>
                <div>
                  <p className='text-xs font-semibold text-[#127058]/70 uppercase tracking-wide'>Total monthly</p>
                  <p className='text-2xl font-black text-[#127058]'>${totalMonthly.toFixed(2)}</p>
                </div>
                <div>
                  <p className='text-xs font-semibold text-[#127058]/70 uppercase tracking-wide'>Active plans</p>
                  <p className='text-2xl font-black text-[#127058]'>{MOCK_INSTALLMENTS.length}</p>
                </div>
                <div>
                  <p className='text-xs font-semibold text-[#127058]/70 uppercase tracking-wide'>Next payment</p>
                  <p className='text-2xl font-black text-[#127058]'>Jun 1, 2025</p>
                </div>
              </div>

              {MOCK_INSTALLMENTS.map((ins) => {
                const pct = Math.round((ins.paid / ins.total) * 100)
                const remaining = ins.total - ins.paid
                return (
                  <div key={ins.ref} className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5'>
                    <div className='flex items-start gap-4'>
                      <img src={ins.img} alt={ins.device} className='w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0' />
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2 flex-wrap'>
                          <div>
                            <p className='text-sm font-bold text-gray-900'>{ins.device}</p>
                            <p className='text-xs text-gray-500 mt-0.5'>{ins.ref}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[ins.status]}`}>
                            {ins.status}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className='mt-4'>
                          <div className='flex items-center justify-between mb-1.5'>
                            <span className='text-xs text-gray-500'>{ins.paid} payments made</span>
                            <span className='text-xs font-semibold text-[#127058]'>{pct}% complete</span>
                          </div>
                          <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                            <div className='h-full bg-[#127058] rounded-full transition-all' style={{ width: `${pct}%` }} />
                          </div>
                        </div>

                        {/* Details grid */}
                        <div className='mt-4 grid grid-cols-3 gap-3'>
                          {[
                            { label: 'Monthly', value: `$${ins.monthly.toFixed(2)}` },
                            { label: 'Remaining', value: `${remaining} payments` },
                            { label: 'Next Due', value: ins.nextDue },
                          ].map(({ label, value }) => (
                            <div key={label} className='bg-gray-50 rounded-xl p-3'>
                              <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-wide'>{label}</p>
                              <p className='text-sm font-bold text-gray-800 mt-0.5'>{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-5 text-center'>
                <CreditCard size={28} className='mx-auto text-gray-300 mb-2' />
                <p className='text-sm font-semibold text-gray-600 mb-1'>Want to finance a new device?</p>
                <p className='text-xs text-gray-400 mb-4'>Browse our marketplace and apply for a flexible payment plan.</p>
                <Link
                  to='/marketplace'
                  className='inline-flex items-center gap-2 bg-[#127058] hover:bg-[#0e5845] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all'
                >
                  Browse Devices <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* SAVED DEVICES ──────────────────────────────────────────────── */}
          {activeTab === 'saved' && (
            <div className='space-y-4'>
              {savedDevices.length === 0 ? (
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center'>
                  <Heart size={36} className='mx-auto text-gray-300 mb-3' />
                  <p className='text-sm font-semibold text-gray-500'>No saved devices yet</p>
                  <Link to='/marketplace' className='inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-[#127058] hover:underline'>
                    Browse Marketplace <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className='grid sm:grid-cols-2 gap-4'>
                  {savedDevices.map((device) => {
                    const discount = Math.round(((device.original_price - device.current_price) / device.original_price) * 100)
                    const isAdded = addedId === device.id
                    return (
                      <div key={device.id} className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:border-[#127058]/30 hover:shadow-md transition-all group'>
                        <div className='relative'>
                          <img src={device.img} alt={device.title} className='w-full h-44 object-cover' />
                          <div className='absolute top-3 left-3 flex gap-1.5 flex-wrap'>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CONDITION_STYLES[device.condition as keyof typeof CONDITION_STYLES]}`}>
                              {device.condition}
                            </span>
                            {discount > 0 && (
                              <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EF9F27] text-gray-900'>
                                -{discount}%
                              </span>
                            )}
                          </div>
                          <button
                            type='button'
                            onClick={() => removeFromSaved(device.id)}
                            className='absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm'
                            aria-label='Remove from saved'
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className='p-4'>
                          <p className='text-sm font-bold text-gray-900 truncate'>{device.title}</p>
                          <div className='flex items-center gap-1 mt-1 mb-3'>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={11} className={i < (device.rating ?? 0) ? 'text-[#EF9F27] fill-[#EF9F27]' : 'text-gray-200'} />
                            ))}
                            <span className='text-[11px] text-gray-400 ml-0.5'>({device.reviewCount})</span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div>
                              <p className='text-lg font-black text-gray-900'>${device.current_price}</p>
                              {discount > 0 && (
                                <p className='text-xs text-gray-400 line-through'>${device.original_price}</p>
                              )}
                            </div>
                            <div className='flex gap-2'>
                              <Link
                                to={`/marketplace/${device.id}`}
                                className='p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-[#127058]/40 hover:text-[#127058] transition-all'
                                aria-label='View details'
                              >
                                <Smartphone size={15} />
                              </Link>
                              <button
                                type='button'
                                onClick={() => handleAddToCart(device)}
                                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                                  isAdded
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#127058] hover:bg-[#0e5845] text-white'
                                }`}
                              >
                                {isAdded ? <Check size={13} /> : <ShoppingCart size={13} />}
                                {isAdded ? 'Added' : 'Add to Cart'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECURITY ───────────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div className='space-y-5'>
              {/* Change password */}
              <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
                <div className='flex items-center gap-3 mb-5'>
                  <span className='w-9 h-9 rounded-xl bg-[#127058]/10 flex items-center justify-center text-[#127058]'>
                    <Lock size={17} />
                  </span>
                  <div>
                    <h2 className='text-sm font-bold text-gray-900'>Change Password</h2>
                    <p className='text-xs text-gray-500'>Use a strong password you don't use elsewhere.</p>
                  </div>
                </div>

                {pwSaved && (
                  <div className='mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2'>
                    <Check size={14} /> Password updated successfully.
                  </div>
                )}

                <form onSubmit={handlePwSubmit} className='space-y-4 max-w-md'>
                  {[
                    { label: 'Current Password', key: 'current' as const },
                    { label: 'New Password',     key: 'next'    as const },
                    { label: 'Confirm Password', key: 'confirm' as const },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block'>{label}</label>
                      <input
                        type='password'
                        value={pwForm[key]}
                        onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder='••••••••'
                        className='w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#127058] focus:bg-white focus:ring-2 focus:ring-[#127058]/10 transition-all'
                      />
                    </div>
                  ))}
                  {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
                    <p className='text-xs text-red-500 font-medium'>Passwords do not match.</p>
                  )}
                  <button
                    type='submit'
                    disabled={!pwForm.current || !pwForm.next || pwForm.next !== pwForm.confirm}
                    className='inline-flex items-center gap-2 bg-[#127058] hover:bg-[#0e5845] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all'
                  >
                    <Lock size={14} /> Update Password
                  </button>
                </form>
              </div>

              {/* Notification preferences */}
              <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
                <div className='flex items-center gap-3 mb-5'>
                  <span className='w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600'>
                    <Bell size={17} />
                  </span>
                  <div>
                    <h2 className='text-sm font-bold text-gray-900'>Notification Preferences</h2>
                    <p className='text-xs text-gray-500'>Choose what updates you receive.</p>
                  </div>
                </div>
                <div className='space-y-4'>
                  {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      orders: 'Order & shipping updates',
                      installments: 'Installment payment reminders',
                      promotions: 'Promotions & new arrivals',
                    }
                    return (
                      <div key={key} className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-gray-700'>{labels[key]}</span>
                        <button
                          type='button'
                          role='switch'
                          aria-checked={value}
                          onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                          className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-[#127058]' : 'bg-gray-200'}`}
                        >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'left-5' : 'left-1'}`} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Danger zone */}
              <div className='bg-white border border-red-100 rounded-2xl shadow-sm p-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <span className='w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500'>
                    <Trash2 size={17} />
                  </span>
                  <div>
                    <h2 className='text-sm font-bold text-red-700'>Danger Zone</h2>
                    <p className='text-xs text-gray-500'>These actions are irreversible. Proceed with caution.</p>
                  </div>
                </div>
                <button
                  type='button'
                  className='inline-flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all'
                >
                  <X size={14} /> Delete my account
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
      <Footer />
    </>
  )
}
