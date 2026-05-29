import type { DashboardNotification, User, Loan } from '../features/dashboard/shared/types/dashboard.types'

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'User Management' },
  { id: 'inventory', label: 'Device Inventory' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'financing', label: 'Financing' },
  { id: 'sales', label: 'Sales Analytics' },
  { id: 'logs', label: 'System Logs' },
  { id: 'profile', label: 'Profile' },
]

export const SECTION_COPY = {
  overview: {
    title: 'Overview',
    subtitle: 'Monitor your ecosystem performance and marketplace health.',
  },
  users: {
    title: 'User Management',
    subtitle: 'Manage platform users, roles, access levels, and account activity across the marketplace.',
  },
  inventory: {
    title: 'Device Inventory',
    subtitle: 'Control device stock levels, warehouse allocation, refurbishment status, and replenishment alerts.',
  },
  pricing: {
    title: 'Pricing Updates',
    subtitle: 'Configure marketplace pricing, financing tiers, and promotional adjustments for certified devices.',
  },
  financing: {
    title: 'Financing Monitoring',
    subtitle: 'Track active loans, approval pipelines, delinquency risk, and settlement performance.',
  },
  sales: {
    title: 'Sales Analytics',
    subtitle: 'Analyze revenue performance, seller contributions, and regional sales trends.',
  },
  logs: {
    title: 'System Logs',
    subtitle: 'Audit platform events, security actions, integration jobs, and administrative changes.',
  },
  technician: {
    title: 'Technician Workbench',
    subtitle:
      'Refurbishment operations hub — track assigned devices, repair progress, faults, parts usage, and completion status.',
  },
  profile: {
    title: 'My Profile',
    subtitle: 'Manage your account information, security settings, and review your recent activity.',
  },
}

/** 3.8 Technician — assigned repairs (mock) */
export const REPAIR_TICKETS_SEED = [
  {
    id: 'TKT-8821',
    device: 'iPhone 13 Pro',
    fault: 'Cracked OLED & Digitizer',
    priority: 'Urgent',
    status: 'In Progress',
    imei: '354412092345221',
    modelCode: 'A2483',
    severity: 'Critical',
    assignedAt: '2026-05-25T08:30:00',
    dueAt:      '2026-05-25T14:00:00',
    faultDetail:
      'Cracked OLED & Digitizer. Customer reports intermittent responsiveness and localized overheating near the volume rockers. Visible impact point at bottom-left corner.',
    parts: [
      { id: 'p1', label: 'iPhone 13 Pro OLED Panel (Genuine)', done: true },
      { id: 'p2', label: 'Adhesive Seal Kit', done: false },
    ],
    progress: 45,
  },
  {
    id: 'TKT-8845',
    device: 'Samsung S22 Ultra',
    fault: 'Battery Swelling / Degraded',
    priority: 'Standard',
    status: 'Pending',
    imei: '359876541098765',
    modelCode: 'SM-S908B',
    severity: 'Medium',
    assignedAt: '2026-05-25T09:15:00',
    dueAt:      '2026-05-25T17:00:00',
    faultDetail: 'Battery health at 72%. Slight swelling detected under rear glass. Recommend immediate replacement.',
    parts: [
      { id: 'p1', label: 'OEM Battery Pack', done: false },
      { id: 'p2', label: 'Rear Glass Adhesive', done: false },
    ],
    progress: 10,
  },
  {
    id: 'TKT-8902',
    device: 'MacBook Air M2',
    fault: 'Logic Board Corrosion',
    priority: 'Urgent',
    status: 'Awaiting Parts',
    imei: '—',
    modelCode: 'A2681',
    severity: 'Critical',
    assignedAt: '2026-05-24T16:00:00',
    dueAt:      '2026-05-25T10:00:00',
    faultDetail: 'Liquid ingress near USB-C controller. Corrosion on LB trace. Awaiting replacement logic board assembly.',
    parts: [
      { id: 'p1', label: 'Logic Board Assembly (M2)', done: false },
      { id: 'p2', label: 'Thermal Paste Kit', done: false },
    ],
    progress: 20,
  },
  {
    id: 'TKT-8910',
    device: 'Google Pixel 7',
    fault: 'Camera Lens Replacement',
    priority: 'Low',
    status: 'Pending',
    imei: '358901234567890',
    modelCode: 'GVU6C',
    severity: 'Minor',
    assignedAt: '2026-05-25T10:00:00',
    dueAt:      '2026-05-26T17:00:00',
    faultDetail: 'Rear camera lens cracked; sensor array intact. Cosmetic + dust ingress risk.',
    parts: [
      { id: 'p1', label: 'Rear Camera Lens Module', done: false },
    ],
    progress: 0,
  },
  {
    id: 'TKT-8955',
    device: 'iPad Pro 11"',
    fault: 'USB-C Port Failure',
    priority: 'Standard',
    status: 'In Progress',
    imei: '359001122334455',
    modelCode: 'A2759',
    severity: 'Medium',
    assignedAt: '2026-05-25T07:00:00',
    dueAt:      '2026-05-25T15:30:00',
    faultDetail: 'Intermittent charge; port pins bent. Board-level charge IC tests pending.',
    parts: [
      { id: 'p1', label: 'USB-C Flex Assembly', done: true },
      { id: 'p2', label: 'Charge IC (board-level)', done: false },
    ],
    progress: 55,
  },
]

