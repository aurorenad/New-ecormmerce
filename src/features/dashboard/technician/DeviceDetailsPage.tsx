import { IconBack, IconCheck, IconDetail } from './TechIcons'
import FaultSection from './FaultSection'
import { priorityClass, progressClass, statusPillClass, STATUS_OPTIONS } from './techHelpers'
import type { RepairTicket } from './techHelpers'

interface Props {
  ticket: RepairTicket | null | undefined
  onBack: () => void
  onTogglePart: (ticketId: string, partId: string) => void
  onUpdateStatus: (id: string, status: string) => void
  onSubmitNote: () => void
  onUpdateFault: (ticketId: string, text: string) => void
  faultDraft: string
  setFaultDraft: (v: string) => void
  savedStatus: boolean
}

export default function DeviceDetailsPage({
  ticket, onBack, onTogglePart, onUpdateStatus, onSubmitNote, onUpdateFault,
  faultDraft, setFaultDraft, savedStatus,
}: Props) {
  if (!ticket) {
    return (
      <div className="tw-page-wrap">
        <div className="tw-empty-state">
          <IconDetail />
          <h2>No device selected</h2>
          <p>Go to Assigned Devices and click a ticket to view its details here.</p>
          <button type="button" className="btn-table btn-table--primary" onClick={onBack}>
            Go to Assigned Devices
          </button>
        </div>
      </div>
    )
  }

  const doneParts = ticket.parts.filter((p) => p.done).length
  const isComplete = ticket.status === 'Completed'

  return (
    <div className="tw-page-wrap">
      <div className="tw-breadcrumb">
        <button type="button" className="tw-link-btn tw-bc-btn" onClick={onBack}>
          <IconBack /> Assigned Devices
        </button>
        <span className="tw-bc-sep">›</span>
        <span className="tw-bc-current">{ticket.device}</span>
      </div>

      <div className="tw-det-banner">
        <div className="tw-det-banner-left">
          <span className="tw-det-ticket-id">{ticket.id}</span>
          <h1 className="tw-det-device">{ticket.device}</h1>
          <p className="tw-det-meta">IMEI: {ticket.imei} · Model: {ticket.modelCode}</p>
        </div>
        <div className="tw-det-banner-right">
          <span className={priorityClass(ticket.priority)}>{ticket.priority}</span>
          <span className={statusPillClass(ticket.status)}>{ticket.status}</span>
        </div>
      </div>

      <div className="tw-det-body">
        <div className="tw-det-left">
          <FaultSection
            ticket={ticket}
            faultDraft={faultDraft}
            setFaultDraft={setFaultDraft}
            onSubmitNote={onSubmitNote}
            onUpdateFault={onUpdateFault}
          />
        </div>

        <div className="tw-det-right">
          <section className="tw-card">
            <h2 className="tw-card-title">
              <span className="tw-section-icon tw-icon-progress">↗</span>
              Repair Progress
            </h2>
            <div className="tw-det-prog-row">
              <div className={`progress tov-prog-bar ${progressClass(ticket.progress)}`} style={{ flex: 1, height: '10px' }}>
                <div style={{ width: `${ticket.progress}%` }} />
              </div>
              <span className="tw-progress-label">{ticket.progress}% complete</span>
            </div>
            <ul className="tech-parts-list" style={{ marginTop: '4px' }}>
              {ticket.parts.map((p) => (
                <li key={p.id}>
                  <label className="tech-check">
                    <input type="checkbox" checked={p.done} onChange={() => onTogglePart(ticket.id, p.id)} />
                    <span>{p.label}</span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="tw-parts-done-note">
              <IconCheck /> {doneParts} of {ticket.parts.length} parts confirmed
            </p>
          </section>

          <section className="tw-card">
            <h2 className="tw-card-title">
              <span className="tw-section-icon tw-icon-status">✓</span>
              Completion Status
            </h2>
            <p className="tw-card-sub">Update the repair status for this device</p>
            <div className="tw-status-options">
              {STATUS_OPTIONS.map((s) => (
                <button key={s} type="button"
                  className={`tw-status-opt ${ticket.status === s ? 'is-active' : ''}`}
                  onClick={() => onUpdateStatus(ticket.id, s)}>
                  {s}
                </button>
              ))}
            </div>
            {savedStatus && <p className="tw-saved-msg"><IconCheck /> Status updated</p>}
            <button type="button" className={`tw-complete-btn ${isComplete ? 'is-done' : ''}`}
              onClick={() => onUpdateStatus(ticket.id, 'Completed')} disabled={isComplete}>
              {isComplete ? <><IconCheck /> Marked as Complete</> : 'Mark as Complete'}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
