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

// Mock news data
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Global Climate Summit Reaches Historic Agreement',
    summary: 'World leaders unite on comprehensive climate action plan with binding emissions targets for 2030.',
    content: 'In a groundbreaking development, representatives from 195 countries have reached a historic climate agreement...',
    source: 'Reuters',
    author: 'Climate Desk',
    url: 'https://example.com/climate-summit',
    publishedAt: '2 hours ago',
    country: 'Global',
    isBreaking: true,
    isTrending: true,
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de44cb36f4ac?w=400'
  },
  {
    id: '2',
    title: 'Tech Giants Announce Joint AI Safety Initiative',
    summary: 'Major technology companies collaborate on new framework for responsible artificial intelligence development.',
    content: 'Leading technology companies including Google, Microsoft, and OpenAI have announced a joint initiative...',
    source: 'TechCrunch',
    author: 'Sarah Johnson',
    url: 'https://example.com/ai-safety',
    publishedAt: '4 hours ago',
    country: 'United States',
    isBreaking: false,
    isTrending: true,
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'
  },
  {
    id: '3',
    title: 'Economic Markets Show Strong Recovery Signals',
    summary: 'Asian markets lead global recovery with significant gains across major indices.',
    content: 'Financial markets across Asia have shown remarkable resilience...',
    source: 'Financial Times',
    author: 'Markets Team',
    url: 'https://example.com/market-recovery',
    publishedAt: '6 hours ago',
    country: 'Japan',
    isBreaking: false,
    isTrending: false,
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'
  }
]

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>(mockNews)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async (country?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter news by country if provided
      const filteredNews = country 
        ? mockNews.filter(article => 
            article.country === country || article.country === 'Global'
          )
        : mockNews
      
      setNews(filteredNews)
    } catch (err) {
      setError('Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    news,
    loading,
    error,
    fetchNews
  }
}