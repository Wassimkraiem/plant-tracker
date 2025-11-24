'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plant } from '@/types/plant'
import { PlantSuggestions } from '@/types/suggestion'
import PlantCard from '@/components/PlantCard'
import SuggestionsPanel from '@/components/SuggestionsPanel'
import { api } from '@/lib/api'

export default function Dashboard() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [suggestions, setSuggestions] = useState<PlantSuggestions[]>([])
  const [loading, setLoading] = useState(true)
  const [suggestionsLoading, setSuggestionsLoading] = useState(true)

  useEffect(() => {
    fetchPlants()
    fetchSuggestions()
  }, [])

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/plants', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setPlants(data)
    } catch (error) {
      console.error('Error fetching plants:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/suggestions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const handleWaterPlant = async (plantId: number) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:5000/api/plants/${plantId}/water`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wateredDate: new Date().toISOString(),
          notes: 'Watered from dashboard',
        }),
      })
      fetchPlants()
      fetchSuggestions()
    } catch (error) {
      console.error('Error watering plant:', error)
    }
  }

  const handleDeletePlant = async (plantId: number) => {
    if (confirm('Are you sure you want to delete this plant?')) {
      try {
        const token = localStorage.getItem('token')
        await fetch(`http://localhost:5000/api/plants/${plantId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        fetchPlants()
      } catch (error) {
        console.error('Error deleting plant:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading plants...</div>
      </div>
    )
  }

  if (plants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🌱</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No Plants Yet</h2>
        <p className="text-gray-600 mb-8">Start your garden by adding your first plant!</p>
        <Link
          href="/dashboard/add"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Add Your First Plant
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">My Plants</h1>
        <Link
          href="/dashboard/add"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          + Add Plant
        </Link>
      </div>

      {/* Suggestions Panel */}
      {suggestions.length > 0 && (
        <div className="mb-8">
          <SuggestionsPanel allSuggestions={suggestions} loading={suggestionsLoading} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onWater={handleWaterPlant}
            onDelete={handleDeletePlant}
          />
        ))}
      </div>
    </div>
  )
}