/** Parts usage / bench stock (mock) */
export const TECH_PARTS_SEED = [
  { sku: 'PRT-OLED-13P', name: 'iPhone 13 Pro OLED (Genuine)', usedWeek: 4, onHand: 12, bin: 'A-12' },
  { sku: 'PRT-BAT-S22U', name: 'Samsung S22 Ultra Battery', usedWeek: 2, onHand: 8, bin: 'B-04' },
  { sku: 'PRT-USB-IP11', name: 'iPad Pro 11 USB-C Flex', usedWeek: 3, onHand: 5, bin: 'C-09' },
  { sku: 'PRT-LENS-PX7', name: 'Pixel 7 Rear Lens Kit', usedWeek: 1, onHand: 15, bin: 'A-22' },
  { sku: 'PRT-ADH-GEN', name: 'Universal Adhesive Seal Kit', usedWeek: 11, onHand: 42, bin: 'D-01' },
]

export const OVERVIEW_STATS = [
  { label: 'Customers', value: '1,284', change: '+6.3%', trend: 'up', icon: 'people' },
  { label: 'Total Orders', value: '842', change: '+8.2%', trend: 'up', icon: 'package' },
  { label: 'Active Technicians', value: '48', change: '-2.4%', trend: 'down', icon: 'tool' },
  { label: 'Active Finance Officers', value: '12', change: '+1', trend: 'up', icon: 'finance' },
  { label: 'Total Revenue', value: '$124,592', change: '+12.5%', trend: 'up', icon: 'dollar' },
  { label: 'Total Loans', value: '1,284', change: '+4.1%', trend: 'up', icon: 'loans' },
]

export const OVERVIEW_PIE_DATA = [
  { label: 'Orders', value: 842, color: '#025c50' },
  { label: 'Devices', value: 61, color: '#f0ab3c' },
  { label: 'Sales', value: 312, color: '#3b82f6' },
  { label: 'Loans', value: 1284, color: '#8b5cf6' },
]

export const OVERVIEW_REVENUE_TREND = [
  { month: 'Nov', revenue: 89400 },
  { month: 'Dec', revenue: 102300 },
  { month: 'Jan', revenue: 95700 },
  { month: 'Feb', revenue: 108900 },
  { month: 'Mar', revenue: 114200 },
  { month: 'Apr', revenue: 118600 },
  { month: 'May', revenue: 124592 },
]

export const OVERVIEW_ORDERS_TREND = [
  { month: 'Nov', orders: 94 },
  { month: 'Dec', orders: 112 },
  { month: 'Jan', orders: 108 },
  { month: 'Feb', orders: 121 },
  { month: 'Mar', orders: 134 },
  { month: 'Apr', orders: 129 },
  { month: 'May', orders: 142 },
]

export const APPLICATIONS_SEED = [
  { orderId: '123456780', fullName: 'Aimee Francky', rejectedOnce: true, email: 'aimeefrancky25@gmail.com', phone: '+250781930387', docs: 9, status: 'APPROVED' },
  { orderId: '101619788', fullName: 'Jean Baptiste N.', rejectedOnce: false, email: 'jean.baptiste@email.rw', phone: '+250788123456', docs: 10, status: 'REJECTED' },
  { orderId: '102334455', fullName: 'Marie Uwimana', rejectedOnce: false, email: 'marie.uwimana@gmail.com', phone: '+250789456123', docs: 8, status: 'APPROVED' },
  { orderId: '103445566', fullName: 'Eric Habimana', rejectedOnce: true, email: 'eric.h@outlook.com', phone: '+250785678901', docs: 7, status: 'REJECTED' },
  { orderId: '104556677', fullName: 'Divine Mukamana', rejectedOnce: false, email: 'divine.m@yahoo.com', phone: '+250781111222', docs: 12, status: 'APPROVED' },
  { orderId: '105667788', fullName: 'Patrick Ndayisaba', rejectedOnce: false, email: 'patrick.nd@email.rw', phone: '+250792333444', docs: 6, status: 'APPROVED' },
  { orderId: '106778899', fullName: 'Claudine Iraguha', rejectedOnce: false, email: 'claudine.i@gmail.com', phone: '+250793555666', docs: 11, status: 'REJECTED' },
]

