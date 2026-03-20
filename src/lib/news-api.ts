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

// NewsAPI only accepts ISO 2-letter country codes
const COUNTRY_CODE_MAP: Record<string, string> = {
  'Afghanistan': 'af',
  'Argentina': 'ar',
  'Australia': 'au',
  'Austria': 'at',
  'Belgium': 'be',
  'Brazil': 'br',
  'Bulgaria': 'bg',
  'Canada': 'ca',
  'China': 'cn',
  'Colombia': 'co',
  'Cuba': 'cu',
  'Czech Republic': 'cz',
  'Egypt': 'eg',
  'France': 'fr',
  'Germany': 'de',
  'Greece': 'gr',
  'Hong Kong': 'hk',
  'Hungary': 'hu',
  'India': 'in',
  'Indonesia': 'id',
  'Ireland': 'ie',
  'Israel': 'il',
  'Italy': 'it',
  'Japan': 'jp',
  'Latvia': 'lv',
  'Lithuania': 'lt',
  'Malaysia': 'my',
  'Mexico': 'mx',
  'Morocco': 'ma',
  'Netherlands': 'nl',
  'New Zealand': 'nz',
  'Nigeria': 'ng',
  'Norway': 'no',
  'Philippines': 'ph',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Romania': 'ro',
  'Russia': 'ru',
  'Saudi Arabia': 'sa',
  'Serbia': 'rs',
  'Singapore': 'sg',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'South Africa': 'za',
  'South Korea': 'kr',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Taiwan': 'tw',
  'Thailand': 'th',
  'Turkey': 'tr',
  'Ukraine': 'ua',
  'United Arab Emirates': 'ae',
  'United Kingdom': 'gb',
  'United States': 'us',
  'Venezuela': 've',
}

// Guardian API section mapping
const GUARDIAN_SECTION_MAP: Record<string, string> = {
  'Technology': 'technology',
  'Business': 'business',
  'Science': 'science',
  'Health': 'lifeandstyle',
  'Sports': 'sport',
  'Entertainment': 'culture',
  'General': 'news',
}

// fetch with a 8-second timeout so a slow/hung API never blocks the UI
const fetchWithTimeout = (url: string, ms = 8000): Promise<Response> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer))
}

export const fetchNews = async (country?: string, category?: string): Promise<NewsArticle[]> => {
  try {
    const newsApiKey = process.env.NEWS_API_KEY
    if (newsApiKey && newsApiKey !== 'your_newsapi_key_here') {
      const params = new URLSearchParams({
        apiKey: newsApiKey,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: '20',
      })

      // Map full country name to ISO code
      if (country && country !== 'Global') {
        const code = COUNTRY_CODE_MAP[country]
        if (code) {
          params.append('country', code)
        }
      }

      // NewsAPI valid categories
      const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
      if (category && category !== 'All') {
        const cat = category.toLowerCase()
        if (validCategories.includes(cat)) {
          params.append('category', cat)
        }
      }

      const response = await fetchWithTimeout(`https://newsapi.org/v2/top-headlines?${params}`)

      if (response.ok) {
        const data = await response.json()
        const articles = data.articles?.filter((a: any) => a.title && a.title !== '[Removed]') || []
        return articles.map((article: any, index: number) => ({
          id: `newsapi-${index}-${Date.now()}`,
          title: article.title || 'No title',
          summary: article.description || 'No description available',
          content: article.content || article.description || 'No content',
          source: article.source?.name || 'Unknown',
          author: article.author || 'Unknown',
          url: article.url || '#',
          publishedAt: new Date(article.publishedAt).toLocaleString(),
          country: country || 'Global',
          isBreaking: index < 3,
          isTrending: index >= 3 && index < 8,
          category: category || 'General',
          imageUrl: article.urlToImage || undefined,
        }))
      }
    }

    // Fallback to Guardian API
    const guardianApiKey = process.env.GUARDIAN_API_KEY
    if (guardianApiKey && guardianApiKey !== 'your_guardian_key_here') {
      const params = new URLSearchParams({
        'api-key': guardianApiKey,
        'show-fields': 'headline,trailText,thumbnail,byline',
        'page-size': '20',
        'order-by': 'newest',
      })

      const guardianSection = category ? GUARDIAN_SECTION_MAP[category] : undefined
      if (guardianSection) {
        params.append('section', guardianSection)
      }

      if (country && country !== 'Global') {
        params.append('q', country)
      }

      const response = await fetchWithTimeout(`https://content.guardianapis.com/search?${params}`)

      if (response.ok) {
        const data = await response.json()
        return (data.response?.results || []).map((article: any, index: number) => ({
          id: `guardian-${index}-${Date.now()}`,
          title: article.fields?.headline || article.webTitle || 'No title',
          summary: article.fields?.trailText || 'No description available',
          content: article.fields?.trailText || 'No content',
          source: 'The Guardian',
          author: article.fields?.byline || 'Unknown',
          url: article.webUrl || '#',
          publishedAt: new Date(article.webPublicationDate).toLocaleString(),
          country: country || 'Global',
          isBreaking: index < 3,
          isTrending: index >= 3 && index < 8,
          category: article.sectionName || category || 'General',
          imageUrl: article.fields?.thumbnail || undefined,
        }))
      }
    }

    // Both APIs unavailable — return mock data
    console.warn('All news APIs unavailable or not configured, using mock data')
    return getMockNews(country, category)
  } catch (error) {
    console.error('News API error:', error)
    return getMockNews(country, category)
  }
}

