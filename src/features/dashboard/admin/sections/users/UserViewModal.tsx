import type { User } from '../../../shared/types/dashboard.types'
import ModalBase from '../../../shared/components/ModalBase'

interface UserViewModalProps {
  user: User
  onClose: () => void
}

export default function UserViewModal({ user, onClose }: UserViewModalProps) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const activity = [
    { icon: '🔐', text: 'Logged in successfully', time: user.lastActive },
    { icon: '👤', text: 'Profile information viewed', time: '2 days ago' },
    { icon: '🔑', text: 'Password last changed', time: '30 days ago' },
    { icon: '✅', text: 'Account created', time: user.joinDate },
  ]

  return (
    <ModalBase
      title="User Profile"
      onClose={onClose}
      footer={
        <button type="button" className="um-btn-secondary" onClick={onClose}>Close</button>
      }
    >
      <div className="um-profile-hero">
        <div className="um-avatar">{initials}</div>
        <div>
          <p className="um-profile-name">{user.name}</p>
          <div className="um-profile-badges">
            <span className="role-pill">{user.role}</span>
            <span className={`um-status um-status--${user.status.toLowerCase()}`}>{user.status}</span>
          </div>
        </div>
      </div>

      <div className="um-info-grid">
        <div className="um-info-item">
          <span className="um-info-label">User ID</span>
          <span className="um-info-value cell-mono">{user.id}</span>
        </div>
        <div className="um-info-item">
          <span className="um-info-label">Email</span>
          <a href={`mailto:${user.email}`} className="um-info-link">{user.email}</a>
        </div>
        <div className="um-info-item">
          <span className="um-info-label">Phone</span>
          <span className="um-info-value">{user.phone}</span>
        </div>
        <div className="um-info-item">
          <span className="um-info-label">Member Since</span>
          <span className="um-info-value">{user.joinDate}</span>
        </div>
        <div className="um-info-item">
          <span className="um-info-label">Last Active</span>
          <span className="um-info-value">{user.lastActive} · {user.lastActiveDate}</span>
        </div>
      </div>

      <div className="um-activity-section">
        <p className="um-activity-title">Recent Activity</p>
        <ul className="um-activity-list">
          {activity.map((a, i) => (
            <li key={i} className="um-activity-item">
              <span className="um-activity-icon">{a.icon}</span>
              <span className="um-activity-text">{a.text}</span>
              <span className="um-activity-time">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </ModalBase>
  )
}
