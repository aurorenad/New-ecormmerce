import { useState } from 'react'
import type { Device } from '../../../shared/types/dashboard.types'
import ModalBase from '../../../shared/components/ModalBase'
import { getStockClass, getStockStatus, INV_CATEGORIES, INV_CONDITIONS, INV_WAREHOUSES } from './inventoryHelpers'

interface ViewProps  { device: Device; onClose: () => void }
interface EditProps  { device: Device; onClose: () => void; onSave: (d: Device) => void }
interface AdjProps   { device: Device; onClose: () => void; onSave: (d: Device) => void }

export function DeviceViewModal({ device, onClose }: ViewProps) {
  return (
    <ModalBase title="Device Details" onClose={onClose} footer={
      <button type="button" className="um-btn-secondary" onClick={onClose}>Close</button>
    }>
      <div className="inv-view-hero">
        <div className="inv-view-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div>
          <p className="inv-view-model">{device.model}</p>
          <p className="inv-view-sku">{device.sku}</p>
        </div>
      </div>
      <div className="um-info-grid">
        <div className="um-info-item"><span className="um-info-label">Category</span><span className="um-info-value">{device.category}</span></div>
        <div className="um-info-item"><span className="um-info-label">Condition</span><span className="um-info-value">{device.condition}</span></div>
        <div className="um-info-item"><span className="um-info-label">Warehouse</span><span className="um-info-value">{device.warehouse}</span></div>
        <div className="um-info-item"><span className="um-info-label">List Price</span><span className="um-info-value">${device.listPrice.toLocaleString()}</span></div>
        <div className="um-info-item"><span className="um-info-label">Stock</span><span className="um-info-value">{device.stock} units</span></div>
        <div className="um-info-item">
          <span className="um-info-label">Status</span>
          <span className={`stock-pill ${getStockClass(device.stock)}`}>{getStockStatus(device.stock)}</span>
        </div>
      </div>
    </ModalBase>
  )
}

export function DeviceEditModal({ device, onClose, onSave }: EditProps) {
  const [form, setForm] = useState({
    model: device.model,
    category: device.category,
    condition: device.condition,
    warehouse: device.warehouse,
  })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <ModalBase title="Edit Device" onClose={onClose} footer={
      <>
        <button type="button" className="um-btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="um-btn-primary" onClick={() => { if (!form.model.trim()) return; onSave({ ...device, ...form }); onClose() }}>Save Changes</button>
      </>
    }>
      <p className="um-form-note">SKU: <strong>{device.sku}</strong></p>
      <div className="um-form-grid">
        <label className="um-form-field" style={{ gridColumn: '1 / -1' }}>
          <span className="um-form-label">Model Name</span>
          <input className="um-form-input" type="text" value={form.model} onChange={set('model')} />
        </label>
        <label className="um-form-field">
          <span className="um-form-label">Category</span>
          <select className="um-form-input" value={form.category} onChange={set('category')}>
            {INV_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="um-form-field">
          <span className="um-form-label">Condition</span>
          <select className="um-form-input" value={form.condition} onChange={set('condition')}>
            {INV_CONDITIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="um-form-field" style={{ gridColumn: '1 / -1' }}>
          <span className="um-form-label">Warehouse</span>
          <select className="um-form-input" value={form.warehouse} onChange={set('warehouse')}>
            {INV_WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
          </select>
        </label>
      </div>
    </ModalBase>
  )
}

export function AdjustStockModal({ device, onClose, onSave }: AdjProps) {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('Restock')
  const delta    = parseInt(amount, 10) || 0
  const newStock = Math.max(0, device.stock + delta)

  return (
    <ModalBase title="Adjust Stock" onClose={onClose} footer={
      <>
        <button type="button" className="um-btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="um-btn-primary" onClick={() => { if (delta === 0) return; onSave({ ...device, stock: newStock }); onClose() }} disabled={delta === 0}>Apply</button>
      </>
    }>
      <p className="um-form-note"><strong>{device.model}</strong> · {device.sku}</p>
      <div className="inv-adj-current">
        <span className="inv-adj-label">Current Stock</span>
        <span className="inv-adj-big">{device.stock} units</span>
      </div>
      <div className="inv-adj-row">
        <button type="button" className="inv-adj-btn" onClick={() => setAmount((a) => String((parseInt(a, 10) || 0) - 1))}>−</button>
        <input type="number" className="inv-adj-input" value={amount} placeholder="0" onChange={(e) => setAmount(e.target.value)} />
        <button type="button" className="inv-adj-btn" onClick={() => setAmount((a) => String((parseInt(a, 10) || 0) + 1))}>+</button>
      </div>
      {delta !== 0 && (
        <div className={`inv-adj-preview inv-adj-preview--${delta > 0 ? 'add' : 'remove'}`}>
          {delta > 0 ? `+${delta}` : delta} units → New total: <strong>{newStock}</strong>
          <span className={`stock-pill ${getStockClass(newStock)}`}>{getStockStatus(newStock)}</span>
        </div>
      )}
      <label className="um-form-field" style={{ marginTop: '8px' }}>
        <span className="um-form-label">Reason</span>
        <select className="um-form-input" value={reason} onChange={(e) => setReason(e.target.value)}>
          {['Restock', 'Damaged / Write-off', 'Transfer In', 'Transfer Out', 'Correction'].map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
    </ModalBase>
  )
}
