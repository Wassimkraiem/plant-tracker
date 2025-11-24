'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { plantGuides } from '@/lib/plantGuides'

export default function AddPlant() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    plantedDate: new Date().toISOString().split('T')[0],
    wateringFrequencyDays: 7,
    careInstructions: '',
    sunlightRequirements: '',
    soilType: '',
    fertilizingSchedule: '',
    pruningTips: '',
    commonPests: '',
    harvestingInfo: '',
    growthStages: '',
    imageUrl: '🌱',
  })

  // Get the guide for selected plant type
  const selectedGuide = formData.type ? plantGuides[formData.type] : null

  // Auto-fill function
  const handleAutoFill = () => {
    if (selectedGuide) {
      setFormData(prev => ({
        ...prev,
        wateringFrequencyDays: selectedGuide.wateringFrequency,
        sunlightRequirements: selectedGuide.sunlight,
        soilType: selectedGuide.soil,
        harvestingInfo: selectedGuide.harvestTime || '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          plantedDate: new Date(formData.plantedDate).toISOString(),
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error adding plant:', error)
    }
  }

  const plantTypes = [
    { value: 'Olive Tree', emoji: '🫒' },
    { value: 'Tomato', emoji: '🍅' },
    { value: 'Cucumber', emoji: '🥒' },
    { value: 'Pepper', emoji: '🫑' },
    { value: 'Carrot', emoji: '🥕' },
    { value: 'Lettuce', emoji: '🥬' },
    { value: 'Herbs', emoji: '🌿' },
    { value: 'Other', emoji: '🌱' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Add New Plant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE: Form (2/3 width) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Plant Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., My Olive Tree"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Plant Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => {
                    const selectedType = plantTypes.find(t => t.value === e.target.value)
                    setFormData({
                      ...formData,
                      type: e.target.value,
                      imageUrl: selectedType?.emoji || '🌱'
                    })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a type</option>
                  {plantTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.emoji} {type.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
                placeholder="Brief description of your plant"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date Planted *
                </label>
                <input
                  type="date"
                  required
                  value={formData.plantedDate}
                  onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Watering Frequency (days) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.wateringFrequencyDays}
                  onChange={(e) => setFormData({ ...formData, wateringFrequencyDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Detailed Care Instructions */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Detailed Care Instructions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  General Care Instructions
                </label>
                <textarea
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="General care tips..."
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Sunlight Requirements
                </label>
                <textarea
                  value={formData.sunlightRequirements}
                  onChange={(e) => setFormData({ ...formData, sunlightRequirements: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="Full sun, partial shade, hours needed..."
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Soil Type & Requirements
                </label>
                <textarea
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="pH level, drainage, composition..."
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fertilizing Schedule
                </label>
                <textarea
                  value={formData.fertilizingSchedule}
                  onChange={(e) => setFormData({ ...formData, fertilizingSchedule: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="When and what type of fertilizer..."
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pruning Tips
                </label>
                <textarea
                  value={formData.pruningTips}
                  onChange={(e) => setFormData({ ...formData, pruningTips: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="When and how to prune..."
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Common Pests & Diseases
                </label>
                <textarea
                  value={formData.commonPests}
                  onChange={(e) => setFormData({ ...formData, commonPests: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="What to watch for and how to treat..."
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Harvesting Information
                </label>
                <textarea
                  value={formData.harvestingInfo}
                  onChange={(e) => setFormData({ ...formData, harvestingInfo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="When and how to harvest (if applicable)..."
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Growth Stages
                </label>
                <textarea
                  value={formData.growthStages}
                  onChange={(e) => setFormData({ ...formData, growthStages: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                  placeholder="Timeline and stages of growth..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            Add Plant
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
        </div>

        {/* RIGHT SIDE: Plant Guide (1/3 width) */}
        <div className="lg:col-span-1">
          {selectedGuide ? (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 shadow-lg sticky top-4">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{selectedGuide.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedGuide.type}</h3>
                <p className="text-sm text-gray-600 mt-1">Quick Reference Guide</p>
              </div>

              <div className="space-y-4">
                {/* Watering Frequency */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💧</span>
                    <h4 className="font-semibold text-gray-800">Watering</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Every <span className="font-bold text-primary">{selectedGuide.wateringFrequency}</span> day
                    {selectedGuide.wateringFrequency !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Sunlight */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">☀️</span>
                    <h4 className="font-semibold text-gray-800">Sunlight</h4>
                  </div>
                  <p className="text-sm text-gray-700">{selectedGuide.sunlight}</p>
                </div>

                {/* Soil */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🌱</span>
                    <h4 className="font-semibold text-gray-800">Soil</h4>
                  </div>
                  <p className="text-sm text-gray-700">{selectedGuide.soil}</p>
                </div>

                {/* Harvest Time */}
                {selectedGuide.harvestTime && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🌾</span>
                      <h4 className="font-semibold text-gray-800">Harvest</h4>
                    </div>
                    <p className="text-sm text-gray-700">{selectedGuide.harvestTime}</p>
                  </div>
                )}

                {/* Quick Tips */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💡</span>
                    <h4 className="font-semibold text-gray-800">Quick Tips</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedGuide.quickTips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-primary flex-shrink-0">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Auto-fill button */}
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <span>📋</span>
                  <span>Auto-fill Recommended Values</span>
                </button>
                <p className="text-xs text-gray-600 text-center">
                  This will populate watering frequency, sunlight, soil, and harvest fields
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg sticky top-4 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Plant Type</h3>
              <p className="text-gray-600 text-sm">
                Choose a plant type from the form to see helpful care tips and recommendations!
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Available guides:</span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span>🫒 Olive</span>
                  <span>🍅 Tomato</span>
                  <span>🥒 Cucumber</span>
                  <span>🫑 Pepper</span>
                  <span>🥕 Carrot</span>
                  <span>🥬 Lettuce</span>
                  <span>🌿 Herbs</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