export const USERS_SEED: User[] = [
  { id: 'USR-1001', name: 'Liam Chen',         phone: '+250 788 001 001', email: 'liam.chen@revivetech.io', role: 'Admin',           status: 'Active',      lastActive: '12 mins ago', lastActiveDate: 'May 22, 2026', joinDate: '2026-01-15' },
  { id: 'USR-1002', name: 'Sarah Miller',       phone: '+250 788 001 002', email: 'sarah.m@revivetech.rw',   role: 'Support Agent',   status: 'Active',      lastActive: '1 hr ago',    lastActiveDate: 'May 22, 2026', joinDate: '2026-02-08' },
  { id: 'USR-1003', name: 'Marcus Johnson',     phone: '+250 788 001 003', email: 'marcus.j@revivetech.rw',  role: 'Technician',      status: 'Active',      lastActive: '3 hrs ago',   lastActiveDate: 'May 22, 2026', joinDate: '2026-03-01' },
  { id: 'USR-1004', name: 'Elena Rodriguez',    phone: '+250 788 001 004', email: 'elena.r@revivetech.rw',   role: 'Finance Officer', status: 'Deactivated', lastActive: '2 days ago',  lastActiveDate: 'May 20, 2026', joinDate: '2026-02-14' },
  { id: 'USR-1005', name: 'David Smith',        phone: '+250 788 001 005', email: 'david.s@gmail.com',       role: 'Customer',        status: 'Active',      lastActive: '28 mins ago', lastActiveDate: 'May 22, 2026', joinDate: '2026-04-03' },
  { id: 'USR-1006', name: 'Claudine Iraguha',   phone: '+250 788 001 006', email: 'claudine.i@gmail.com',    role: 'Customer',        status: 'Active',      lastActive: '45 mins ago', lastActiveDate: 'May 22, 2026', joinDate: '2026-04-20' },
  { id: 'USR-1007', name: 'Patrick Ndayisaba',  phone: '+250 788 001 007', email: 'patrick.nd@gmail.com',    role: 'Customer',        status: 'Active',      lastActive: '2 hrs ago',   lastActiveDate: 'May 22, 2026', joinDate: '2026-05-17' },
  { id: 'USR-1008', name: 'Amara Diallo',       phone: '+250 788 001 008', email: 'amara.d@revivetech.rw',   role: 'Finance Officer', status: 'Active',      lastActive: '5 hrs ago',   lastActiveDate: 'May 22, 2026', joinDate: '2026-03-22' },
  { id: 'USR-1009', name: 'Jean Baptiste N.',   phone: '+250 788 001 009', email: 'jean.b@gmail.com',        role: 'Customer',        status: 'Deactivated', lastActive: '5 days ago',  lastActiveDate: 'May 17, 2026', joinDate: '2026-04-11' },
  { id: 'USR-1010', name: 'Divine Mukamana',    phone: '+250 788 001 010', email: 'divine.m@revivetech.rw',  role: 'Support Agent',   status: 'Active',      lastActive: '30 mins ago', lastActiveDate: 'May 22, 2026', joinDate: '2026-05-18' },
  { id: 'USR-1011', name: 'Eric Habimana',      phone: '+250 788 001 011', email: 'eric.h@revivetech.rw',    role: 'Technician',      status: 'Active',      lastActive: '1 hr ago',    lastActiveDate: 'May 22, 2026', joinDate: '2026-05-20' },
  { id: 'USR-1012', name: 'Marie Uwimana',      phone: '+250 788 001 012', email: 'marie.u@gmail.com',       role: 'Customer',        status: 'Active',      lastActive: '3 days ago',  lastActiveDate: 'May 19, 2026', joinDate: '2026-05-16' },
]

export const DEVICES_SEED = [
  { sku: 'DV-IP15P-128', model: 'iPhone 15 Pro',       category: 'Smartphone', stock: 14, warehouse: 'Kigali Central',  condition: 'Certified',     listPrice: 1099 },
  { sku: 'DV-S23U-256',  model: 'Samsung S23 Ultra',    category: 'Smartphone', stock: 6,  warehouse: 'Nyarugenge Hub',  condition: 'Refurbished B', listPrice: 1150 },
  { sku: 'DV-MBA-M2',    model: 'MacBook Air M2',       category: 'Laptop',     stock: 9,  warehouse: 'Kigali Central',  condition: 'New',           listPrice: 949  },
  { sku: 'DV-PX8-128',   model: 'Google Pixel 8',       category: 'Smartphone', stock: 3,  warehouse: 'Remera Depot',    condition: 'Used (Fair)',   listPrice: 699  },
  { sku: 'DV-IPP129',    model: 'iPad Pro 12.9"',       category: 'Tablet',     stock: 11, warehouse: 'Kigali Central',  condition: 'Certified',     listPrice: 899  },
  { sku: 'DV-AW6-44',    model: 'Apple Watch S6',       category: 'Wearable',   stock: 18, warehouse: 'Nyarugenge Hub',  condition: 'Refurbished A', listPrice: 299  },
  { sku: 'DV-IP14-256',  model: 'iPhone 14',            category: 'Smartphone', stock: 7,  warehouse: 'Remera Depot',    condition: 'Refurbished B', listPrice: 799  },
  { sku: 'DV-S22-128',   model: 'Samsung Galaxy S22',   category: 'Smartphone', stock: 0,  warehouse: 'Kigali Central',  condition: 'Used (Good)',   listPrice: 649  },
  { sku: 'DV-MBP-M3',    model: 'MacBook Pro M3',       category: 'Laptop',     stock: 5,  warehouse: 'Nyarugenge Hub',  condition: 'New',           listPrice: 1499 },
  { sku: 'DV-IPM6-256',  model: 'iPad Mini 6',          category: 'Tablet',     stock: 13, warehouse: 'Kigali Central',  condition: 'Refurbished A', listPrice: 599  },
  { sku: 'DV-AW8-45',    model: 'Apple Watch S8',       category: 'Wearable',   stock: 0,  warehouse: 'Remera Depot',    condition: 'Used (Good)',   listPrice: 399  },
  { sku: 'DV-PX7-128',   model: 'Google Pixel 7',       category: 'Smartphone', stock: 22, warehouse: 'Nyarugenge Hub',  condition: 'Certified',     listPrice: 549  },
]

