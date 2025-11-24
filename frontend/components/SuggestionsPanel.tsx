import { PlantSuggestions } from '@/types/suggestion'
import SuggestionCard from './SuggestionCard'
import Link from 'next/link'

interface SuggestionsPanelProps {
  allSuggestions: PlantSuggestions[]
  loading?: boolean
}

export default function SuggestionsPanel({ allSuggestions, loading }: SuggestionsPanelProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Smart Suggestions</h2>
        <p className="text-gray-500">Loading suggestions...</p>
      </div>
    )
  }

  if (!allSuggestions.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Smart Suggestions</h2>
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🎉</div>
          <p className="text-gray-600">Great job! All your plants are healthy and well-maintained!</p>
        </div>
      </div>
    )
  }

  // Count suggestions by type
  const warningCount = allSuggestions.reduce((sum, ps) => 
    sum + ps.suggestions.filter(s => s.type === 'warning').length, 0)
  
  const totalSuggestions = allSuggestions.reduce((sum, ps) => sum + ps.suggestions.length, 0)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">💡 Smart Suggestions</h2>
        <div className="flex gap-2">
          {warningCount > 0 && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              {warningCount} Urgent
            </span>
          )}
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            {totalSuggestions} Total
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {allSuggestions.map((plantSuggestions) => (
          <div key={plantSuggestions.plantId}>
            <Link 
              href={`/dashboard/plant/${plantSuggestions.plantId}`}
              className="font-semibold text-lg text-primary hover:underline mb-3 block"
            >
              {plantSuggestions.plantName}
            </Link>
            <div className="space-y-3">
              {plantSuggestions.suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

