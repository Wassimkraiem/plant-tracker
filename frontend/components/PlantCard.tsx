import Link from 'next/link'
import { Plant } from '@/types/plant'

interface PlantCardProps {
  plant: Plant
  onWater: (plantId: number) => void
  onDelete: (plantId: number) => void
}

export default function PlantCard({ plant, onWater, onDelete }: PlantCardProps) {
  const calculateDaysSince = (date: string | null) => {
    if (!date) return null
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const needsWater = () => {
    if (!plant.lastWateredDate) return true
    const daysSinceWater = calculateDaysSince(plant.lastWateredDate)
    return daysSinceWater !== null && daysSinceWater >= plant.wateringFrequencyDays
  }

  const getWateringStatus = () => {
    if (!plant.lastWateredDate) return { text: 'Never watered', color: 'text-red-600' }
    
    const daysSince = calculateDaysSince(plant.lastWateredDate)
    if (daysSince === null) return { text: 'Unknown', color: 'text-gray-600' }
    
    if (daysSince >= plant.wateringFrequencyDays) {
      return { text: `Needs water! (${daysSince}d ago)`, color: 'text-red-600' }
    }
    
    const daysUntilNext = plant.wateringFrequencyDays - daysSince
    if (daysUntilNext === 0) return { text: 'Water today', color: 'text-orange-600' }
    if (daysUntilNext === 1) return { text: 'Water tomorrow', color: 'text-yellow-600' }
    
    return { text: `Water in ${daysUntilNext} days`, color: 'text-green-600' }
  }

  const status = getWateringStatus()

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <Link href={`/dashboard/plant/${plant.id}`}>
        <div className="p-6 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl">{plant.imageUrl}</div>
            <div className={`text-sm font-semibold ${status.color}`}>
              {status.text}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">{plant.name}</h3>
          <p className="text-gray-600 mb-4">{plant.type}</p>
          
          {plant.description && (
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{plant.description}</p>
          )}
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Planted:</span>
              <span className="font-medium">
                {new Date(plant.plantedDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last watered:</span>
              <span className="font-medium">
                {plant.lastWateredDate
                  ? `${calculateDaysSince(plant.lastWateredDate)}d ago`
                  : 'Never'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Watering schedule:</span>
              <span className="font-medium">Every {plant.wateringFrequencyDays}d</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="px-6 pb-6 flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault()
            onWater(plant.id)
          }}
          className={`flex-1 py-2 rounded-lg transition-colors font-semibold ${
            needsWater()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          💧 Water
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            onDelete(plant.id)
          }}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