export const PRICING_SEED = [
  { sku: 'DV-IP15P-128', model: 'iPhone 15 Pro', tier: 'Premium', cost: 700, listPrice: 1099, financeFrom: 89, promo: 'None' },
  { sku: 'DV-S23U-256', model: 'Samsung S23 Ultra', tier: 'Premium', cost: 780, listPrice: 1150, financeFrom: 95, promo: 'Spring -5%' },
  { sku: 'DV-MBA-M2', model: 'MacBook Air M2', tier: 'Business', cost: 640, listPrice: 949, financeFrom: 79, promo: 'None' },
  { sku: 'DV-PX8-128', model: 'Google Pixel 8', tier: 'Standard', cost: 480, listPrice: 699, financeFrom: 59, promo: 'Launch -8%' },
  { sku: 'DV-IPP129', model: 'iPad Pro 12.9', tier: 'Premium', cost: 590, listPrice: 899, financeFrom: 74, promo: 'None' },
]

export const FINANCING_SEED: Loan[] = [
  { ref: 'FIN-22041', customer: 'Jean Baptiste N.',  device: 'iPhone 15 Pro',     principal: 1099, term: 12, apr: 14.2, status: 'Active',       nextDue: '2026-06-01' },
  { ref: 'FIN-22038', customer: 'Marie Uwimana',     device: 'MacBook Air M2',    principal: 949,  term: 18, apr: 13.8, status: 'Approved',     nextDue: null },
  { ref: 'FIN-22035', customer: 'Eric Habimana',     device: 'Samsung S23 Ultra', principal: 1150, term: 24, apr: 15.1, status: 'Under Review', nextDue: null },
  { ref: 'FIN-22029', customer: 'Divine Mukamana',   device: 'Google Pixel 8',   principal: 699,  term: 12, apr: 14.5, status: 'Delinquent',   nextDue: '2026-05-20' },
  { ref: 'FIN-22024', customer: 'Patrick Ndayisaba', device: 'iPad Pro 12.9',    principal: 899,  term: 12, apr: 13.9, status: 'Settled',      nextDue: null },
  { ref: 'FIN-22018', customer: 'Nadia Uwase',       device: 'iPhone 14',        principal: 799,  term: 18, apr: 14.0, status: 'Active',       nextDue: '2026-05-27' },
  { ref: 'FIN-22015', customer: 'Kevin Mugisha',     device: 'MacBook Pro M3',   principal: 1499, term: 24, apr: 15.5, status: 'Delinquent',   nextDue: '2026-05-12' },
]

export const SALES_SEED = [
  { period: 'May 2026', region: 'Kigali',            orders: 312, revenue: 412800, margin: 28.4, growth: 11.2  },
  { period: 'May 2026', region: 'Eastern Province',  orders: 98,  revenue: 118450, margin: 24.1, growth: 6.8   },
  { period: 'May 2026', region: 'Western Province',  orders: 42,  revenue: 58200,  margin: 22.6, growth: -2.1  },
  { period: 'Apr 2026', region: 'Kigali',            orders: 287, revenue: 371200, margin: 27.6, growth: 9.4   },
  { period: 'Apr 2026', region: 'Eastern Province',  orders: 81,  revenue: 98400,  margin: 23.8, growth: 4.1   },
  { period: 'Apr 2026', region: 'Western Province',  orders: 49,  revenue: 61800,  margin: 21.9, growth: -1.4  },
]

