import { useRef, useState } from 'react'
import { IconCamera, IconCheck, IconEdit } from './TechIcons'
import type { RepairTicket } from './techHelpers'

interface Props {
  ticket: RepairTicket
  faultDraft: string
  setFaultDraft: (v: string) => void
  onSubmitNote: () => void
  onUpdateFault: (ticketId: string, text: string) => void
}

export default function FaultSection({ ticket, faultDraft, setFaultDraft, onSubmitNote, onUpdateFault }: Props) {
  const [editingFault, setEditingFault] = useState(false)
  const [faultEditText, setFaultEditText] = useState(ticket.faultDetail)
  const [photos, setPhotos] = useState<(string | null)[]>([null, null])
  const photoRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const handlePhotoChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotos((prev) => { const next = [...prev]; next[idx] = ev.target?.result as string; return next })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSaveFault = () => {
    const text = faultEditText.trim()
    if (text) onUpdateFault(ticket.id, text)
    setEditingFault(false)
  }

  return (
    <section className="tw-card">
      <h2 className="tw-card-title">
        <span className="tw-section-icon tw-icon-fault">!</span>
        Fault Reporting
      </h2>

      <div className="tw-fault-header">
        <p className="tw-card-sub" style={{ marginBottom: 0 }}>Fault description</p>
        {!editingFault && (
          <button type="button" className="tw-fault-edit-btn" onClick={() => setEditingFault(true)}>
            <IconEdit /> Edit
          </button>
        )}
      </div>

      {editingFault ? (
        <>
          <textarea className="tech-textarea" rows={5} value={faultEditText}
            onChange={(e) => setFaultEditText(e.target.value)} placeholder="Describe the fault in detail…" />
          <div className="tw-fault-actions">
            <button type="button" className="btn-table btn-table--primary" onClick={handleSaveFault}><IconCheck /> Save</button>
            <button type="button" className="btn-table" onClick={() => { setFaultEditText(ticket.faultDetail); setEditingFault(false) }}>Cancel</button>
          </div>
        </>
      ) : (
        <div className="tech-fault-box">{ticket.faultDetail}</div>
      )}

      <p className="tw-card-sub" style={{ marginTop: '16px' }}><IconCamera /> Diagnostic photos</p>
      <div className="tech-photo-row">
        {([['Front / Screen', 0], ['Rear / Internal', 1]] as [string, number][]).map(([label, idx]) => (
          <div key={idx} className="tech-photo-slot" onClick={() => photoRefs[idx].current?.click()}>
            {photos[idx] ? (
              <img src={photos[idx]!} alt={label} className="tech-photo-img" />
            ) : (
              <div className="tech-photo-empty">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <p className="tech-photo-empty-label">{label}</p>
                <p className="tech-photo-empty-hint">Click to upload</p>
              </div>
            )}
            <input ref={photoRefs[idx]} type="file" accept="image/*" hidden onChange={(e) => handlePhotoChange(idx, e)} />
          </div>
        ))}
      </div>

      <p className="tw-card-sub" style={{ marginTop: '16px' }}>Add an inspection note</p>
      <textarea className="tech-textarea" rows={3}
        placeholder="Describe new symptoms, observations, or escalation details…"
        value={faultDraft} onChange={(e) => setFaultDraft(e.target.value)} />
      <button type="button" className="btn-table btn-table--primary" onClick={onSubmitNote}>Submit Note</button>

      {(ticket.faultNotes?.length ?? 0) > 0 && (
        <>
          <p className="tw-card-sub" style={{ marginTop: '14px' }}>Note history</p>
          <ul className="tech-notes-list">
            {ticket.faultNotes.map((n, i) => (
              <li key={`${n.at}-${i}`}><time>{n.at}</time>{n.text}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
