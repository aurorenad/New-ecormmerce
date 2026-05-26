import { useEffect, useRef, useState } from 'react'

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

const TYPE_DOT = {
  error: { color: '#dc2626', label: 'Error' },
  warn:  { color: '#d97706', label: 'Warning' },
  info:  { color: '#22c55e', label: 'Info' },
}

export default function DashboardActions({
  darkMode = false,
  onToggleDark,
  userName = '',
  role = '',
  notifications = [],
  onMarkRead,
}) {
  const [showNotif, setShowNotif] = useState(false)
  const wrapRef = useRef(null)

  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!showNotif) return
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showNotif])

  function markAll() {
    notifications.forEach((n) => {
      if (!n.read) onMarkRead?.(n.id)
    })
  }

  const initials = userName
    ? userName.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="dashboard-actions">

      {/* ── Notification bell ── */}
      <div className="dashboard-action-wrap" ref={wrapRef}>
        <button
          type="button"
          className="dashboard-icon-btn"
          onClick={() => setShowNotif((v) => !v)}
          aria-label="Notifications"
        >
          <IconBell />
          {unread > 0 && (
            <span className="dashboard-action-badge">{unread}</span>
          )}
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
                  const dot = TYPE_DOT[n.type] ?? TYPE_DOT.info
                  return (
                    <li
                      key={n.id}
                      className={`da-notif-item${n.read ? ' da-notif-item--read' : ''}`}
                      onClick={() => !n.read && onMarkRead?.(n.id)}
                    >
                      <span
                        className="da-notif-dot-col"
                        style={{ color: dot.color }}
                        aria-label={dot.label}
                      >
                        ●
                      </span>
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

      {/* ── Dark / light mode toggle ── */}
      <button
        type="button"
        className="dashboard-icon-btn"
        onClick={onToggleDark}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <IconSun /> : <IconMoon />}
      </button>

      {/* ── User chip ── */}
      <div className="dashboard-user-chip">
        <span className="dashboard-user-avatar">{initials}</span>
        <span className="dashboard-user-meta">
          <strong>{userName}</strong>
          <span>{role}</span>
        </span>
        <span className="dashboard-user-status" aria-hidden />
      </div>

    </div>
  )
}
