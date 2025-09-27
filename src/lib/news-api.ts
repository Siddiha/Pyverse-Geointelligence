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

// Enhanced mock news data with more variety
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
    content: 'Financial markets across Asia have shown remarkable resilience with the Nikkei posting 3.2% gains...',
    source: 'Financial Times',
    author: 'Markets Team',
    url: 'https://example.com/market-recovery',
    publishedAt: '6 hours ago',
    country: 'Japan',
    isBreaking: false,
    isTrending: false,
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'
  },
  {
    id: '4',
    title: 'Breakthrough in Quantum Computing Research',
    summary: 'Scientists achieve new milestone in quantum error correction, bringing practical quantum computers closer to reality.',
    content: 'Researchers at leading universities have demonstrated a significant advancement in quantum computing...',
    source: 'Nature',
    author: 'Dr. Quantum Research',
    url: 'https://example.com/quantum-breakthrough',
    publishedAt: '1 hour ago',
    country: 'Germany',
    isBreaking: true,
    isTrending: true,
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
  },
  {
    id: '5',
    title: 'Space Mission Discovers Potential Signs of Life',
    summary: 'New data from Mars rover suggests presence of organic compounds in ancient lake bed sediments.',
    content: 'NASA\'s latest Mars mission has uncovered compelling evidence that could reshape our understanding...',
    source: 'Space News',
    author: 'Dr. Maria Cosmos',
    url: 'https://example.com/mars-discovery',
    publishedAt: '3 hours ago',
    country: 'United States',
    isBreaking: true,
    isTrending: true,
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400'
  },
  {
    id: '6',
    title: 'Renewable Energy Milestone Achieved in Europe',
    summary: 'Wind and solar power now account for 60% of electricity generation across EU member states.',
    content: 'European Union reaches unprecedented renewable energy milestone as clean power generation...',
    source: 'EuroNews',
    author: 'Energy Reporter',
    url: 'https://example.com/eu-renewable',
    publishedAt: '5 hours ago',
    country: 'Germany',
    isBreaking: false,
    isTrending: true,
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400'
  },
  {
    id: '7',
    title: 'Revolutionary Medical Treatment Shows Promise',
    summary: 'Gene therapy trial demonstrates remarkable success in treating previously incurable genetic disorders.',
    content: 'Clinical trials for a groundbreaking gene therapy approach have shown unprecedented results...',
    source: 'Medical Journal',
    author: 'Dr. Health Science',
    url: 'https://example.com/gene-therapy',
    publishedAt: '7 hours ago',
    country: 'United Kingdom',
    isBreaking: false,
    isTrending: false,
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'
  },
  {
    id: '8',
    title: 'Global Food Security Initiative Launched',
    summary: 'International coalition announces $50 billion investment to combat world hunger and improve agriculture.',
    content: 'World leaders and international organizations have committed to the largest food security initiative...',
    source: 'UN News',
    author: 'Global Reporter',
    url: 'https://example.com/food-security',
    publishedAt: '8 hours ago',
    country: 'Global',
    isBreaking: false,
    isTrending: true,
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
  }
]

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>(mockNews)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async (country?: string, category?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate realistic API call delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
      
      let filteredNews = mockNews
      
      // Filter by country if provided
      if (country && country !== 'Global') {
        filteredNews = filteredNews.filter(article => 
          article.country === country || article.country === 'Global'
        )
      }
      
      // Filter by category if provided
      if (category) {
        filteredNews = filteredNews.filter(article => 
          article.category.toLowerCase() === category.toLowerCase()
        )
      }
      
      // Sort: Breaking news first, then trending, then by recency
      filteredNews.sort((a, b) => {
        if (a.isBreaking && !b.isBreaking) return -1
        if (!a.isBreaking && b.isBreaking) return 1
        if (a.isTrending && !b.isTrending) return -1
        if (!a.isTrending && b.isTrending) return 1
        return 0
      })
      
      setNews(filteredNews)
      
      // Simulate occasional errors for realistic behavior
      if (Math.random() < 0.05) {
        throw new Error('Network timeout')
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news'
      setError(errorMessage)
      console.error('News fetch error:', err)
      
      // Fallback to cached data on error
      setNews(mockNews.slice(0, 3))
    } finally {
      setLoading(false)
    }
  }, [])

  // Function to refresh news
  const refreshNews = useCallback(() => {
    fetchNews()
  }, [fetchNews])

  // Function to get news by category
  const getNewsByCategory = useCallback((category: string) => {
    return news.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    )
  }, [news])

  // Function to get breaking news only
  const getBreakingNews = useCallback(() => {
    return news.filter(article => article.isBreaking)
  }, [news])

  return {
    news,
    loading,
    error,
    fetchNews,
    refreshNews,
    getNewsByCategory,
    getBreakingNews
  }
}