import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TECHNICIAN_PROFILE } from '../../../data/mockData'
import DashboardActions from '../../../components/DashboardActions'
import TechOverviewPage from './TechOverviewPage'
import AssignedDevicesPage from './AssignedDevicesPage'
import DeviceDetailsPage from './DeviceDetailsPage'
import TechProfilePage from './TechProfilePage'
import TechSellRequestsPage from './TechSellRequestsPage'
import { NavIcon } from './TechIcons'
import { refurbishmentToTicket, ticketStatusToRefurbishment, TW_NAV } from './techHelpers'
import type { RepairTicket } from './techHelpers'
import { fetchRefurbishments, updateRefurbishment } from '../../../services/refurbishment.service'
import { getErrorMessage } from '../../../lib/api'
import type { DashboardNotification } from '../shared/types/dashboard.types'
import './TechnicianWorkbench.css'
import '../shared/styles/dashboard-layout.css'
import { DashboardMenuButton, DashboardNavOverlay, DashboardSidebarClose, useDashboardMobileNav } from '../shared/components/DashboardMobileNav'

interface Props {
  onBack: () => void
  darkMode?: boolean
  onToggleDark?: () => void
  notifications?: DashboardNotification[]
  onMarkNotifRead?: (id: string) => void
}

export default function TechnicianWorkbench({ onBack: _onBack, darkMode = false, onToggleDark, notifications = [], onMarkNotifRead }: Props) {
  const navigate = useNavigate()
  const [page, setPage]               = useState('overview')
  const [tickets, setTickets]         = useState<RepairTicket[]>([])
  const [loadError, setLoadError]     = useState<string | null>(null)
  const [selectedId, setSelectedId]   = useState<string | null>(null)
  const [faultDraft, setFaultDraft]   = useState('')
  const [savedStatus, setSavedStatus] = useState(false)
  const [profilePic, setProfilePic]   = useState<string | null>(null)
  const { open, openNav, closeNav, navClass } = useDashboardMobileNav(page)

  const loadTickets = useCallback(() => {
    fetchRefurbishments()
      .then((rows) => {
        setTickets(rows.map(refurbishmentToTicket))
        setLoadError(null)
      })
      .catch((err) => setLoadError(getErrorMessage(err)))
  }, [])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const selected = useMemo(
    () => (selectedId ? tickets.find((t) => t.id === selectedId || t.refurbishmentId === selectedId) : null),
    [tickets, selectedId],
  )

  const handleViewDevice = (id: string) => {
    const ticket = tickets.find((t) => t.id === id || t.refurbishmentId === id)
    setSelectedId(ticket?.refurbishmentId ?? id)
    setFaultDraft('')
    setSavedStatus(false)
    setPage('detail')
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    const ticket = tickets.find((t) => t.id === id || t.refurbishmentId === id)
    if (!ticket?.refurbishmentId || ticket.status === 'Completed') return
    const nextStatus = status as RepairTicket['status']
    try {
      const updated = await updateRefurbishment(ticket.refurbishmentId, {
        status: ticketStatusToRefurbishment(nextStatus),
        ...(nextStatus === 'Completed' ? { qcPassed: true } : {}),
      })
      setTickets((prev) => prev.map((t) => (t.refurbishmentId === ticket.refurbishmentId ? refurbishmentToTicket(updated) : t)))
      setSavedStatus(true)
      setTimeout(() => setSavedStatus(false), 2500)
    } catch (err) {
      setLoadError(getErrorMessage(err))
    }
  }

  const handleUpdatePriority = (id: string, priority: string) => {
    setTickets((prev) => prev.map((t) =>
      t.id === id ? { ...t, priority: priority as RepairTicket['priority'] } : t
    ))
  }

  const handleTogglePart = (ticketId: string, partId: string) => {
    setTickets((prev) => prev.map((t) => {
      if (t.id !== ticketId) return t
      const parts = t.parts.map((p) => (p.id === partId ? { ...p, done: !p.done } : p))
      const done = parts.filter((p) => p.done).length
      return { ...t, parts, progress: parts.length ? Math.round((done / parts.length) * 100) : t.progress }
    }))
  }

  const handleSubmitNote = async () => {
    const text = faultDraft.trim()
    if (!text || !selected?.refurbishmentId) return
    try {
      const updated = await updateRefurbishment(selected.refurbishmentId, {
        repairNotes: [selected.faultDetail, text].filter(Boolean).join('\n\n'),
      })
      setTickets((prev) => prev.map((t) => (t.refurbishmentId === selected.refurbishmentId ? refurbishmentToTicket(updated) : t)))
      setFaultDraft('')
    } catch (err) {
      setLoadError(getErrorMessage(err))
    }
  }

  const handleUpdateFault = async (ticketId: string, newText: string) => {
    const ticket = tickets.find((t) => t.id === ticketId || t.refurbishmentId === ticketId)
    if (!ticket?.refurbishmentId) return
    try {
      const updated = await updateRefurbishment(ticket.refurbishmentId, { diagnostics: newText })
      setTickets((prev) => prev.map((t) => (t.refurbishmentId === ticket.refurbishmentId ? refurbishmentToTicket(updated) : t)))
    } catch (err) {
      setLoadError(getErrorMessage(err))
    }
  }

  return (
    <div className={`tw-layout${navClass}`}>
      <DashboardNavOverlay open={open} onClose={closeNav} />
      <aside className="tw-sidebar" aria-label="Technician navigation">
        <DashboardSidebarClose onClick={closeNav} />
        <p className="tw-sidebar-caption">Navigation</p>
        <nav className="tw-sidebar-nav">
          {TW_NAV.map((item) => (
            <button key={item.id} type="button"
              className={`tw-nav-btn ${(page === item.id || (item.id === 'devices' && page === 'detail') || (item.id === 'sell-requests' && page === 'sell-requests')) ? 'active' : ''}`}
              onClick={() => { setPage(item.id); closeNav() }}>
              <NavIcon id={item.id} />{item.label}
            </button>
          ))}
        </nav>
        {/* <div className="tw-sidebar-bottom">
          <button type="button" className="tw-nav-back" onClick={onBack}>
            <IconBack /> Admin Portal
          </button>
        </div> */}
      </aside>

      <main className="tw-content">
        <header className="tw-portal-header">
          <DashboardMenuButton onClick={openNav} />
          <button type="button" className="tw-portal-brand" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
            <span className="tw-portal-logo" aria-hidden>VT</span>
            <div><strong>reviveTech</strong><p>Technician</p></div>
          </button>
          <span className="tw-portal-tagline">TECHNICIAN DASHBOARD</span>
          <DashboardActions darkMode={darkMode} onToggleDark={onToggleDark}
            userName={TECHNICIAN_PROFILE.name} role={TECHNICIAN_PROFILE.role}
            notifications={notifications} onMarkRead={onMarkNotifRead}
            onProfile={() => setPage('profile')} />
        </header>

        {loadError && <p className="tw-sell-error" style={{ margin: '0 24px' }}>{loadError}</p>}
        {page === 'overview' && (
          <TechOverviewPage tickets={tickets} onGoToDevices={() => setPage('devices')} onViewDevice={handleViewDevice} />
        )}
        {page === 'devices' && (
          <AssignedDevicesPage tickets={tickets} onViewDevice={handleViewDevice} onUpdateStatus={handleUpdateStatus} onRefresh={loadTickets} />
        )}
        {page === 'sell-requests' && <TechSellRequestsPage />}
        {page === 'detail' && (
          <DeviceDetailsPage ticket={selected} onBack={() => setPage('devices')}
            onTogglePart={handleTogglePart} onUpdateStatus={handleUpdateStatus}
            onUpdatePriority={handleUpdatePriority}
            onSubmitNote={handleSubmitNote} onUpdateFault={handleUpdateFault}
            faultDraft={faultDraft} setFaultDraft={setFaultDraft} savedStatus={savedStatus} />
        )}
        {page === 'profile' && (
          <TechProfilePage profilePic={profilePic} onProfilePicChange={setProfilePic} />
        )}
      </main>
    </div>
  )
}
