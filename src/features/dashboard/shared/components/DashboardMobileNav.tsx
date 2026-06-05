import { useCallback, useEffect, useState } from 'react'

interface ToggleProps {
  onClick: () => void
}

export function DashboardMenuButton({ onClick }: ToggleProps) {
  return (
    <button
      type="button"
      className="dash-mobile-toggle"
      aria-label="Open navigation menu"
      onClick={onClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}

export function DashboardSidebarClose({ onClick }: ToggleProps) {
  return (
    <button
      type="button"
      className="dash-sidebar-close"
      aria-label="Close navigation menu"
      onClick={onClick}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  )
}

interface OverlayProps {
  open: boolean
  onClose: () => void
}

export function DashboardNavOverlay({ open, onClose }: OverlayProps) {
  if (!open) return null
  return (
    <button
      type="button"
      className="dash-mobile-overlay"
      aria-label="Close navigation menu"
      onClick={onClose}
    />
  )
}

/** Shared open/close state + body scroll lock for mobile drawer nav */
export function useDashboardMobileNav(resetKey?: string | number) {
  const [open, setOpen] = useState(false)
  const openNav = useCallback(() => setOpen(true), [])
  const closeNav = useCallback(() => setOpen(false), [])

  useEffect(() => {
    setOpen(false)
  }, [resetKey])

  useEffect(() => {
    document.documentElement.classList.toggle('dash-drawer-open', open)
    return () => document.documentElement.classList.remove('dash-drawer-open')
  }, [open])

  return {
    open,
    openNav,
    closeNav,
    navClass: open ? ' dash-nav-open' : '',
  }
}