export const LOGS_SEED = [
  { id: 'LOG-98421', time: '2026-05-20 11:42:18', level: 'INFO',  module: 'Auth',      message: 'Admin session validated for operations console.' },
  { id: 'LOG-98420', time: '2026-05-20 11:38:05', level: 'WARN',  module: 'Inventory', message: 'Stock threshold breached for SKU DV-PX8-128 (3 units).', count: 3 },
  { id: 'LOG-98419', time: '2026-05-20 11:22:41', level: 'INFO',  module: 'Pricing',   message: 'List price updated for iPhone 15 Pro: $1,099 → $1,049.' },
  { id: 'LOG-98418', time: '2026-05-20 10:55:12', level: 'ERROR', module: 'Payments',  message: 'Payout webhook retry failed for vendor VND-442 (attempt 3/5).', stack: 'WebhookError: Connection timeout\n  at PaymentService.retry (payments.js:142)\n  at async dispatcher (queue.js:88)', resolved: false },
  { id: 'LOG-98417', time: '2026-05-20 10:41:33', level: 'INFO',  module: 'Users',     message: 'Role changed for USR-1004: Finance Analyst → Suspended.' },
  { id: 'LOG-98416', time: '2026-05-20 10:12:09', level: 'INFO',  module: 'Sales',     message: 'Monthly sales report generated for May 2026.' },
  { id: 'LOG-98415', time: '2026-05-20 09:55:44', level: 'WARN',  module: 'Payments',  message: 'Payment gateway response time exceeded 2s threshold.' },
  { id: 'LOG-98414', time: '2026-05-20 09:41:28', level: 'ERROR', module: 'Payments',  message: 'Stripe webhook signature verification failed for event evt_3O8aBc.', stack: 'SignatureVerificationError: No signatures found\n  at WebhookEndpoint.constructEvent (stripe.js:88)\n  at router.post (webhooks.js:24)', resolved: false },
  { id: 'LOG-98413', time: '2026-05-20 09:22:17', level: 'WARN',  module: 'Inventory', message: 'Reorder triggered automatically for SKU DV-MBA-M2 (2 units left).', count: 2 },
  { id: 'LOG-98412', time: '2026-05-20 08:58:02', level: 'INFO',  module: 'Auth',      message: 'Two-factor authentication enabled for USR-2203.' },
  { id: 'LOG-98411', time: '2026-05-20 08:44:55', level: 'WARN',  module: 'Inventory', message: 'SKU DV-S23U-256 below safety stock (5 units). Supplier notified.' },
  { id: 'LOG-98410', time: '2026-05-20 08:30:19', level: 'ERROR', module: 'Inventory', message: 'Database sync failed for warehouse node WH-KGL-02. Retrying...', stack: 'SyncError: Connection reset by peer\n  at DBClient.connect (db.js:55)\n  at WarehouseSync.run (sync.js:112)', resolved: true },
  { id: 'LOG-98409', time: '2026-05-20 08:15:37', level: 'INFO',  module: 'Pricing',   message: 'Bulk price adjustment applied: 12 SKUs updated.' },
  { id: 'LOG-98408', time: '2026-05-20 07:59:11', level: 'WARN',  module: 'Payments',  message: 'High payout volume detected: $48,200 in last 6 hours. Manual review flagged.' },
  { id: 'LOG-98407', time: '2026-05-20 07:44:28', level: 'INFO',  module: 'Sales',     message: 'Kigali region crossed $400K revenue milestone for May 2026.' },
  { id: 'LOG-98406', time: '2026-05-20 07:30:51', level: 'WARN',  module: 'Auth',      message: 'Failed login attempt for admin@revivetech.io (3 attempts). Account locked 15m.' },
  { id: 'LOG-98405', time: '2026-05-20 07:18:04', level: 'INFO',  module: 'Users',     message: 'New admin account created: USR-2241 (Finance Analyst).' },
  { id: 'LOG-98404', time: '2026-05-20 07:02:39', level: 'WARN',  module: 'Inventory', message: 'SKU DV-IPP129 expiring warranty batch detected (14 units).' },
  { id: 'LOG-98403', time: '2026-05-19 23:45:00', level: 'ERROR', module: 'Payments',  message: 'Nightly reconciliation job failed: Mismatch in settlement totals.', stack: 'ReconciliationError: Expected $128,450.00 got $128,312.50\n  at Reconciler.verify (reconcile.js:88)\n  at CronJob.run (scheduler.js:44)', resolved: false },
  { id: 'LOG-98402', time: '2026-05-19 22:30:17', level: 'INFO',  module: 'Auth',      message: 'Nightly session cleanup completed. 142 expired sessions removed.' },
]

export const TECHNICIAN_PROFILE = {
  name: 'Marcus Johnson',
  initials: 'MJ',
  role: 'Senior Technician',
  id: 'TECH-0042',
  email: 'marcus.j@certified.rw',
  phone: '+250 788 901 234',
  location: 'Kigali Central Workshop',
  since: 'March 2023',
  certifications: [
    'Apple Certified Repair Technician',
    'Samsung Authorized Service Pro',
    'Google Authorized Service Provider',
  ],
}

export const TECH_PERF_STATS = [
  { label: 'Completed', value: '127', hint: 'All time' },
  { label: 'Avg. Repair Time', value: '2 d', hint: 'Last 30 days' },
  { label: 'Satisfaction', value: '98.2%', hint: 'Customer rating' },
  { label: 'Parts Accuracy', value: '99.1%', hint: 'Correct first time' },
]

export const TECH_ACTIVITY_SEED = [
  { id: 'ACT-001', at: '2026-05-21 11:42', action: 'Marked TKT-8955 (iPad Pro 11") as Completed', type: 'complete' },
  { id: 'ACT-002', at: '2026-05-21 10:15', action: 'Added fault note to TKT-8821 (iPhone 13 Pro)', type: 'note' },
  { id: 'ACT-003', at: '2026-05-20 16:30', action: 'Updated parts checklist for TKT-8902 (MacBook Air M2)', type: 'parts' },
  { id: 'ACT-004', at: '2026-05-20 14:22', action: 'Status changed: TKT-8845 → In Progress', type: 'status' },
  { id: 'ACT-005', at: '2026-05-20 09:10', action: 'New ticket assigned: TKT-8910 (Google Pixel 7)', type: 'assign' },
  { id: 'ACT-006', at: '2026-05-19 15:45', action: 'Submitted repair report for TKT-8877 (iPhone SE)', type: 'complete' },
]

