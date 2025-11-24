'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-3xl">🌱</span>
              <span className="text-2xl font-bold text-primary">Plant Tracker</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Features
              </a>
              <a href="#plants" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Plants
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors font-medium">
                About
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-primary font-semibold hover:text-green-700 transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Plant Tracker
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track, nurture, and grow your garden with expert care instructions and reminders
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/register"
              className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">💧</div>
            <h3 className="text-2xl font-bold mb-3">Watering Schedules</h3>
            <p className="text-gray-600">
              Never forget to water your plants again. Get personalized watering reminders for each plant.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-3">Expert Care Guides</h3>
            <p className="text-gray-600">
              Detailed instructions for sunlight, soil, fertilizing, pruning, and pest control for every plant.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-3">Task Management</h3>
            <p className="text-gray-600">
              Create and track care tasks like pruning, fertilizing, and harvesting to keep your garden thriving.
            </p>
          </div>
        </div>

        {/* Example Plants */}
        <div id="plants" className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12">Track Any Plant</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-2">🫒</div>
              <p className="font-semibold">Olive Trees</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-2">🍅</div>
              <p className="font-semibold">Tomatoes</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-2">🥒</div>
              <p className="font-semibold">Cucumbers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-2">🫑</div>
              <p className="font-semibold">Peppers</p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-8">About Plant Tracker</h2>
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-4">
              Plant Tracker is your personal gardening assistant, designed to help both beginners and experienced gardeners 
              keep their plants healthy and thriving.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Whether you&apos;re growing vegetables, herbs, or ornamental plants like olive trees, our intelligent 
              suggestion system provides personalized care recommendations based on your plant&apos;s specific needs, 
              growth stage, and seasonal requirements.
            </p>
            <p className="text-lg text-gray-700">
              With detailed care guides, watering schedules, and task management, you&apos;ll never miss an important 
              gardening activity. Start your journey to a flourishing garden today!
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-primary text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Start Growing Today</h2>
          <p className="text-xl mb-8">Join thousands of gardeners tracking their plants with Plant Tracker</p>
          <Link
            href="/register"
            className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  )
}
