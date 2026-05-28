import type { ReactNode } from 'react'

interface ModalBaseProps {
  title: string
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}

export default function ModalBase({ title, onClose, footer, children }: ModalBaseProps) {
  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">{title}</h2>
          <button type="button" className="um-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="um-modal-body">{children}</div>
        {footer && <div className="um-modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
