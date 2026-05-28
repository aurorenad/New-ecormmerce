import { useRef, useState } from 'react'
import { FO_OFFICER_PROFILE, FO_ACTIVITY_LOG } from '../../../data/mockData'
import '../admin/sections/profile/ProfileSection.css'

interface Props {
  profilePic: string | null
  onProfilePicChange: (url: string) => void
}

const COLOR_MAP: Record<string, string> = {
  approve: '#22c55e', reject: '#ef4444', reminder: '#f0ab3c',
  escalate: '#ef4444', settings: '#3b82f6', complete: '#22c55e',
}

const PROF_STATS = [
  { label: 'Loans Processed',    val: '1,284', hint: 'All time' },
  { label: 'Approval Rate',      val: '87%',   hint: 'Last 90 days' },
  { label: 'Avg Review Time',    val: '1.4d',  hint: 'Per application' },
  { label: 'Delinquency Handled',val: '212',   hint: 'Resolved cases' },
]

export default function FoProfilePage({ profilePic, onProfilePicChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [editName,  setEditName]  = useState(false)
  const [name,      setName]      = useState(FO_OFFICER_PROFILE.name)
  const [editEmail, setEditEmail] = useState(false)
  const [email,     setEmail]     = useState(FO_OFFICER_PROFILE.email)
  const [saved,     setSaved]     = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onProfilePicChange(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="fo-page-wrap">
      <div className="prf-page">
        <div className="prf-left">
          <div className="prf-card fo-panel-card">
            <div className="prf-cover"><div className="prf-cover-accent" /><div className="prf-cover-accent2" /></div>
            <div className="prf-card-body">
              <div className="prf-avatar-ring" onClick={() => fileRef.current?.click()}>
                {profilePic
                  ? <img src={profilePic} alt="Profile" className="prf-avatar-img" />
                  : <div className="prf-avatar-initials">{FO_OFFICER_PROFILE.initials}</div>}
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload photo
              </button>
              <div className="prf-name-row">
                {editName
                  ? <input className="prf-name-input" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setEditName(false)} autoFocus />
                  : <><h2 className="prf-name">{name}</h2><button type="button" className="prf-edit-btn" onClick={() => setEditName(true)}>Edit</button></>}
              </div>
              <span className="prf-role-tag">{FO_OFFICER_PROFILE.role}</span>
              <p className="prf-id">{FO_OFFICER_PROFILE.id}</p>
              <div className="prf-info-list">
                <div className="prf-info-item">
                  <span className="prf-info-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
                  <div className="prf-info-text"><p className="prf-info-label">Email</p>
                    {editEmail
                      ? <input className="prf-inline-input" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEditEmail(false)} autoFocus />
                      : <span className="prf-info-val">{email} <button type="button" className="prf-edit-btn" onClick={() => setEditEmail(true)}>Edit</button></span>}
                  </div>
                </div>
                <div className="prf-info-item">
                  <span className="prf-info-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
                  <div className="prf-info-text"><p className="prf-info-label">Phone</p><span className="prf-info-val">{FO_OFFICER_PROFILE.phone}</span></div>
                </div>
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
            {PROF_STATS.map((s) => (
              <div key={s.label} className="prf-stat-card">
                <p className="prf-stat-num">{s.val}</p>
                <p className="prf-stat-label">{s.label}</p>
                <p className="prf-stat-hint">{s.hint}</p>
              </div>
            ))}
          </div>
          <article className="prf-section-card">
            <h3 className="prf-section-title">Recent Activity</h3>
            <ul className="prf-timeline">
              {FO_ACTIVITY_LOG.map((a) => (
                <li key={a.id} className="prf-timeline-item">
                  <span className="prf-timeline-dot" style={{ background: COLOR_MAP[a.type] ?? '#64748b' }} />
                  <div><p className="prf-timeline-action">{a.action}</p><p className="prf-timeline-time">{a.at}</p></div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </div>
  )
}
