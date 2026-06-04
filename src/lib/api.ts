import axios, { type AxiosError } from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function axiosErrorData(error: AxiosError): { message?: string; error?: string } | undefined {
  const data = error.response?.data
  if (data && typeof data === 'object') {
    return data as { message?: string; error?: string }
  }
  return undefined
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = axiosErrorData(error)
    if (typeof data?.message === 'string' && data.message) return data.message
    if (typeof data?.error === 'string' && data.error) return data.error
    return error.message || 'Request failed'
  }
  if (error instanceof Error) return error.message
  return 'Request failed'
}

export type ApiError = AxiosError<{ message?: string; error?: string }>
