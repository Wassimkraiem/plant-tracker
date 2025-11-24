'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plant, WateringLog, CareTask } from '@/types/plant'
import { PlantSuggestions } from '@/types/suggestion'
import SuggestionCard from '@/components/SuggestionCard'

export default function PlantDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [plant, setPlant] = useState<Plant | null>(null)
  const [suggestions, setSuggestions] = useState<PlantSuggestions | null>(null)
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({ taskName: '', description: '', dueDate: '' })
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'history'>('overview')

  useEffect(() => {
    fetchPlant()
    fetchSuggestions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const fetchPlant = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/plants/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setPlant(data)
    } catch (error) {
      console.error('Error fetching plant:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/suggestions/plant/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const handleWater = async () => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:5000/api/plants/${params.id}/water`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wateredDate: new Date().toISOString(),
          notes: 'Watered from detail page',
        }),
      })
      fetchPlant()
      fetchSuggestions()
    } catch (error) {
      console.error('Error watering plant:', error)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:5000/api/plants/${params.id}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTask,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
          isCompleted: false,
        }),
      })
      setNewTask({ taskName: '', description: '', dueDate: '' })
      setShowTaskForm(false)
      fetchPlant()
      fetchSuggestions()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleToggleTask = async (task: CareTask) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:5000/api/plants/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          isCompleted: !task.isCompleted,
        }),
      })
      fetchPlant()
      fetchSuggestions()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:5000/api/plants/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      fetchPlant()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const calculateDaysSince = (date: string | null) => {
    if (!date) return null
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getNextWateringDate = () => {
    if (!plant?.lastWateredDate) return 'Water soon'
    const lastWatered = new Date(plant.lastWateredDate)
    const nextWatering = new Date(lastWatered)
    nextWatering.setDate(lastWatered.getDate() + plant.wateringFrequencyDays)
    
    const daysUntil = Math.floor((nextWatering.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntil < 0) return 'Needs water!'
    if (daysUntil === 0) return 'Water today'
    if (daysUntil === 1) return 'Water tomorrow'
    return `Water in ${daysUntil} days`
  }

  if (loading) {
    return <div className="text-center py-16">Loading...</div>
  }

  if (!plant) {
    return <div className="text-center py-16">Plant not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-6 text-gray-600 hover:text-primary flex items-center gap-2"
      >
        ← Back to Plants
      </button>

      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{plant.imageUrl}</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{plant.name}</h1>
              <p className="text-xl text-gray-600">{plant.type}</p>
            </div>
          </div>
          <button
            onClick={handleWater}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            💧 Water Now
          </button>
        </div>

        {plant.description && (
          <p className="text-gray-700 mb-6">{plant.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Planted</div>
            <div className="font-semibold">{new Date(plant.plantedDate).toLocaleDateString()}</div>
            <div className="text-sm text-gray-500">
              {calculateDaysSince(plant.plantedDate)} days ago
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Last Watered</div>
            <div className="font-semibold">
              {plant.lastWateredDate
                ? new Date(plant.lastWateredDate).toLocaleDateString()
                : 'Never'}
            </div>
            <div className="text-sm text-gray-500">
              {plant.lastWateredDate
                ? `${calculateDaysSince(plant.lastWateredDate)} days ago`
                : 'No watering logged'}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Next Watering</div>
            <div className="font-semibold">{getNextWateringDate()}</div>
            <div className="text-sm text-gray-500">Every {plant.wateringFrequencyDays} days</div>
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      {suggestions && suggestions.suggestions.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Smart Suggestions for {plant.name}</h2>
          <div className="space-y-3">
            {suggestions.suggestions.map((suggestion, index) => (
              <SuggestionCard key={index} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📚 Care Guide
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'care'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            ✅ Tasks
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'history'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            💧 History
          </button>
        </div>

        <div className="p-6">
          {/* Care Guide Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {plant.careInstructions && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">General Care</h3>
                  <p className="text-gray-700 whitespace-pre-line">{plant.careInstructions}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {plant.sunlightRequirements && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      ☀️ Sunlight Requirements
                    </h3>
                    <p className="text-gray-700">{plant.sunlightRequirements}</p>
                  </div>
                )}

                {plant.soilType && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      🌱 Soil Type
                    </h3>
                    <p className="text-gray-700">{plant.soilType}</p>
                  </div>
                )}

                {plant.fertilizingSchedule && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      🧪 Fertilizing
                    </h3>
                    <p className="text-gray-700">{plant.fertilizingSchedule}</p>
                  </div>
                )}

                {plant.pruningTips && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      ✂️ Pruning
                    </h3>
                    <p className="text-gray-700">{plant.pruningTips}</p>
                  </div>
                )}

                {plant.commonPests && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      🐛 Pests & Diseases
                    </h3>
                    <p className="text-gray-700">{plant.commonPests}</p>
                  </div>
                )}

                {plant.harvestingInfo && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      🌾 Harvesting
                    </h3>
                    <p className="text-gray-700">{plant.harvestingInfo}</p>
                  </div>
                )}
              </div>

              {plant.growthStages && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">📈 Growth Stages</h3>
                  <p className="text-gray-700 whitespace-pre-line">{plant.growthStages}</p>
                </div>
              )}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'care' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Care Tasks</h2>
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  + Add Task
                </button>
              </div>

              {showTaskForm && (
                <form onSubmit={handleAddTask} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    required
                    placeholder="Task name"
                    value={newTask.taskName}
                    onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-600">
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {plant.careTasks && plant.careTasks.length > 0 ? (
                <div className="space-y-3">
                  {plant.careTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg ${
                        task.isCompleted ? 'bg-gray-100' : 'bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleToggleTask(task)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className={`font-medium text-lg ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                              {task.taskName}
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                            )}
                            {task.dueDate && (
                              <div className="text-sm text-gray-500 mt-1">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No care tasks yet</p>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Watering History</h2>
              {plant.wateringLogs && plant.wateringLogs.length > 0 ? (
                <div className="space-y-3">
                  {plant.wateringLogs
                    .sort((a, b) => new Date(b.wateredDate).getTime() - new Date(a.wateredDate).getTime())
                    .map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium text-lg">
                            {new Date(log.wateredDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(log.wateredDate).toLocaleTimeString()}
                          </div>
                          {log.notes && <div className="text-sm text-gray-600 mt-1">{log.notes}</div>}
                        </div>
                        <div className="text-3xl">💧</div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No watering history yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

