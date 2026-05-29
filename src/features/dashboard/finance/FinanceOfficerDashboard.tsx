import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FO_OFFICER_PROFILE, FO_ACTIVE_LOANS_SEED } from '../../../data/mockData'
import type { DashboardNotification } from '../shared/types/dashboard.types'
import DashboardActions from '../../../components/DashboardActions'
import FoSidebar from './FoSidebar'
import FoOverviewPage from './FoOverviewPage'
import FoRequestsPage from './FoRequestsPage'
import FoLoansPage from './FoLoansPage'
import FoRiskPage from './FoRiskPage'
import FoCustomersPage from './FoCustomersPage'
import FoReportsPage from './FoReportsPage'
import FoSettingsPage from './FoSettingsPage'
import FoProfilePage from './FoProfilePage'
import { PAGE_META, FO_STATIC_ALERTS } from './foHelpers'
import './FinanceOfficerDashboard.css'

interface Props {
  onBack: () => void
  darkMode?: boolean
  onToggleDark?: () => void
  notifications?: DashboardNotification[]
  onMarkNotifRead?: (id: string) => void
}

export default function FinanceOfficerDashboard({ onBack: _onBack, darkMode = false, onToggleDark, notifications = [], onMarkNotifRead }: Props) {
  const navigate = useNavigate()
  const [page, setPage]           = useState('overview')
  const [profilePic, setProfilePic] = useState<string | null>(null)

  const overdueLoans = FO_ACTIVE_LOANS_SEED.filter((l) => l.status === 'Overdue' || l.status === 'Due Soon')
  const foNotifications: DashboardNotification[] = [
    ...FO_STATIC_ALERTS.map((a, i) => ({
      id: `FO-STATIC-${i}`,
      type: a.type as DashboardNotification['type'],
      title: a.type === 'error' ? 'Escalation needed' : a.type === 'warn' ? 'Requests awaiting' : 'Approval milestone',
      desc: a.msg,
      time: 'Today',
      read: a.type === 'info',
    })),
    ...overdueLoans.map((l) => ({
      id: l.ref,
      type: (l.status === 'Overdue' ? 'error' : 'warn') as DashboardNotification['type'],
      title: `${l.status}: ${l.customer}`,
      desc: `${l.device} — Next due: ${l.nextDue}`,
      time: 'Loan alert',
      read: false,
    })),
    ...notifications,
  ]

  const copy = PAGE_META[page] ?? PAGE_META.overview

  const renderPage = () => {
    switch (page) {
      case 'overview':  return <FoOverviewPage />
      case 'requests':  return <FoRequestsPage />
      case 'loans':     return <FoLoansPage />
      case 'risk':      return <FoRiskPage />
      case 'customers': return <FoCustomersPage />
      case 'reports':   return <FoReportsPage />
      case 'settings':  return <FoSettingsPage />
      case 'profile':   return <FoProfilePage profilePic={profilePic} onProfilePicChange={setProfilePic} />
      default:          return <FoOverviewPage />
    }
  }

  return (
    <div className="fo-layout">
      <aside className="fo-sidebar">
        <button type="button" className="fo-brand" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
          <span className="fo-brand-mark">FO</span>
          <div><strong>reviveTech</strong><p>Finance Portal</p></div>
        </button>
        <p className="fo-sidebar-caption">Loan management &amp; risk monitoring</p>
        <nav className="fo-nav">
          <FoSidebar page={page} setPage={setPage} />
        </nav>
        {/* <div className="fo-sidebar-bottom">
          <button type="button" className="fo-back-sidebar-btn" onClick={onBack}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Admin
          </button>
        </div> */}
      </aside>

      <main className="fo-main">
        <header className="fo-portal-header">
          <span className="fo-portal-tagline">FINANCE PORTAL</span>
          <DashboardActions darkMode={darkMode} onToggleDark={onToggleDark}
            userName={FO_OFFICER_PROFILE.name} role={FO_OFFICER_PROFILE.role}
            notifications={foNotifications} onMarkRead={onMarkNotifRead}
            onProfile={() => setPage('profile')} />
        </header>
        <header className="fo-topbar">
          <div><h1>{copy.title}</h1><p>{copy.subtitle}</p></div>
        </header>
        <div className="fo-section-content">{renderPage()}</div>
      </main>
    </div>
  )
}
