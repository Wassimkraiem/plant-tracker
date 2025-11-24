export interface Plant {
  id: number
  userId: number
  name: string
  type: string
  description: string
  plantedDate: string
  wateringFrequencyDays: number
  lastWateredDate: string | null
  careInstructions: string
  imageUrl: string
  sunlightRequirements?: string
  soilType?: string
  fertilizingSchedule?: string
  pruningTips?: string
  commonPests?: string
  harvestingInfo?: string
  growthStages?: string
  wateringLogs?: WateringLog[]
  careTasks?: CareTask[]
}

export interface WateringLog {
  id: number
  plantId: number
  wateredDate: string
  notes?: string
}

export interface CareTask {
  id: number
  plantId: number
  taskName: string
  description: string
  dueDate: string | null
  isCompleted: boolean
}

