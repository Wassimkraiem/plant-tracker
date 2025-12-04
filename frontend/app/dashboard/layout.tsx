'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ChatBot from '@/components/ChatBot'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2">
              🌱 Plant Tracker
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-primary transition-colors">
                My Plants
              </Link>
              <Link href="/dashboard/add" className="text-gray-700 hover:text-primary transition-colors">
                Add Plant
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-gray-700">Hi, {user.username}!</span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8 relative">
        {children}
        <ChatBot />
      </main>
    </>
  )
}

