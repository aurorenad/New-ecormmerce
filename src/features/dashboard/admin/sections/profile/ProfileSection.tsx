import { useRef, useState } from 'react'
import { ADMIN_PROFILE, ADMIN_ACTIVITY_LOG, ADMIN_PLATFORM_STATS } from '../../../../../data/mockData'
import '../../../shared/styles/dashboard-shared.css'
import './ProfileSection.css'

const ACTIVITY_COLORS: Record<string, string> = {
  pricing: '#025c50', users: '#f0ab3c', finance: '#3b82f6',
  inventory: '#8b5cf6', reports: '#06b6d4', system: '#6b7280',
}

const INFO_ICONS = {
  email: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
  location: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  department: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  since: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
}

const SNAPSHOT_ITEMS = [
  { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>, val: '6',        label: 'Platform Users',    cls: 'ap-snap-teal'   },
  { icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />, val: '61',       label: 'Devices in Stock',  cls: 'ap-snap-amber'  },
  { icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,                                                                       val: '$124,592', label: 'Monthly Revenue',   cls: 'ap-snap-green'  },
  { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,                                                                                           val: '4.92 / 5', label: 'Trust Score',       cls: 'ap-snap-purple' },
  { icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>,                                                             val: '5',        label: 'Active Loans',     cls: 'ap-snap-teal'   },
  { icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,     val: '842',      label: 'New Orders',       cls: 'ap-snap-amber'  },
]

export default function ProfileSection() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [editName, setEditName]     = useState(false)
  const [name, setName]             = useState(ADMIN_PROFILE.name)
  const [editEmail, setEditEmail]   = useState(false)
  const [email, setEmail]           = useState(ADMIN_PROFILE.email)
  const [editPhone, setEditPhone]   = useState(false)
  const [phone, setPhone]           = useState(ADMIN_PROFILE.phone)
  const [saved, setSaved]           = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setProfilePic(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const infoRows = [
    { key: 'email', label: 'Email', icon: INFO_ICONS.email, content: editEmail
        ? <input className="prf-inline-input" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEditEmail(false)} autoFocus />
        : <span className="prf-info-val">{email} <button type="button" className="prf-edit-btn" onClick={() => setEditEmail(true)}>Edit</button></span> },
    { key: 'phone', label: 'Phone', icon: INFO_ICONS.phone, content: editPhone
        ? <input className="prf-inline-input" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setEditPhone(false)} autoFocus />
        : <span className="prf-info-val">{phone} <button type="button" className="prf-edit-btn" onClick={() => setEditPhone(true)}>Edit</button></span> },
    { key: 'location',   label: 'Location',   icon: INFO_ICONS.location,   content: <span className="prf-info-val">{ADMIN_PROFILE.location}</span> },
    { key: 'department', label: 'Department', icon: INFO_ICONS.department, content: <span className="prf-info-val">{ADMIN_PROFILE.department}</span> },
    { key: 'since',      label: 'Member Since', icon: INFO_ICONS.since,    content: <span className="prf-info-val">{ADMIN_PROFILE.since}</span> },
  ]

  return (
    <div className="prf-page">
      <div className="prf-left">
        <div className="prf-card panel-card">
          <div className="prf-cover">
            <div className="prf-cover-accent" />
            <div className="prf-cover-accent2" />
          </div>
          <div className="prf-card-body">
            <div className="prf-avatar-ring" onClick={() => fileRef.current?.click()}>
              {profilePic
                ? <img src={profilePic} alt="Profile" className="prf-avatar-img" />
                : <div className="prf-avatar-initials">{ADMIN_PROFILE.initials}</div>
              }
              <div className="prf-avatar-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Upload</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
            <button type="button" className="prf-upload-label" onClick={() => fileRef.current?.click()}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload photo
            </button>
            <div className="prf-name-row">
              {editName
                ? <input className="prf-name-input" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setEditName(false)} autoFocus />
                : <><h2 className="prf-name">{name}</h2><button type="button" className="prf-edit-btn" onClick={() => setEditName(true)}>Edit</button></>
              }
            </div>
            <span className="prf-role-tag">{ADMIN_PROFILE.role}</span>
            <p className="prf-id">{ADMIN_PROFILE.id}</p>
            <div className="prf-info-list">
              {infoRows.map((row) => (
                <div key={row.key} className="prf-info-item">
                  <span className="prf-info-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{row.icon}</svg></span>
                  <div className="prf-info-text"><p className="prf-info-label">{row.label}</p>{row.content}</div>
                </div>
              ))}
            </div>
            <button type="button" className={`prf-save-btn${saved ? ' prf-save-btn--saved' : ''}`}
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
              {saved ? '✓ Changes Saved' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="prf-right">
        <div className="prf-stats-row">
          {ADMIN_PLATFORM_STATS.map((s) => (
            <div key={s.label} className="prf-stat-card">
              <p className="prf-stat-num">{s.value}</p>
              <p className="prf-stat-label">{s.label}</p>
              <p className="prf-stat-hint">{s.hint}</p>
            </div>
          ))}
        </div>
        <article className="prf-section-card">
          <h3 className="prf-section-title">Platform Snapshot</h3>
          <div className="ap-snapshot-grid">
            {SNAPSHOT_ITEMS.map((item) => (
              <div key={item.label} className="ap-snapshot-item">
                <span className={`ap-snapshot-icon ${item.cls}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{item.icon}</svg>
                </span>
                <div><p className="ap-snap-val">{item.val}</p><p className="ap-snap-label">{item.label}</p></div>
              </div>
            ))}
          </div>
        </article>
        <article className="prf-section-card">
          <h3 className="prf-section-title">Recent Activity</h3>
          <ul className="prf-timeline">
            {ADMIN_ACTIVITY_LOG.map((a) => (
              <li key={a.id} className="prf-timeline-item">
                <span className="prf-timeline-dot" style={{ background: ACTIVITY_COLORS[a.type] ?? '#6b7280' }} />
                <div><p className="prf-timeline-action">{a.action}</p><p className="prf-timeline-time">{a.at}</p></div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}
