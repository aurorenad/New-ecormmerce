import { useRef } from 'react'
import { TECHNICIAN_PROFILE, TECH_PERF_STATS, TECH_ACTIVITY_SEED } from '../../../data/mockData'
import DonutChart from '../shared/components/DonutChart'
import RingChart from './RingChart'
import '../admin/sections/profile/ProfileSection.css'

interface Props {
  profilePic: string | null
  onProfilePicChange: (url: string) => void
}

const ACTIVITY_DOT_COLOR: Record<string, string> = {
  complete: '#10b981', note: '#3b82f6', parts: '#8b5cf6', status: '#f59e0b', assign: '#025c50',
}

const REPAIR_DIST = [
  { label: 'Completed',   value: 127, color: '#10b981' },
  { label: 'In Progress', value: 5,   color: '#3b82f6' },
  { label: 'Pending',     value: 3,   color: '#f59e0b' },
]

const INFO_ICONS = {
  email:    <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  phone:    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
  location: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  since:    <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
}

export default function TechProfilePage({ profilePic, onProfilePicChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onProfilePicChange(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const infoRows = [
    { key: 'email',    label: 'Email',        icon: INFO_ICONS.email,    val: TECHNICIAN_PROFILE.email },
    { key: 'phone',    label: 'Phone',        icon: INFO_ICONS.phone,    val: TECHNICIAN_PROFILE.phone },
    { key: 'location', label: 'Location',     icon: INFO_ICONS.location, val: TECHNICIAN_PROFILE.location },
    { key: 'since',    label: 'Member Since', icon: INFO_ICONS.since,    val: TECHNICIAN_PROFILE.since },
  ]

  return (
    <div className="prf-page">
      <div className="prf-left">
        <div className="prf-card panel-card">
          <div className="prf-cover"><div className="prf-cover-accent" /><div className="prf-cover-accent2" /></div>
          <div className="prf-card-body">
            <div className="prf-avatar-ring" onClick={() => fileRef.current?.click()}>
              {profilePic
                ? <img src={profilePic} alt="Profile" className="prf-avatar-img" />
                : <div className="prf-avatar-initials">{TECHNICIAN_PROFILE.initials}</div>}
              <div className="prf-avatar-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Upload</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
            <button type="button" className="prf-upload-label" onClick={() => fileRef.current?.click()}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload photo
            </button>
            <div className="prf-name-row"><h2 className="prf-name">{TECHNICIAN_PROFILE.name}</h2></div>
            <span className="prf-role-tag">{TECHNICIAN_PROFILE.role}</span>
            <p className="prf-id">{TECHNICIAN_PROFILE.id}</p>
            <div className="prf-info-list">
              {infoRows.map((row) => (
                <div key={row.key} className="prf-info-item">
                  <span className="prf-info-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{row.icon}</svg></span>
                  <div className="prf-info-text"><p className="prf-info-label">{row.label}</p><p className="prf-info-val">{row.val}</p></div>
                </div>
              ))}
            </div>
            <div style={{ width: '100%', marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Efficiency Score</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#025c50' }}>82 / 100</span>
              </div>
              <div className="progress"><div style={{ width: '82%', background: 'linear-gradient(90deg, #025c50, #10b981)' }} /></div>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: '4px 0 0' }}>3-day average repair time · Active status</p>
            </div>
          </div>
        </div>
        <div className="prf-section-card">
          <h3 className="prf-section-title">Certifications</h3>
          <div className="prf-cert-list">
            {TECHNICIAN_PROFILE.certifications.map((cert) => (
              <div key={cert} className="prf-cert-item">
                <svg className="prf-cert-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><polyline points="20 6 9 17 4 12"/></svg>
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="prf-right">
        <div className="prf-stats-row">
          {TECH_PERF_STATS.map((s) => (
            <div key={s.label} className="prf-stat-card">
              <p className="prf-stat-num">{s.value}</p>
              <p className="prf-stat-label">{s.label}</p>
              <p className="prf-stat-hint">{s.hint}</p>
            </div>
          ))}
        </div>
        <div className="tw-prof-charts-row">
          <section className="tw-card">
            <h3 className="tw-card-title">Repair Distribution</h3>
            <div className="tw-ov-donut-wrap">
              <DonutChart data={REPAIR_DIST} size={160} centerLabel="135" centerSub="total" />
              <div className="tw-ov-legend">
                {REPAIR_DIST.map((d) => (
                  <div key={d.label} className="tw-ov-legend-item">
                    <span className="tw-ov-legend-dot" style={{ background: d.color }} />
                    <span className="tw-ov-legend-label">{d.label}</span>
                    <span className="tw-ov-legend-count">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="tw-card tw-prof-ring-card">
            <h3 className="tw-card-title">Satisfaction Rate</h3>
            <div className="tw-prof-ring-wrap"><RingChart value={98} size={156} color="#10b981" label="satisfaction" /></div>
            <p className="tw-prof-ring-sub">98% customer satisfaction</p>
            <p className="tw-prof-ring-note">Based on feedback across 127 completed repairs.</p>
            <div className="tw-prof-ring-stats">
              <div><p className="tw-kpi-label" style={{ marginBottom: '2px' }}>Parts Accuracy</p><p className="tw-prof-ring-stat-val">99.1%</p></div>
              <div><p className="tw-kpi-label" style={{ marginBottom: '2px' }}>Avg. Repair Time</p><p className="tw-prof-ring-stat-val">2d</p></div>
            </div>
          </section>
        </div>
        <article className="prf-section-card">
          <h3 className="prf-section-title">Recent Activity</h3>
          <ul className="prf-timeline">
            {TECH_ACTIVITY_SEED.map((a) => (
              <li key={a.id} className="prf-timeline-item">
                <span className="prf-timeline-dot" style={{ background: ACTIVITY_DOT_COLOR[a.type] ?? '#94a3b8' }} />
                <div><p className="prf-timeline-action">{a.action}</p><p className="prf-timeline-time">{a.at}</p></div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}
