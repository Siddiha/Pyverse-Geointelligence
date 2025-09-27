export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  source: string
  author: string
  url: string
  publishedAt: string
  country: string
  isBreaking: boolean
  isTrending: boolean
  category: string
  imageUrl?: string
}

export interface NewsFilter {
  country?: string
  category?: string
  source?: string
  timeRange?: 'hour' | 'day' | 'week' | 'month'
  showBreaking?: boolean
  showTrending?: boolean
}

export interface NewsSource {
  id: string
  name: string
  description: string
  url: string
  category: string
  country: string
}