// ─── Admin Profile ───────────────────────────────────────────────────────────

export const ADMIN_PROFILE = {
  name: 'Liam Chen',
  initials: 'LC',
  role: 'Super Admin',
  id: 'USR-1001',
  email: 'liam.chen@revivetech.io',
  phone: '+250 788 001 002',
  location: 'Kigali HQ',
  since: 'August 2022',
  department: 'Platform Operations',
}

export const ADMIN_ACTIVITY_LOG = [
  { id: 'ADM-001', at: '2026-05-21 11:50', action: 'Updated pricing for iPhone 15 Pro: $1,099 → $1,049', type: 'pricing' },
  { id: 'ADM-002', at: '2026-05-21 10:30', action: 'Suspended account USR-1004 (Elena Rodriguez)', type: 'users' },
  { id: 'ADM-003', at: '2026-05-21 09:15', action: 'Reviewed and approved vendor VND-442 payout', type: 'finance' },
  { id: 'ADM-004', at: '2026-05-20 16:45', action: 'Replenishment alert cleared for SKU DV-PX8-128', type: 'inventory' },
  { id: 'ADM-005', at: '2026-05-20 14:00', action: 'Generated May 2026 regional sales report', type: 'reports' },
  { id: 'ADM-006', at: '2026-05-20 11:20', action: 'Added new user USR-1006 (Claudine Iraguha) — Operations', type: 'users' },
  { id: 'ADM-007', at: '2026-05-19 17:30', action: 'System backup completed — 2,341 records archived', type: 'system' },
]

export const ADMIN_PLATFORM_STATS = [
  { label: 'Total Users Managed', value: '1,284', hint: 'All time' },
  { label: 'Marketplace Revenue', value: '$2.4M', hint: 'Year to date' },
  { label: 'Active Devices', value: '61', hint: 'In stock' },
  { label: 'Uptime', value: '99.8%', hint: 'Last 30 days' },
]

// ─── Finance Officer Dashboard ───────────────────────────────────────────────

export const FO_OFFICER_PROFILE = {
  name: 'Amara Diallo',
  initials: 'AD',
  role: 'Senior Finance Officer',
  id: 'FIN-OFF-007',
  email: 'amara.diallo@finance.rw',
  phone: '+250 788 234 567',
  location: 'Kigali Finance Hub',
  since: 'January 2024',
}

export const FO_OVERVIEW_KPIS = [
  { label: 'Total Loans', value: '1,284', change: '+6.3%', trend: 'up', icon: 'stack' },
  { label: 'Active Loans', value: '847', change: '+4.1%', trend: 'up', icon: 'pulse' },
  { label: 'Pending Requests', value: '63', change: '-12.5%', trend: 'down', icon: 'clock' },
  { label: 'Delinquent', value: '29', change: '+2.1%', trend: 'up', icon: 'alert' },
  { label: 'Total Revenue', value: '$2.4M', change: '+9.7%', trend: 'up', icon: 'dollar' },
]

export const FO_LOAN_STATUS_PIE = [
  { label: 'Active', value: 847, color: '#22c55e' },
  { label: 'Settled', value: 312, color: '#3b82f6' },
  { label: 'Pending', value: 63, color: '#f0ab3c' },
  { label: 'Delinquent', value: 29, color: '#ef4444' },
  { label: 'Under Review', value: 33, color: '#a855f7' },
]

export const FO_MONTHLY_LOANS = [
  { month: 'Nov', count: 74 },
  { month: 'Dec', count: 88 },
  { month: 'Jan', count: 102 },
  { month: 'Feb', count: 95 },
  { month: 'Mar', count: 118 },
  { month: 'Apr', count: 131 },
  { month: 'May', count: 144 },
]

export const FO_APPROVAL_TREND = [
  { month: 'Nov', rate: 72 },
  { month: 'Dec', rate: 75 },
  { month: 'Jan', rate: 78 },
  { month: 'Feb', rate: 74 },
  { month: 'Mar', rate: 81 },
  { month: 'Apr', rate: 84 },
  { month: 'May', rate: 87 },
]

