export interface Suggestion {
  type: 'warning' | 'info' | 'success' | 'tip'
  title: string
  message: string
  icon: string
  priority: number
}

export interface PlantSuggestions {
  plantId: number
  plantName: string
  suggestions: Suggestion[]
}

