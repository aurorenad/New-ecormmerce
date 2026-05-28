import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
export interface SupportMessage {
  id: string
  sender: 'customer' | 'agent'
  senderName: string
  text: string
  timestamp: string
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface SupportTicket {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  subject: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  messages: SupportMessage[]
  createdAt: string
  updatedAt: string
  unreadByAgent: number
  unreadByCustomer: number
}

// ── Helpers ────────────────────────────────────────────────────────────────
function now(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

// ── Seed data ──────────────────────────────────────────────────────────────
const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1001',
    customerId: 'USR-0001',
    customerName: 'Alex Kamana',
    customerEmail: 'user@demo.com',
    subject: 'Delivery delay for my order',
    category: 'Shipping',
    priority: 'medium',
    status: 'open',
    messages: [
      {
        id: 'MSG-001',
        sender: 'customer',
        senderName: 'Alex Kamana',
        text: 'Hi, my order was supposed to arrive 3 days ago but it still hasn\'t shown up. Order #ORD-20240115. Can you help?',
        timestamp: '09:32 AM',
      },
    ],
    createdAt: '2 hours ago',
    updatedAt: '2 hours ago',
    unreadByAgent: 1,
    unreadByCustomer: 0,
  },
  {
    id: 'TKT-1002',
    customerId: 'USR-GUEST-01',
    customerName: 'Diane Mutoni',
    customerEmail: 'diane.m@example.com',
    subject: 'Device condition not as described',
    category: 'Product Quality',
    priority: 'high',
    status: 'in_progress',
    messages: [
      {
        id: 'MSG-002',
        sender: 'customer',
        senderName: 'Diane Mutoni',
        text: 'The MacBook I received has a cracked screen on the corner. The listing said Grade A condition. This is unacceptable.',
        timestamp: 'Yesterday 2:15 PM',
      },
      {
        id: 'MSG-003',
        sender: 'agent',
        senderName: 'Sarah Mitchell',
        text: 'Hi Diane, I\'m so sorry to hear about this. We take product quality very seriously. I\'ve escalated this to our quality team. Can you send us photos of the damage?',
        timestamp: 'Yesterday 2:45 PM',
      },
      {
        id: 'MSG-004',
        sender: 'customer',
        senderName: 'Diane Mutoni',
        text: 'I\'ve attached the photos. The crack is clearly visible on the bottom-left corner.',
        timestamp: 'Yesterday 3:10 PM',
      },
    ],
    createdAt: 'Yesterday',
    updatedAt: '3:10 PM',
    unreadByAgent: 1,
    unreadByCustomer: 0,
  },
  {
    id: 'TKT-1003',
    customerId: 'USR-GUEST-02',
    customerName: 'Jean Paul Habimana',
    customerEmail: 'jp.habi@example.com',
    subject: 'Question about financing plan',
    category: 'Financing',
    priority: 'low',
    status: 'resolved',
    messages: [
      {
        id: 'MSG-005',
        sender: 'customer',
        senderName: 'Jean Paul Habimana',
        text: 'What are the monthly installment options for the iPhone 14? I\'d like to pay over 12 months.',
        timestamp: 'Mon 10:00 AM',
      },
      {
        id: 'MSG-006',
        sender: 'agent',
        senderName: 'Sarah Mitchell',
        text: 'Hi Jean Paul! For the iPhone 14 at RWF 450,000, our 12-month plan breaks down to RWF 41,500/month with 0% interest for approved customers. Would you like me to start an application?',
        timestamp: 'Mon 10:20 AM',
      },
      {
        id: 'MSG-007',
        sender: 'customer',
        senderName: 'Jean Paul Habimana',
        text: 'That sounds great! Yes please.',
        timestamp: 'Mon 10:35 AM',
      },
    ],
    createdAt: 'Monday',
    updatedAt: 'Mon 10:35 AM',
    unreadByAgent: 0,
    unreadByCustomer: 0,
  },
]

// ── Context ────────────────────────────────────────────────────────────────
interface SupportContextValue {
  tickets: SupportTicket[]
  createTicket: (params: { customerId: string; customerName: string; customerEmail: string; subject: string; category: string; firstMessage: string }) => SupportTicket
  sendCustomerMessage: (ticketId: string, customerName: string, text: string) => void
  sendAgentMessage: (ticketId: string, agentName: string, text: string) => void
  markReadByAgent: (ticketId: string) => void
  markReadByCustomer: (ticketId: string) => void
  getTicketById: (id: string) => SupportTicket | undefined
  getTicketsForCustomer: (customerId: string) => SupportTicket[]
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void
  updateTicketPriority: (ticketId: string, priority: TicketPriority) => void
}

const SupportContext = createContext<SupportContextValue | null>(null)

export function SupportProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<SupportTicket[]>(SEED_TICKETS)

  const createTicket = useCallback((params: {
    customerId: string
    customerName: string
    customerEmail: string
    subject: string
    category: string
    firstMessage: string
  }): SupportTicket => {
    const ticket: SupportTicket = {
      id: genId('TKT'),
      customerId: params.customerId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      subject: params.subject,
      category: params.category,
      priority: 'medium',
      status: 'open',
      messages: [
        {
          id: genId('MSG'),
          sender: 'customer',
          senderName: params.customerName,
          text: params.firstMessage,
          timestamp: now(),
        },
      ],
      createdAt: 'Just now',
      updatedAt: now(),
      unreadByAgent: 1,
      unreadByCustomer: 0,
    }
    setTickets((prev) => [ticket, ...prev])
    return ticket
  }, [])

  const sendCustomerMessage = useCallback((ticketId: string, customerName: string, text: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: genId('MSG'), sender: 'customer', senderName: customerName, text, timestamp: now() },
              ],
              updatedAt: now(),
              unreadByAgent: t.unreadByAgent + 1,
              status: t.status === 'resolved' || t.status === 'closed' ? 'open' : t.status,
            }
          : t
      )
    )
  }, [])

  const sendAgentMessage = useCallback((ticketId: string, agentName: string, text: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: genId('MSG'), sender: 'agent', senderName: agentName, text, timestamp: now() },
              ],
              updatedAt: now(),
              unreadByCustomer: t.unreadByCustomer + 1,
              status: t.status === 'open' ? 'in_progress' : t.status,
            }
          : t
      )
    )
  }, [])

  const markReadByAgent = useCallback((ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, unreadByAgent: 0 } : t))
    )
  }, [])

  const markReadByCustomer = useCallback((ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, unreadByCustomer: 0 } : t))
    )
  }, [])

  const getTicketById = useCallback(
    (id: string) => tickets.find((t) => t.id === id),
    [tickets]
  )

  const getTicketsForCustomer = useCallback(
    (customerId: string) => tickets.filter((t) => t.customerId === customerId),
    [tickets]
  )

  const updateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: now() } : t))
    )
  }, [])

  const updateTicketPriority = useCallback((ticketId: string, priority: TicketPriority) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, priority, updatedAt: now() } : t))
    )
  }, [])

  return (
    <SupportContext.Provider
      value={{
        tickets,
        createTicket,
        sendCustomerMessage,
        sendAgentMessage,
        markReadByAgent,
        markReadByCustomer,
        getTicketById,
        getTicketsForCustomer,
        updateTicketStatus,
        updateTicketPriority,
      }}
    >
      {children}
    </SupportContext.Provider>
  )
}

export function useSupport() {
  const ctx = useContext(SupportContext)
  if (!ctx) throw new Error('useSupport must be used inside SupportProvider')
  return ctx
}