export const FO_REQUESTS_SEED = [
  { ref: 'FIN-23101', customer: 'Nadia Uwase', device: 'iPhone 15 Pro', price: '$1,099', term: '12 mo', apr: '14.2%', status: 'Pending', appliedAt: '2026-05-20' },
  { ref: 'FIN-23098', customer: 'Kevin Mugisha', device: 'MacBook Air M2', price: '$949', term: '18 mo', apr: '13.8%', status: 'Under Review', appliedAt: '2026-05-19' },
  { ref: 'FIN-23095', customer: 'Fatima Nkusi', device: 'Samsung S23 Ultra', price: '$1,150', term: '24 mo', apr: '15.1%', status: 'Pending', appliedAt: '2026-05-19' },
  { ref: 'FIN-23090', customer: 'Olivier Bizimana', device: 'iPad Pro 12.9', price: '$899', term: '12 mo', apr: '13.9%', status: 'Approved', appliedAt: '2026-05-18' },
  { ref: 'FIN-23085', customer: 'Chantal Murekezi', device: 'Google Pixel 8', price: '$699', term: '12 mo', apr: '14.5%', status: 'Rejected', appliedAt: '2026-05-17' },
  { ref: 'FIN-23080', customer: 'Emmanuel Habimana', device: 'iPhone 13 Pro', price: '$799', term: '18 mo', apr: '14.0%', status: 'Pending', appliedAt: '2026-05-17' },
  { ref: 'FIN-23075', customer: 'Laetitia Ingabire', device: 'MacBook Pro M3', price: '$1,499', term: '24 mo', apr: '15.5%', status: 'Under Review', appliedAt: '2026-05-16' },
]

export const FO_ACTIVE_LOANS_SEED = [
  { ref: 'FIN-22041', customer: 'Jean Baptiste N.', device: 'iPhone 15 Pro', monthly: '$101.20', remaining: '$718.50', nextDue: '2026-06-01', status: 'Current' },
  { ref: 'FIN-22038', customer: 'Marie Uwimana', device: 'MacBook Air M2', monthly: '$62.30', remaining: '$849.20', nextDue: '2026-06-05', status: 'Current' },
  { ref: 'FIN-22035', customer: 'Eric Habimana', device: 'Samsung S23 Ultra', monthly: '$56.10', remaining: '$934.00', nextDue: '2026-06-01', status: 'Due Soon' },
  { ref: 'FIN-22029', customer: 'Divine Mukamana', device: 'Google Pixel 8', monthly: '$65.00', remaining: '$399.00', nextDue: '2026-05-17', status: 'Overdue' },
  { ref: 'FIN-22067', customer: 'Nadia Uwase', device: 'iPad Pro 12.9', monthly: '$82.70', remaining: '$726.30', nextDue: '2026-06-10', status: 'Current' },
  { ref: 'FIN-22059', customer: 'Kevin Mugisha', device: 'iPhone 13 Pro', monthly: '$74.50', remaining: '$522.00', nextDue: '2026-05-25', status: 'Due Soon' },
]

export const FO_DELINQUENT_SEED = [
  { ref: 'FIN-22029', customer: 'Divine Mukamana', device: 'Google Pixel 8', overdueDays: 4, amountDue: '$65.00', totalOwed: '$399.00', riskLevel: 'Medium', phone: '+250781111222' },
  { ref: 'FIN-22011', customer: 'Patrick Ndayisaba', device: 'Samsung S22 Ultra', overdueDays: 12, amountDue: '$56.10', totalOwed: '$672.00', riskLevel: 'High', phone: '+250792333444' },
  { ref: 'FIN-21998', customer: 'Claudine Iraguha', device: 'MacBook Air M2', overdueDays: 21, amountDue: '$62.30', totalOwed: '$849.20', riskLevel: 'Critical', phone: '+250793555666' },
  { ref: 'FIN-22003', customer: 'Thierry Munyana', device: 'iPad Pro 12.9', overdueDays: 7, amountDue: '$82.70', totalOwed: '$412.00', riskLevel: 'Medium', phone: '+250788901234' },
  { ref: 'FIN-21985', customer: 'Aline Uwamahoro', device: 'iPhone 13 Pro', overdueDays: 35, amountDue: '$74.50', totalOwed: '$223.50', riskLevel: 'Critical', phone: '+250785432100' },
]

export const FO_CUSTOMERS_SEED = [
  { id: 'CUS-1001', name: 'Jean Baptiste N.', email: 'jean.baptiste@email.rw', phone: '+250788123456', loans: 2, totalBorrowed: '$2,048', riskLevel: 'Low', status: 'Active' },
  { id: 'CUS-1002', name: 'Marie Uwimana', email: 'marie.uwimana@gmail.com', phone: '+250789456123', loans: 1, totalBorrowed: '$949', riskLevel: 'Low', status: 'Active' },
  { id: 'CUS-1003', name: 'Divine Mukamana', email: 'divine.m@yahoo.com', phone: '+250781111222', loans: 1, totalBorrowed: '$699', riskLevel: 'Medium', status: 'Delinquent' },
  { id: 'CUS-1004', name: 'Patrick Ndayisaba', email: 'patrick.nd@email.rw', phone: '+250792333444', loans: 3, totalBorrowed: '$3,297', riskLevel: 'High', status: 'Delinquent' },
  { id: 'CUS-1005', name: 'Claudine Iraguha', email: 'claudine.i@gmail.com', phone: '+250793555666', loans: 1, totalBorrowed: '$949', riskLevel: 'Critical', status: 'Delinquent' },
  { id: 'CUS-1006', name: 'Nadia Uwase', email: 'nadia.uwase@email.rw', phone: '+250788445566', loans: 1, totalBorrowed: '$1,099', riskLevel: 'Low', status: 'Active' },
  { id: 'CUS-1007', name: 'Kevin Mugisha', email: 'kevin.m@gmail.com', phone: '+250789112233', loans: 2, totalBorrowed: '$1,748', riskLevel: 'Low', status: 'Active' },
]

