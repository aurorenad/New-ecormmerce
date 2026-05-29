import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useSupport, type SupportTicket, type TicketStatus, type TicketPriority } from '../../../context/SupportContext'
import './AgentDashboard.css'

// ── Icons ───────────────────────────────────────────────────────────────────
function Icon({ d, size = 16 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

const ICONS = {
  overview: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  tickets:  ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  chat:     'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  profile:  ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11m-4 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0'],
  bell:     ['M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  moon:     'M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8z',
  sun:      ['M12 1v2', 'M12 21v2', 'M4.22 4.22l1.42 1.42', 'M18.36 18.36l1.42 1.42', 'M1 12h2', 'M21 12h2', 'M4.22 19.78l1.42-1.42', 'M18.36 5.64l1.42-1.42', 'M12 7m-5 0a5 5 0 1 0 10 0 5 5 0 0 0-10 0'],
  logout:   ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  send:     ['M22 2L11 13', 'M22 2L15 22 11 13 2 9l20-7z'],
  search:   ['M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5', 'M16 16l4.5 4.5'],
  x:        ['M18 6L6 18', 'M6 6l12 12'],
  chevron:  'M6 9l6 6 6-6',
  check:    'M20 6L9 17l-5-5',
  clock:    ['M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20', 'M12 6v6l4 2'],
  refresh:  ['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10', 'M1 14l4.64 4.36A9 9 0 0 0 20.49 15'],
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11m-4 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0'],
  tag:      'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
  filter:   'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
}

// ── Status & priority helpers ────────────────────────────────────────────────
const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bg: string }> = {
  open:        { label: 'Open',        color: '#2563eb', bg: '#eff6ff' },
  in_progress: { label: 'In Progress', color: '#d97706', bg: '#fffbeb' },
  resolved:    { label: 'Resolved',    color: '#16a34a', bg: '#f0fdf4' },
  closed:      { label: 'Closed',      color: '#6b7280', bg: '#f9fafb' },
}

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: '#6b7280' },
  medium: { label: 'Medium', color: '#2563eb' },
  high:   { label: 'High',   color: '#d97706' },
  urgent: { label: 'Urgent', color: '#dc2626' },
}

// ── Notification seed ────────────────────────────────────────────────────────
const AGENT_NOTIFS = [
  { id: 'N1', type: 'info',  title: 'New ticket assigned',    desc: 'TKT-1001 from Alex Kamana',          time: '2 min ago',   read: false },
  { id: 'N2', type: 'warn',  title: 'High priority ticket',   desc: 'TKT-1002 requires urgent attention', time: '15 min ago',  read: false },
  { id: 'N3', type: 'info',  title: 'Ticket resolved',        desc: 'TKT-1003 marked as resolved',        time: '1 hour ago',  read: true  },
  { id: 'N4', type: 'error', title: 'SLA breach approaching', desc: 'TKT-1002 response SLA in 30 min',    time: '20 min ago',  read: false },
]

// ── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TicketStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`agent-badge agent-badge--${status}`}>
      {cfg.label}
    </span>
  )
}

function PriorityDot({ priority }: { priority: TicketPriority }) {
  const cfg = PRIORITY_CONFIG[priority]
  return (
    <span className="agent-priority-dot" style={{ color: cfg.color }}>
      ● {cfg.label}
    </span>
  )
}

