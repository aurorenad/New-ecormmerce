// ─── Shared notification type ─────────────────────────────────────────────────
export interface DashboardNotification {
  id: string;
  type: 'error' | 'warn' | 'info';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

// ─── Admin profile ────────────────────────────────────────────────────────────
export interface AdminProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  since: string;
}

// ─── User Management ──────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Deactivated';
  lastActive: string;
  lastActiveDate: string;
  joinDate: string;
}

// ─── Inventory ────────────────────────────────────────────────────────────────
export interface Device {
  sku: string;
  model: string;
  category: string;
  condition: string;
  warehouse: string;
  listPrice: number;
  stock: number;
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
export interface PricingRow {
  sku: string;
  model: string;
  tier: string;
  cost?: number;
  listPrice: number;
  financeFrom: number;
  promo: string;
}

// ─── Financing ────────────────────────────────────────────────────────────────
export type LoanStatus = 'Active' | 'Approved' | 'Under Review' | 'Delinquent' | 'Settled';

export interface Loan {
  ref: string;
  customer: string;
  device: string;
  principal: number;
  apr: number;
  term: number;
  status: LoanStatus;
  nextDue: string | null;
}

// ─── Sales ────────────────────────────────────────────────────────────────────
export interface SalesRow {
  period: string;
  region: string;
  revenue: number;
  orders: number;
  margin: number;
  growth: number;
}

// ─── Logs ─────────────────────────────────────────────────────────────────────
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  id: string;
  time: string;
  level: LogLevel;
  module: string;
  message: string;
  stack?: string;
  payload?: Record<string, unknown>;
  count?: number;
  resolved?: boolean;
}

// ─── Chart data ───────────────────────────────────────────────────────────────
export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface TrendPoint {
  month: string;
  revenue?: number;
  orders?: number;
}

// ─── Repair Tickets ───────────────────────────────────────────────────────────
export type TicketStatus = 'Pending' | 'In Progress' | 'Awaiting Parts' | 'Completed';
export type TicketPriority = 'Urgent' | 'Standard' | 'Low';
export type TicketSeverity = 'Critical' | 'Medium' | 'Minor';

export interface RepairPart {
  id: string;
  label: string;
  done: boolean;
}

export interface FaultNote {
  at: string;
  text: string;
}

export interface RepairTicket {
  id: string;
  device: string;
  fault: string;
  priority: TicketPriority;
  status: TicketStatus;
  imei: string;
  modelCode: string;
  severity?: TicketSeverity;
  assignedAt: string;
  dueAt?: string;
  faultDetail: string;
  parts: RepairPart[];
  progress: number;
  faultNotes?: FaultNote[];
}

export interface TechnicianProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  since: string;
  certifications: string[];
}

export interface PerfStat {
  label: string;
  value: string;
  hint: string;
}

export interface ActivityEntry {
  id: string;
  type: string;
  action: string;
  at: string;
}

// ─── Finance Officer ──────────────────────────────────────────────────────────
export type FoRequestStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
export type FoLoanStatus = 'Current' | 'Due Soon' | 'Overdue';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface FoRequest {
  ref: string;
  customer: string;
  device: string;
  price: string;
  term: string;
  apr: string;
  status: FoRequestStatus;
  appliedAt: string;
}

export interface FoActiveLoan {
  ref: string;
  customer: string;
  device: string;
  monthly: string;
  remaining: string;
  nextDue: string;
  status: FoLoanStatus;
}

export interface FoDelinquent {
  ref: string;
  customer: string;
  phone: string;
  device: string;
  overdueDays: number;
  amountDue: string;
  totalOwed: string;
  riskLevel: RiskLevel;
}

export interface FoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loans: number;
  totalBorrowed: string;
  riskLevel: RiskLevel;
  status: 'Active' | 'Delinquent';
}

export interface FoSettings {
  interestRates: { standard: number; premium: number; business: number };
  lateFeePercent: number;
  gracePeriodDays: number;
  escalationThresholdDays: number;
  autoReminder: boolean;
  reminderDaysBefore: number;
  language: string;
  currency: string;
}

export interface FoRegionalReport {
  region: string;
  disbursed: string;
  collected: string;
  outstanding: string;
  defaultRate: string;
  loanCount: number;
}

export interface FoKpiStat {
  label: string;
  value: string;
  icon: string;
  trend: 'up' | 'down';
  change: string;
}

export interface OfficerProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  since: string;
}

export interface BarDataPoint {
  month: string;
  count: number;
}

export interface LineDataPoint {
  month: string;
  rate: number;
}
