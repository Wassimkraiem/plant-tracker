export interface PlantGuide {
  type: string
  emoji: string
  wateringFrequency: number
  quickTips: string[]
  sunlight: string
  soil: string
  harvestTime?: string
}

export const plantGuides: Record<string, PlantGuide> = {
  'Olive Tree': {
    type: 'Olive Tree',
    emoji: '🫒',
    wateringFrequency: 7,
    quickTips: [
      'Water deeply but infrequently',
      'Needs full sun (6-8 hours daily)',
      'Requires well-draining soil (pH 5.5-8.5)',
      'Prune in late winter (February-March)',
      'Takes 5-8 years to produce fruit',
      'Protect from frost in winter',
    ],
    sunlight: 'Full sun (6-8 hours daily)',
    soil: 'Well-draining, sandy loam, pH 5.5-8.5',
    harvestTime: 'Fall (September-November)',
  },
  'Tomato': {
    type: 'Tomato',
    emoji: '🍅',
    wateringFrequency: 2,
    quickTips: [
      'Water every 2 days, keep soil consistently moist',
      'Requires 6-8 hours of full sun',
      'Support with stakes or cages',
      'Pinch off suckers for better fruit production',
      'Harvest when fully colored and slightly soft',
      'Check for hornworms and aphids regularly',
    ],
    sunlight: 'Full sun (6-8 hours minimum)',
    soil: 'Rich, well-draining, pH 6.0-6.8',
    harvestTime: '60-80 days after transplanting',
  },
  'Cucumber': {
    type: 'Cucumber',
    emoji: '🥒',
    wateringFrequency: 1,
    quickTips: [
      'Water daily, needs consistent moisture',
      'Requires full sun and warm weather',
      'Provide trellis for vertical growth',
      'Harvest when 6-8 inches long',
      'Pick daily at peak season to encourage production',
      'Watch for powdery mildew on leaves',
    ],
    sunlight: 'Full sun (6-8 hours daily)',
    soil: 'Rich, loose soil, pH 6.0-7.0',
    harvestTime: '50-70 days from planting',
  },
  'Pepper': {
    type: 'Pepper',
    emoji: '🫑',
    wateringFrequency: 2,
    quickTips: [
      'Water every 2 days, deeply and regularly',
      'Needs full sun and warm temperatures (70-85°F)',
      'Pinch first flowers for stronger plant',
      'Add calcium to prevent blossom end rot',
      'Harvest green or wait for color change',
      'Stake plants when fruit appears',
    ],
    sunlight: 'Full sun (6-8 hours), warm temps',
    soil: 'Well-draining, nutrient-rich, pH 6.0-6.8',
    harvestTime: 'Green: 60-80 days, Colored: 80-100 days',
  },
  'Carrot': {
    type: 'Carrot',
    emoji: '🥕',
    wateringFrequency: 2,
    quickTips: [
      'Water regularly to keep soil evenly moist',
      'Needs loose, deep soil for straight root growth',
      'Direct sow - does not transplant well',
      'Thin seedlings to 2-3 inches apart',
      'Remove stones from soil before planting',
      'Harvest when tops are visible above soil',
    ],
    sunlight: 'Full sun to partial shade',
    soil: 'Loose, deep, sandy soil, pH 6.0-6.8',
    harvestTime: '60-80 days from seed',
  },
  'Lettuce': {
    type: 'Lettuce',
    emoji: '🥬',
    wateringFrequency: 1,
    quickTips: [
      'Water daily in warm weather, keep soil moist',
      'Prefers cooler temperatures (60-70°F)',
      'Tolerates partial shade, especially in summer',
      'Harvest outer leaves continuously',
      'Bolts (goes to seed) in hot weather',
      'Plant in succession every 2 weeks',
    ],
    sunlight: 'Full sun to partial shade',
    soil: 'Rich, moist soil, pH 6.0-7.0',
    harvestTime: '30-60 days from planting',
  },
  'Herbs': {
    type: 'Herbs',
    emoji: '🌿',
    wateringFrequency: 2,
    quickTips: [
      'Most herbs prefer moderate watering',
      'Need excellent drainage to prevent root rot',
      'Harvest regularly to encourage bushy growth',
      'Varies by herb type (basil, mint, oregano, etc.)',
      'Most need 4-6 hours of direct sun',
      'Pinch flowers to prolong leaf production',
    ],
    sunlight: '4-6 hours of sun daily',
    soil: 'Well-draining, pH 6.0-7.0',
    harvestTime: 'Continuous harvest after establishment',
  },
  'Other': {
    type: 'Other',
    emoji: '🌱',
    wateringFrequency: 3,
    quickTips: [
      'Research your specific plant type thoroughly',
      'Check sunlight requirements for your plant',
      'Understand watering needs (frequency and amount)',
      'Learn about common pests and diseases',
      'Know the expected growth timeline',
      'Join gardening communities for specific advice',
    ],
    sunlight: 'Varies by plant type',
    soil: 'Varies by plant type',
    harvestTime: 'Varies by plant type',
  },
}

