import { Suggestion } from '@/types/suggestion'

interface SuggestionCardProps {
  suggestion: Suggestion
}

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const bgColor = {
    warning: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    tip: 'bg-purple-50 border-purple-200'
  }[suggestion.type]

  const textColor = {
    warning: 'text-red-800',
    info: 'text-blue-800',
    success: 'text-green-800',
    tip: 'text-purple-800'
  }[suggestion.type]

  const iconBg = {
    warning: 'bg-red-100',
    info: 'bg-blue-100',
    success: 'bg-green-100',
    tip: 'bg-purple-100'
  }[suggestion.type]

  return (
    <div className={`${bgColor} border rounded-lg p-4 flex gap-3 hover:shadow-md transition-shadow`}>
      <div className={`${iconBg} rounded-full w-10 h-10 flex items-center justify-center text-xl flex-shrink-0`}>
        {suggestion.icon}
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold ${textColor} mb-1`}>{suggestion.title}</h4>
        <p className="text-sm text-gray-700">{suggestion.message}</p>
      </div>
    </div>
  )
}

