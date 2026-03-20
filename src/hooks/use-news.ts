import { useState, useCallback } from 'react'

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

const INITIAL_MOCK: NewsArticle[] = [
  {
    id: 'init-1',
    title: 'Global Climate Summit Reaches Historic Agreement',
    summary: 'World leaders unite on comprehensive climate action plan with binding emissions targets for 2030.',
    content: '',
    source: 'Reuters',
    author: 'Climate Desk',
    url: '#',
    publishedAt: '2 hours ago',
    country: 'Global',
    isBreaking: true,
    isTrending: true,
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de44cb36f4ac?w=400',
  },
  {
    id: 'init-2',
    title: 'Tech Giants Announce Joint AI Safety Initiative',
    summary: 'Major technology companies collaborate on new framework for responsible AI development.',
    content: '',
    source: 'TechCrunch',
    author: 'Sarah Johnson',
    url: '#',
    publishedAt: '4 hours ago',
    country: 'United States',
    isBreaking: false,
    isTrending: true,
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
  },
  {
    id: 'init-3',
    title: 'Economic Markets Show Strong Recovery Signals',
    summary: 'Asian markets lead global recovery with significant gains across major indices.',
    content: '',
    source: 'Financial Times',
    author: 'Markets Team',
    url: '#',
    publishedAt: '6 hours ago',
    country: 'Japan',
    isBreaking: false,
    isTrending: false,
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
  },
]

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_MOCK)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async (country?: string, category?: string) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (country) params.append('country', country)
      if (category) params.append('category', category)

      const response = await fetch(`/api/news?${params.toString()}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch news')
      }

      if (Array.isArray(data.data) && data.data.length > 0) {
        setNews(data.data)
      }
      // if API returned empty array, keep existing news visible
    } catch (err) {
      // show a non-blocking error but keep existing news visible
      setError(err instanceof Error ? err.message : 'Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }, [])

  return { news, loading, error, fetchNews }
}
