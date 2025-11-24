'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { api, AuthResponse, LoginRequest, RegisterRequest } from '@/lib/api'

interface AuthContextType {
  user: AuthResponse | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored auth data
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const response = await api.login(data)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))
      setUser(response)
      router.push('/dashboard')
    } catch (error) {
      throw new Error('Invalid credentials')
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await api.register(data)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))
      setUser(response)
      router.push('/dashboard')
    } catch (error) {
      throw new Error('Registration failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

