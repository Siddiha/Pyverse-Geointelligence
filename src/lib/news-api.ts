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

// Real news API integration
export const fetchNews = async (country?: string, category?: string): Promise<NewsArticle[]> => {
  try {
    // Try NewsAPI first
    const newsApiKey = process.env.NEWS_API_KEY
    if (newsApiKey) {
      const params = new URLSearchParams({
        apiKey: newsApiKey,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '20'
      })
      
      if (country && country !== 'Global') {
        params.append('country', country.toLowerCase())
      }
      
      if (category) {
        params.append('category', category.toLowerCase())
      }
      
      const response = await fetch(`https://newsapi.org/v2/top-headlines?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        return data.articles?.map((article: any, index: number) => ({
          id: `newsapi-${index}`,
          title: article.title || 'No title',
          summary: article.description || 'No description',
          content: article.content || article.description || 'No content',
          source: article.source?.name || 'Unknown',
          author: article.author || 'Unknown',
          url: article.url || '#',
          publishedAt: new Date(article.publishedAt).toLocaleString(),
          country: country || 'Global',
          isBreaking: index < 3, // First 3 articles are breaking
          isTrending: Math.random() > 0.7,
          category: category || 'General',
          imageUrl: article.urlToImage
        })) || []
      }
    }
    
    // Fallback to Guardian API
    const guardianApiKey = process.env.GUARDIAN_API_KEY
    if (guardianApiKey) {
      const params = new URLSearchParams({
        'api-key': guardianApiKey,
        'show-fields': 'headline,trailText,thumbnail,byline',
        'page-size': '20'
      })
      
      if (category) {
        params.append('section', category.toLowerCase())
      }
      
      const response = await fetch(`https://content.guardianapis.com/search?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        return data.response?.results?.map((article: any, index: number) => ({
          id: `guardian-${index}`,
          title: article.fields?.headline || article.webTitle || 'No title',
          summary: article.fields?.trailText || 'No description',
          content: article.fields?.trailText || 'No content',
          source: 'The Guardian',
          author: article.fields?.byline || 'Unknown',
          url: article.webUrl || '#',
          publishedAt: new Date(article.webPublicationDate).toLocaleString(),
          country: country || 'Global',
          isBreaking: index < 3,
          isTrending: Math.random() > 0.7,
          category: article.sectionName || category || 'General',
          imageUrl: article.fields?.thumbnail
        })) || []
      }
    }
    
    // If both APIs fail, return mock data
    console.warn('All news APIs failed, using mock data')
    return getMockNews(country, category)
    
  } catch (error) {
    console.error('News API error:', error)
    return getMockNews(country, category)
  }
}

// Mock news data as fallback
const getMockNews = (country?: string, category?: string): NewsArticle[] => {
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
    }
  ]
  
  // Filter by country if provided
  if (country && country !== 'Global') {
    return mockNews.filter(article => 
      article.country === country || article.country === 'Global'
    )
  }
  
  // Filter by category if provided
  if (category) {
    return mockNews.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    )
  }
  
  return mockNews
}