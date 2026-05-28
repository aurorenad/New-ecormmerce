// @ts-nocheck
import { useEffect, useState } from 'react'
import { ADMIN_PROFILE, NAV_ITEMS, NOTIFICATIONS_SEED, SECTION_COPY } from '../data/mockData'
import {
  FinancingSection,
  InventorySection,
  LogsSection,
  PricingSection,
  ProfileSection,
  SalesSection,
  UsersSection,
} from './AdminSections'
import OverviewSection from './OverviewSection'
import TechnicianWorkbench from './TechnicianWorkbench'
import FinanceOfficerDashboard from './FinanceOfficerDashboard'
import DashboardActions from '../components/DashboardActions'
import '../App.css'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [viewMode, setViewMode] = useState('admin')
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS_SEED)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  function toggleDark() {
    setDarkMode((v) => !v)
  }

  function markNotifRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  if (viewMode === 'technician') {
    return (
      <TechnicianWorkbench
        onBack={() => setViewMode('admin')}
        darkMode={darkMode}
        onToggleDark={toggleDark}
        notifications={notifications}
        onMarkNotifRead={markNotifRead}
      />
    )
  }

  if (viewMode === 'finance') {
    return (
      <FinanceOfficerDashboard
        onBack={() => setViewMode('admin')}
        darkMode={darkMode}
        onToggleDark={toggleDark}
        notifications={notifications}
        onMarkNotifRead={markNotifRead}
      />
    )
  }

  const copy = SECTION_COPY[activeTab] ?? SECTION_COPY.overview

  const renderSection = () => {
    switch (activeTab) {
      case 'overview':   return <OverviewSection />
      case 'users':      return <UsersSection />
      case 'inventory':  return <InventorySection />
      case 'pricing':    return <PricingSection />
      case 'financing':  return <FinancingSection />
      case 'sales':      return <SalesSection />
      case 'logs':       return <LogsSection />
      case 'profile':    return <ProfileSection />
      default:           return <OverviewSection />
    }
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">VT</span>
          <div>
            <strong>reviveTech</strong>
            <p>Management Portal</p>
          </div>
        </div>
        <p className="sidebar-caption">Platform operations &amp; analytics</p>
        <nav className="menu">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={item.id === activeTab ? 'active' : ''}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p className="sidebar-bottom-label">Operations</p>
          <button
            type="button"
            className="tech-cta-btn"
            onClick={() => setViewMode('technician')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span>Technician Dashboard</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="finance-cta-btn"
            onClick={() => setViewMode('finance')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Finance Dashboard</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>
      <main className="content">
        <header className="portal-header">
          <span className="portal-tagline">MANAGEMENT PORTAL</span>
          <DashboardActions
            darkMode={darkMode}
            onToggleDark={toggleDark}
            userName={ADMIN_PROFILE.name}
            role={ADMIN_PROFILE.role}
            notifications={notifications}
            onMarkRead={markNotifRead}
          />
        </header>

        <header className="topbar">
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
        </header>

        <div className="section-content">{renderSection()}</div>
      </main>
    </div>
  )
}

export default AdminDashboard
