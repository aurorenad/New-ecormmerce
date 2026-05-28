import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './DashboardActions.css'

// ── Role display labels ──────────────────────────────────────────────────
const ROLE_LABELS: Record<string, string> = {
  admin:      'Admin',
  finance:    'Finance Officer',
  technician: 'Technician',
  customer:   'Customer',
  agent:      'Support Agent',
}

// ── Icons ────────────────────────────────────────────────────────────────
function IconBell() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8z" />
    </svg>
  )
}

function IconSun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconLogOut() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const TYPE_DOT = {
  error: { color: '#dc2626', label: 'Error' },
  warn:  { color: '#d97706', label: 'Warning' },
  info:  { color: '#22c55e', label: 'Info' },
}

interface Props {
  darkMode?: boolean
  onToggleDark?: () => void
  /** Called when the user clicks "Profile" in the chip dropdown */
  onProfile?: () => void
  notifications?: { id: string; type: string; title: string; desc: string; time: string; read: boolean }[]
  onMarkRead?: (id: string) => void
  // Legacy props kept for backward compat — ignored when auth context is available
  userName?: string
  role?: string
}

export default function DashboardActions({
  darkMode = false,
  onToggleDark,
  onProfile,
  notifications = [],
  onMarkRead,
  userName: userNameProp = '',
  role: roleProp = '',
}: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [showNotif, setShowNotif]     = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const notifRef    = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Prefer auth-context user; fall back to legacy props (for backward compat)
  const displayName = user?.name ?? userNameProp
  const displayRole = user?.role
    ? (ROLE_LABELS[user.role] ?? user.role)
    : roleProp

  const initials = displayName
    ? displayName.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const unread = notifications.filter((n) => !n.read).length

  // Close panels on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function markAll() {
    notifications.forEach((n) => {
      if (!n.read) onMarkRead?.(n.id)
    })
  }

  function handleLogout() {
    setShowUserMenu(false)
    logout()
    navigate('/login', { replace: true })
  }

  function handleProfile() {
    setShowUserMenu(false)
    onProfile?.()
  }

  return (
    <div className="dashboard-actions">

      {/* ── Notification bell ─────────────────────────────────────────── */}
      <div className="dashboard-action-wrap" ref={notifRef}>
        <button
          type="button"
          className="dashboard-icon-btn"
          onClick={() => setShowNotif((v) => !v)}
          aria-label="Notifications"
        >
          <IconBell />
          {unread > 0 && <span className="dashboard-action-badge">{unread}</span>}
        </button>

        {showNotif && (
          <div className="da-notif-panel">
            <div className="da-notif-header">
              <span className="da-notif-title">Notifications</span>
              {unread > 0 && (
                <button type="button" className="da-notif-mark-all" onClick={markAll}>
                  Mark all read
                </button>
              )}
              <button
                type="button"
                className="da-notif-close"
                onClick={() => setShowNotif(false)}
                aria-label="Close"
              >
                <IconX />
              </button>
            </div>

            <ul className="da-notif-list">
              {notifications.length === 0 ? (
                <li className="da-notif-empty">No notifications</li>
              ) : (
                notifications.map((n) => {
                  const dot = TYPE_DOT[n.type as keyof typeof TYPE_DOT] ?? TYPE_DOT.info
                  return (
                    <li
                      key={n.id}
                      className={`da-notif-item${n.read ? ' da-notif-item--read' : ''}`}
                      onClick={() => !n.read && onMarkRead?.(n.id)}
                    >
                      <span className="da-notif-dot-col" style={{ color: dot.color }} aria-label={dot.label}>●</span>
                      <div className="da-notif-body">
                        <p className="da-notif-item-title">{n.title}</p>
                        <p className="da-notif-item-desc">{n.desc}</p>
                        <span className="da-notif-time">{n.time}</span>
                      </div>
                      {!n.read && <span className="da-notif-unread-pip" />}
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ── Dark / light mode toggle ───────────────────────────────────── */}
      <button
        type="button"
        className="dashboard-icon-btn"
        onClick={onToggleDark}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <IconSun /> : <IconMoon />}
      </button>

      {/* ── User chip with dropdown ───────────────────────────────────── */}
      <div className="da-user-wrap" ref={userMenuRef}>
        <button
          type="button"
          className={`dashboard-user-chip${showUserMenu ? ' dashboard-user-chip--open' : ''}`}
          onClick={() => setShowUserMenu((v) => !v)}
          aria-label="User menu"
          aria-expanded={showUserMenu}
        >
          <span className="dashboard-user-avatar">{initials}</span>
          <span className="dashboard-user-meta">
            <strong>{displayName || 'User'}</strong>
            <span>{displayRole || '—'}</span>
          </span>
          <span className="dashboard-user-status" aria-hidden />
          <span className="da-user-chevron"><IconChevron /></span>
        </button>

        {showUserMenu && (
          <div className="da-user-dropdown" role="menu">
            {/* Header showing who's logged in */}
            <div className="da-user-dropdown-header">
              <span className="da-user-dropdown-name">{displayName || 'User'}</span>
              <span className="da-user-dropdown-role">{displayRole || '—'}</span>
            </div>

            <div className="da-user-dropdown-divider" />

            <button
              type="button"
              className="da-user-menu-item"
              role="menuitem"
              onClick={handleProfile}
            >
              <IconUser />
              <span>Profile</span>
            </button>

            <button
              type="button"
              className="da-user-menu-item da-user-menu-item--logout"
              role="menuitem"
              onClick={handleLogout}
            >
              <IconLogOut />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