// ── Overview Section ─────────────────────────────────────────────────────────
function OverviewSection({ tickets }: { tickets: SupportTicket[] }) {
  const open       = tickets.filter((t) => t.status === 'open').length
  const inProgress = tickets.filter((t) => t.status === 'in_progress').length
  const resolved   = tickets.filter((t) => t.status === 'resolved').length
  const urgent     = tickets.filter((t) => t.priority === 'urgent').length
  const unread     = tickets.reduce((s, t) => s + t.unreadByAgent, 0)

  const kpis = [
    { label: 'Open Tickets',     value: open,       icon: ICONS.tickets, color: '#2563eb', bg: '#eff6ff' },
    { label: 'In Progress',      value: inProgress,  icon: ICONS.refresh, color: '#d97706', bg: '#fffbeb' },
    { label: 'Resolved Today',   value: resolved,    icon: ICONS.check,   color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Urgent',           value: urgent,      icon: ICONS.bell,    color: '#dc2626', bg: '#fef2f2' },
    { label: 'Unread Messages',  value: unread,      icon: ICONS.chat,    color: '#7c3aed', bg: '#f5f3ff' },
  ]

  return (
    <div className="agent-section">
      <div className="agent-kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="agent-kpi-card">
            <div className="agent-kpi-icon" style={{ background: k.bg, color: k.color }}>
              <Icon d={k.icon} size={18} />
            </div>
            <div>
              <p className="agent-kpi-value">{k.value}</p>
              <p className="agent-kpi-label">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="agent-overview-grid">
        {/* Recent tickets */}
        <div className="agent-card">
          <h3 className="agent-card-title">Recent Tickets</h3>
          <div className="agent-ticket-mini-list">
            {tickets.slice(0, 5).map((t) => (
              <div key={t.id} className="agent-ticket-mini-row">
                <div className="agent-ticket-mini-meta">
                  <span className="agent-ticket-mini-id">{t.id}</span>
                  <span className="agent-ticket-mini-subject">{t.subject}</span>
                </div>
                <div className="agent-ticket-mini-right">
                  <StatusBadge status={t.status} />
                  {t.unreadByAgent > 0 && (
                    <span className="agent-unread-pip">{t.unreadByAgent}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="agent-card">
          <h3 className="agent-card-title">Category Breakdown</h3>
          <CategoryBreakdown tickets={tickets} />
        </div>
      </div>
    </div>
  )
}

function CategoryBreakdown({ tickets }: { tickets: SupportTicket[] }) {
  const counts: Record<string, number> = {}
  tickets.forEach((t) => {
    counts[t.category] = (counts[t.category] ?? 0) + 1
  })
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const total = tickets.length || 1
  const COLORS = ['#025c50', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#16a34a', '#6b7280']

  return (
    <div className="agent-category-list">
      {entries.map(([cat, count], i) => (
        <div key={cat} className="agent-category-row">
          <span className="agent-category-name">{cat}</span>
          <div className="agent-category-bar-wrap">
            <div
              className="agent-category-bar"
              style={{ width: `${(count / total) * 100}%`, background: COLORS[i % COLORS.length] }}
            />
          </div>
          <span className="agent-category-count">{count}</span>
        </div>
      ))}
    </div>
  )
}

// ── Tickets List Section ─────────────────────────────────────────────────────
function TicketsSection({
  tickets,
  onOpenChat,
}: {
  tickets: SupportTicket[]
  onOpenChat: (ticket: SupportTicket) => void
}) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TicketPriority | 'all'>('all')
  const { updateTicketStatus, updateTicketPriority } = useSupport()

  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase())
    const matchStatus   = filterStatus === 'all'   || t.status === filterStatus
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  })

  return (
    <div className="agent-section">
      {/* Toolbar */}
      <div className="agent-toolbar">
        <div className="agent-search-wrap">
          <Icon d={ICONS.search} size={14} />
          <input
            className="agent-search"
            placeholder="Search tickets, customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="agent-filter-group">
          <Icon d={ICONS.filter} size={13} />
          <select
            className="agent-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TicketStatus | 'all')}
          >
            <option value="all">All Status</option>
            {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
          <select
            className="agent-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as TicketPriority | 'all')}
          >
            <option value="all">All Priority</option>
            {(Object.keys(PRIORITY_CONFIG) as TicketPriority[]).map((p) => (
              <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="agent-card agent-table-wrap">
        <table className="agent-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="agent-table-empty">No tickets match your filters.</td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className={t.unreadByAgent > 0 ? 'agent-row-unread' : ''}>
                  <td>
                    <span className="agent-ticket-id">{t.id}</span>
                    {t.unreadByAgent > 0 && <span className="agent-unread-pip agent-unread-pip--sm">{t.unreadByAgent}</span>}
                  </td>
                  <td>
                    <div className="agent-customer-cell">
                      <span className="agent-customer-avatar">{t.customerName.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>
                      <div>
                        <p className="agent-customer-name">{t.customerName}</p>
                        <p className="agent-customer-email">{t.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="agent-subject-cell">{t.subject}</td>
                  <td><span className="agent-category-chip">{t.category}</span></td>
                  <td>
                    <select
                      className="agent-inline-select"
                      value={t.priority}
                      style={{ color: PRIORITY_CONFIG[t.priority].color }}
                      onChange={(e) => updateTicketPriority(t.id, e.target.value as TicketPriority)}
                    >
                      {(Object.keys(PRIORITY_CONFIG) as TicketPriority[]).map((p) => (
                        <option key={p} value={p} style={{ color: PRIORITY_CONFIG[p].color }}>{PRIORITY_CONFIG[p].label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="agent-inline-select"
                      value={t.status}
                      onChange={(e) => updateTicketStatus(t.id, e.target.value as TicketStatus)}
                    >
                      {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="agent-updated-cell">{t.updatedAt}</td>
                  <td>
                    <button
                      type="button"
                      className="agent-reply-btn"
                      onClick={() => onOpenChat(t)}
                    >
                      <Icon d={ICONS.chat} size={13} />
                      Reply
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Active Chats Section ─────────────────────────────────────────────────────
function ActiveChatsSection({
  tickets,
  initialTicket,
}: {
  tickets: SupportTicket[]
  initialTicket: SupportTicket | null
}) {
  const { user } = useAuth()
  const { sendAgentMessage, markReadByAgent, getTicketById } = useSupport()
  const [selected, setSelected] = useState<SupportTicket | null>(initialTicket)
  const [reply, setReply] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const liveTicket = selected ? getTicketById(selected.id) ?? selected : null

  useEffect(() => {
    if (initialTicket) setSelected(initialTicket)
  }, [initialTicket])

  useEffect(() => {
    if (liveTicket) markReadByAgent(liveTicket.id)
  }, [liveTicket?.id, markReadByAgent])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [liveTicket?.messages.length])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!liveTicket || !reply.trim() || !user) return
    sendAgentMessage(liveTicket.id, user.name, reply.trim())
    setReply('')
  }

  const openTickets = tickets.filter((t) => t.status !== 'closed')

  return (
    <div className="agent-section agent-chats-layout">
      {/* Ticket list pane */}
      <div className="agent-chat-list-pane agent-card">
        <p className="agent-chat-list-title">Conversations</p>
        {openTickets.length === 0 ? (
          <p className="agent-chat-empty">No open tickets.</p>
        ) : (
          openTickets.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`agent-chat-row${liveTicket?.id === t.id ? ' agent-chat-row--active' : ''}`}
              onClick={() => setSelected(t)}
            >
              <span className="agent-chat-row-avatar">{t.customerName.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>
              <div className="agent-chat-row-body">
                <div className="agent-chat-row-top">
                  <span className="agent-chat-row-name">{t.customerName}</span>
                  <span className="agent-chat-row-time">{t.updatedAt}</span>
                </div>
                <span className="agent-chat-row-subject">{t.subject}</span>
                <div className="agent-chat-row-bottom">
                  <StatusBadge status={t.status} />
                  {t.unreadByAgent > 0 && <span className="agent-unread-pip">{t.unreadByAgent}</span>}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Chat pane */}
      <div className="agent-chat-pane agent-card">
        {!liveTicket ? (
          <div className="agent-chat-placeholder">
            <Icon d={ICONS.chat} size={40} />
            <p>Select a conversation to start replying</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="agent-chat-header">
              <div className="agent-chat-header-meta">
                <span className="agent-chat-header-avatar">{liveTicket.customerName.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>
                <div>
                  <p className="agent-chat-header-name">{liveTicket.customerName}</p>
                  <p className="agent-chat-header-sub">{liveTicket.subject} · {liveTicket.id}</p>
                </div>
              </div>
              <div className="agent-chat-header-actions">
                <PriorityDot priority={liveTicket.priority} />
                <StatusBadge status={liveTicket.status} />
              </div>
            </div>

            {/* Messages */}
            <div className="agent-messages">
              {liveTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`agent-message${msg.sender === 'agent' ? ' agent-message--agent' : ' agent-message--customer'}`}
                >
                  <div className="agent-message-bubble">
                    <p className="agent-message-sender">{msg.senderName}</p>
                    <p className="agent-message-text">{msg.text}</p>
                    <span className="agent-message-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply box */}
            <form className="agent-reply-form" onSubmit={handleSend}>
              <textarea
                className="agent-reply-textarea"
                placeholder={`Reply to ${liveTicket.customerName}…`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e) }
                }}
              />
              <div className="agent-reply-footer">
                <span className="agent-reply-hint">Press Enter to send, Shift+Enter for new line</span>
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="agent-send-btn"
                >
                  <Icon d={ICONS.send} size={14} />
                  Send Reply
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ── Profile Section ──────────────────────────────────────────────────────────
function ProfileSection() {
  const { user } = useAuth()
  const { tickets } = useSupport()
  const agentTickets = tickets // all tickets are handled by agent
  const resolved = agentTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length
  const open     = agentTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length

  return (
    <div className="agent-section">
      <div className="agent-profile-layout">
        <div className="agent-card agent-profile-card">
          <div className="agent-profile-avatar-wrap">
            <div className="agent-profile-avatar">
              {user?.name.split(' ').map((p) => p[0]).join('').slice(0, 2) ?? 'SA'}
            </div>
            <span className="agent-profile-online-dot" />
          </div>
          <h2 className="agent-profile-name">{user?.name ?? 'Support Agent'}</h2>
          <p className="agent-profile-role">Customer Support Agent</p>
          <p className="agent-profile-email">{user?.email ?? 'agent@demo.com'}</p>

          <div className="agent-profile-stats">
            <div className="agent-profile-stat">
              <span className="agent-profile-stat-value">{agentTickets.length}</span>
              <span className="agent-profile-stat-label">Total Tickets</span>
            </div>
            <div className="agent-profile-stat">
              <span className="agent-profile-stat-value">{resolved}</span>
              <span className="agent-profile-stat-label">Resolved</span>
            </div>
            <div className="agent-profile-stat">
              <span className="agent-profile-stat-value">{open}</span>
              <span className="agent-profile-stat-label">Active</span>
            </div>
          </div>
        </div>

        <div className="agent-card agent-profile-info-card">
          <h3 className="agent-card-title">Account Information</h3>
          <div className="agent-profile-info-list">
            {[
              { label: 'Full Name',    value: user?.name ?? 'Sarah Mitchell' },
              { label: 'Email',        value: user?.email ?? 'agent@demo.com' },
              { label: 'Role',         value: 'Customer Support Agent' },
              { label: 'Agent ID',     value: user?.id ?? 'USR-0005' },
              { label: 'Department',   value: 'Customer Experience' },
              { label: 'Shift',        value: 'Mon – Fri, 08:00 – 17:00' },
              { label: 'Languages',    value: 'English, Kinyarwanda, French' },
            ].map((row) => (
              <div key={row.label} className="agent-profile-info-row">
                <span className="agent-profile-info-label">{row.label}</span>
                <span className="agent-profile-info-value">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Header ───────────────────────────────────────────────────────────────────
function AgentHeader({
  darkMode,
  onToggleDark,
  notifications,
  onMarkRead,
  title,
  subtitle,
}: {
  darkMode: boolean
  onToggleDark: () => void
  notifications: { id: string; type: string; title: string; desc: string; time: string; read: boolean }[]
  onMarkRead: (id: string) => void
  title: string
  subtitle: string
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showNotif, setShowNotif]       = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const notifRef    = useRef<HTMLDivElement>(null)
  const userRef     = useRef<HTMLDivElement>(null)

  const unread  = notifications.filter((n) => !n.read).length
  const initials = user?.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() ?? 'SA'

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function markAll() { notifications.forEach((n) => { if (!n.read) onMarkRead(n.id) }) }

  const TYPE_COLOR: Record<string, string> = { error: '#dc2626', warn: '#d97706', info: '#16a34a' }

  return (
    <header className="agent-header">
      <div className="agent-header-left">
        <span className="agent-header-portal-tag">SUPPORT PORTAL</span>
        <div>
          <h1 className="agent-header-title">{title}</h1>
          <p className="agent-header-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="agent-header-actions">
        {/* Notifications */}
        <div className="agent-action-wrap" ref={notifRef}>
          <button
            type="button"
            className="agent-icon-btn"
            onClick={() => setShowNotif((v) => !v)}
            aria-label="Notifications"
          >
            <Icon d={ICONS.bell} size={15} />
            {unread > 0 && <span className="agent-action-badge">{unread}</span>}
          </button>
          {showNotif && (
            <div className="agent-notif-panel">
              <div className="agent-notif-panel-header">
                <span>Notifications</span>
                {unread > 0 && <button type="button" onClick={markAll} className="agent-notif-mark-all">Mark all read</button>}
                <button type="button" onClick={() => setShowNotif(false)} className="agent-notif-close"><Icon d={ICONS.x} size={13} /></button>
              </div>
              <ul className="agent-notif-list">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`agent-notif-item${n.read ? ' agent-notif-item--read' : ''}`}
                    onClick={() => !n.read && onMarkRead(n.id)}
                  >
                    <span style={{ color: TYPE_COLOR[n.type] ?? '#22c55e' }}>●</span>
                    <div className="agent-notif-body">
                      <p className="agent-notif-item-title">{n.title}</p>
                      <p className="agent-notif-item-desc">{n.desc}</p>
                      <span className="agent-notif-time">{n.time}</span>
                    </div>
                    {!n.read && <span className="agent-notif-unread-dot" />}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          type="button"
          className="agent-icon-btn"
          onClick={onToggleDark}
          aria-label={darkMode ? 'Light mode' : 'Dark mode'}
        >
          <Icon d={darkMode ? ICONS.sun : ICONS.moon} size={15} />
        </button>

        {/* User chip */}
        <div className="agent-user-wrap" ref={userRef}>
          <button
            type="button"
            className={`agent-user-chip${showUserMenu ? ' agent-user-chip--open' : ''}`}
            onClick={() => setShowUserMenu((v) => !v)}
          >
            <span className="agent-user-avatar">{initials}</span>
            <span className="agent-user-meta">
              <strong>{user?.name ?? 'Agent'}</strong>
              <span>Support Agent</span>
            </span>
            <span className="agent-online-dot" />
            <Icon d={ICONS.chevron} size={12} />
          </button>

          {showUserMenu && (
            <div className="agent-user-dropdown">
              <div className="agent-user-dropdown-header">
                <span>{user?.name}</span>
                <span className="agent-user-dropdown-role">Support Agent</span>
              </div>
              <div className="agent-user-dropdown-divider" />
              <button
                type="button"
                className="agent-user-menu-item agent-user-menu-item--logout"
                onClick={() => { logout(); navigate('/login', { replace: true }) }}
              >
                <Icon d={ICONS.logout} size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
type AgentTab = 'overview' | 'tickets' | 'chats' | 'profile'

const TAB_CONFIG: Record<AgentTab, { label: string; icon: string | string[]; title: string; subtitle: string }> = {
  overview: {
    label: 'Overview',
    icon: ICONS.overview,
    title: 'Overview',
    subtitle: 'Monitor support activity and ticket health across all customers.',
  },
  tickets: {
    label: 'All Tickets',
    icon: ICONS.tickets,
    title: 'Support Tickets',
    subtitle: 'View, filter, and manage all customer support requests.',
  },
  chats: {
    label: 'Active Chats',
    icon: ICONS.chat,
    title: 'Active Conversations',
    subtitle: 'Reply to customer messages and resolve open tickets in real time.',
  },
  profile: {
    label: 'My Profile',
    icon: ICONS.profile,
    title: 'My Profile',
    subtitle: 'View your account details and support performance metrics.',
  },
}

export default function AgentDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab]         = useState<AgentTab>('overview')
  const [darkMode, setDarkMode]           = useState(false)
  const [notifications, setNotifications] = useState(AGENT_NOTIFS)
  const [chatTicket, setChatTicket]       = useState<SupportTicket | null>(null)

  const { tickets } = useSupport()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    return () => document.documentElement.setAttribute('data-theme', 'light')
  }, [darkMode])

  function markNotifRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function handleOpenChat(ticket: SupportTicket) {
    setChatTicket(ticket)
    setActiveTab('chats')
  }

  const tab = TAB_CONFIG[activeTab]
  const unreadTotal = tickets.reduce((s, t) => s + t.unreadByAgent, 0)

  return (
    <div className="agent-dashboard">
      {/* Sidebar */}
      <aside className="agent-sidebar">
        <button type="button" className="agent-brand" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <span className="agent-brand-mark">JS</span>
          <div>
            <strong className="agent-brand-name">Jaribu Support</strong>
            <p className="agent-brand-sub">Agent Portal</p>
          </div>
        </button>

        <p className="agent-sidebar-caption">Customer experience &amp; support</p>

        <nav className="agent-nav">
          {(Object.entries(TAB_CONFIG) as [AgentTab, typeof TAB_CONFIG[AgentTab]][]).map(([id, cfg]) => (
            <button
              key={id}
              type="button"
              className={`agent-nav-btn${activeTab === id ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon d={cfg.icon} size={15} />
              <span>{cfg.label}</span>
              {id === 'chats' && unreadTotal > 0 && (
                <span className="agent-nav-badge">{unreadTotal}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="agent-sidebar-footer">
          <div className="agent-sidebar-footer-status">
            <span className="agent-online-dot agent-online-dot--lg" />
            <span>Online &amp; Available</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="agent-main">
        <AgentHeader
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          notifications={notifications}
          onMarkRead={markNotifRead}
          title={tab.title}
          subtitle={tab.subtitle}
        />

        <div className="agent-content">
          {activeTab === 'overview' && <OverviewSection tickets={tickets} />}
          {activeTab === 'tickets'  && <TicketsSection tickets={tickets} onOpenChat={handleOpenChat} />}
          {activeTab === 'chats'    && <ActiveChatsSection tickets={tickets} initialTicket={chatTicket} />}
          {activeTab === 'profile'  && <ProfileSection />}
        </div>
      </main>
    </div>
  )
}