export const FO_DEVICES_SEED = [
  { sku: 'DV-IP15P-128', model: 'iPhone 15 Pro', category: 'Smartphone', listPrice: '$1,099', financeFrom: '$89/mo', tier: 'Premium', activeLoans: 24 },
  { sku: 'DV-S23U-256', model: 'Samsung S23 Ultra', category: 'Smartphone', listPrice: '$1,150', financeFrom: '$95/mo', tier: 'Premium', activeLoans: 18 },
  { sku: 'DV-MBA-M2', model: 'MacBook Air M2', category: 'Laptop', listPrice: '$949', financeFrom: '$79/mo', tier: 'Business', activeLoans: 31 },
  { sku: 'DV-PX8-128', model: 'Google Pixel 8', category: 'Smartphone', listPrice: '$699', financeFrom: '$59/mo', tier: 'Standard', activeLoans: 12 },
  { sku: 'DV-IPP129', model: 'iPad Pro 12.9', category: 'Tablet', listPrice: '$899', financeFrom: '$74/mo', tier: 'Premium', activeLoans: 19 },
  { sku: 'DV-IP13P-256', model: 'iPhone 13 Pro', category: 'Smartphone', listPrice: '$799', financeFrom: '$67/mo', tier: 'Standard', activeLoans: 27 },
]

export const FO_REPORTS_REGIONAL = [
  { region: 'Kigali', disbursed: '$1,240,800', collected: '$892,500', outstanding: '$348,300', defaultRate: '2.1%', loanCount: 512 },
  { region: 'Eastern Province', disbursed: '$418,200', collected: '$301,000', outstanding: '$117,200', defaultRate: '3.4%', loanCount: 178 },
  { region: 'Western Province', disbursed: '$312,500', collected: '$224,800', outstanding: '$87,700', defaultRate: '2.8%', loanCount: 134 },
  { region: 'Northern Province', disbursed: '$198,400', collected: '$142,300', outstanding: '$56,100', defaultRate: '1.9%', loanCount: 87 },
  { region: 'Southern Province', disbursed: '$230,100', collected: '$168,900', outstanding: '$61,200', defaultRate: '2.5%', loanCount: 101 },
]

export const FO_SETTINGS_SEED = {
  interestRates: { standard: 14.5, premium: 13.8, business: 12.9 },
  loanTerms: [6, 12, 18, 24, 36],
  lateFeePercent: 1.5,
  gracePeriodDays: 5,
  autoReminder: true,
  reminderDaysBefore: 3,
  escalationThresholdDays: 30,
  language: 'en',
  currency: 'USD',
}

export const FO_ACTIVITY_LOG = [
  { id: 'FAL-001', at: '2026-05-21 11:30', action: 'Approved financing request FIN-23090 (Olivier Bizimana)', type: 'approve' },
  { id: 'FAL-002', at: '2026-05-21 10:45', action: 'Sent payment reminder to Divine Mukamana (FIN-22029)', type: 'reminder' },
  { id: 'FAL-003', at: '2026-05-21 09:20', action: 'Escalated FIN-21998 (Claudine Iraguha) — 21 days overdue', type: 'escalate' },
  { id: 'FAL-004', at: '2026-05-20 16:10', action: 'Updated standard interest rate: 14.0% → 14.5%', type: 'settings' },
  { id: 'FAL-005', at: '2026-05-20 14:30', action: 'Rejected FIN-23085 (Chantal Murekezi) — insufficient docs', type: 'reject' },
  { id: 'FAL-006', at: '2026-05-20 11:00', action: 'Marked FIN-22024 (Patrick Ndayisaba) as Settled', type: 'complete' },
]

export const NOTIFICATIONS_SEED: DashboardNotification[] = [
  { id: 'NTF-001', type: 'error', title: 'Payment webhook failed', desc: 'Payout retry failed for vendor VND-442 (attempt 3/5).', time: '2 min ago', read: false },
  { id: 'NTF-002', type: 'warn',  title: 'Low stock alert',        desc: 'SKU DV-PX8-128 dropped below threshold — only 3 units remain.', time: '18 min ago', read: false },
  { id: 'NTF-003', type: 'warn',  title: 'Delinquent loan',        desc: 'FIN-22029 (Divine Mukamana) payment is 4 days overdue.', time: '1 hr ago', read: false },
  { id: 'NTF-004', type: 'warn',  title: 'High payout volume',     desc: '$48,200 in payouts in last 6 hrs. Manual review flagged.', time: '2 hrs ago', read: false },
  { id: 'NTF-005', type: 'info',  title: 'Revenue milestone',      desc: 'Kigali region crossed $400K revenue for May 2026.', time: '3 hrs ago', read: true },
  { id: 'NTF-006', type: 'info',  title: 'Monthly report ready',   desc: 'May 2026 sales report has been generated.', time: '4 hrs ago', read: true },
]