const getMockNews = (country?: string, category?: string): NewsArticle[] => {
  const allMock: NewsArticle[] = [
    {
      id: 'mock-1',
      title: 'Global Climate Summit Reaches Historic Agreement',
      summary: 'World leaders unite on comprehensive climate action plan with binding emissions targets for 2030.',
      content: 'Representatives from 195 countries have reached a historic climate agreement...',
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
      id: 'mock-2',
      title: 'Tech Giants Announce Joint AI Safety Initiative',
      summary: 'Major technology companies collaborate on new framework for responsible AI development.',
      content: 'Leading technology companies including Google, Microsoft, and OpenAI have announced...',
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
      id: 'mock-3',
      title: 'Economic Markets Show Strong Recovery Signals',
      summary: 'Asian markets lead global recovery with significant gains across major indices.',
      content: 'Financial markets across Asia have shown remarkable resilience...',
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
    {
      id: 'mock-4',
      title: 'New Health Study Links Diet to Longevity',
      summary: 'Researchers discover key dietary patterns that may extend healthy lifespan by decades.',
      content: 'A landmark study involving 500,000 participants reveals...',
      source: 'Nature',
      author: 'Science Desk',
      url: '#',
      publishedAt: '8 hours ago',
      country: 'Global',
      isBreaking: false,
      isTrending: true,
      category: 'Health',
      imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400',
    },
    {
      id: 'mock-5',
      title: 'Space Agency Announces Mars Mission Timeline',
      summary: 'Plans for crewed Mars mission accelerated with new propulsion technology breakthroughs.',
      content: 'NASA and international space agencies announced an updated timeline...',
      source: 'Space.com',
      author: 'Space Desk',
      url: '#',
      publishedAt: '10 hours ago',
      country: 'United States',
      isBreaking: false,
      isTrending: false,
      category: 'Science',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
    },
  ]

  let results = allMock

  if (country && country !== 'Global') {
    results = allMock.filter(a => a.country === country || a.country === 'Global')
    if (results.length === 0) results = allMock // fallback to all if no match
  }

  if (category && category !== 'All') {
    const catFiltered = results.filter(a => a.category.toLowerCase() === category.toLowerCase())
    if (catFiltered.length > 0) results = catFiltered
  }

  return results
}
