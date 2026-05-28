import { createContext, useContext, useState, type ReactNode } from 'react'

// ── Mock credential table ──────────────────────────────────────────────────
// These are used for frontend testing only until the real backend is wired in.
export type UserRole = 'customer' | 'admin' | 'finance' | 'technician'

interface MockUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  redirectTo: string
}

const MOCK_USERS: MockUser[] = [
  {
    id: 'USR-0001',
    name: 'Alex Kamana',
    email: 'user@demo.com',
    password: 'User@1234',
    role: 'customer',
    redirectTo: '/',
  },
  {
    id: 'USR-0002',
    name: 'Liam Chen',
    email: 'admin@demo.com',
    password: 'Admin@1234',
    role: 'admin',
    redirectTo: '/admin',
  },
  {
    id: 'USR-0003',
    name: 'Amara Diallo',
    email: 'finance@demo.com',
    password: 'Finance@1234',
    role: 'finance',
    redirectTo: '/finance',
  },
  {
    id: 'USR-0004',
    name: 'Marcus Johnson',
    email: 'tech@demo.com',
    password: 'Tech@1234',
    role: 'technician',
    redirectTo: '/technician',
  },
]

// ── Types ──────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  redirectTo: string
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
}

// ── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  async function login(email: string, password: string): Promise<AuthUser> {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 800))

    const match = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!match) throw new Error('Invalid email or password.')

    const authUser: AuthUser = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      redirectTo: match.redirectTo,
    }

    sessionStorage.setItem('auth_user', JSON.stringify(authUser))
    setUser(authUser)
    return authUser
  }

  function logout() {
    sessionStorage.removeItem('auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

// Exported for the login page hint panel
export { MOCK_USERS }
