'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, AlertTriangle, Activity, Filter, ExternalLink, TrendingUp } from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  country: string
  isBreaking: boolean
  isTrending: boolean
  category: string
  url: string
}

interface NewsPanelProps {
  selectedCountry: string | null
}

// Enhanced mock news data
const generateNewsData = (country?: string): NewsArticle[] => {
  const globalNews = [
    {
      id: '1',
      title: 'Global Military Exercise Signals Rising Tensions',
      summary: 'NATO forces conduct largest joint military exercise in Eastern Europe since Cold War, raising concerns about regional stability.',
      source: 'Reuters',
      publishedAt: '2 minutes ago',
      country: 'Global',
      isBreaking: true,
      isTrending: true,
      category: 'Military',
      url: '#'
    },
    {
      id: '2',
      title: 'Cyber Attack Targets Critical Infrastructure',
      summary: 'State-sponsored hackers infiltrate power grid systems across multiple countries, highlighting cybersecurity vulnerabilities.',
      source: 'BBC',
      publishedAt: '15 minutes ago',
      country: 'Global',
      isBreaking: true,
      isTrending: false,
      category: 'Cybersecurity',
      url: '#'
    },
    {
      id: '3',
      title: 'Economic Sanctions Expanded Against Authoritarian Regimes',
      summary: 'G7 nations coordinate new financial restrictions targeting countries violating international law and human rights.',
      source: 'Financial Times',
      publishedAt: '1 hour ago',
      country: 'Global',
      isBreaking: false,
      isTrending: true,
      category: 'Economics',
      url: '#'
    },
    {
      id: '4',
      title: 'Intelligence Report Reveals Foreign Election Interference',
      summary: 'Classified documents expose sophisticated disinformation campaigns targeting democratic institutions worldwide.',
      source: 'The Guardian',
      publishedAt: '2 hours ago',
      country: 'Global',
      isBreaking: false,
      isTrending: true,
      category: 'Intelligence',
      url: '#'
    },
    {
      id: '5',
      title: 'Arms Trade Monitoring Detects Illegal Weapons Shipments',
      summary: 'International watchdog identifies suspicious military equipment transfers to conflict zones violating UN embargos.',
      source: 'Al Jazeera',
      publishedAt: '3 hours ago',
      country: 'Global',
      isBreaking: false,
      isTrending: false,
      category: 'Defense',
      url: '#'
    }
  ]

  const countrySpecificNews: Record<string, NewsArticle[]> = {
    'Ukraine': [
      {
        id: 'ua1',
        title: 'Ukraine Receives Advanced Defense Systems',
        summary: 'Latest military aid package includes cutting-edge air defense technology to protect critical infrastructure.',
        source: 'Kyiv Independent',
        publishedAt: '30 minutes ago',
        country: 'Ukraine',
        isBreaking: true,
        isTrending: true,
        category: 'Defense',
        url: '#'
      },
      {
        id: 'ua2',
        title: 'Humanitarian Corridors Established in Eastern Regions',
        summary: 'International organizations coordinate safe passage for civilians in contested territories.',
        source: 'Reuters',
        publishedAt: '1 hour ago',
        country: 'Ukraine',
        isBreaking: false,
        isTrending: true,
        category: 'Humanitarian',
        url: '#'
      }
    ],
    'China': [
      {
        id: 'cn1',
        title: 'China Conducts Large-Scale Military Drills Near Taiwan',
        summary: 'PLA forces simulate amphibious assault scenarios in what analysts call escalatory military posturing.',
        source: 'South China Morning Post',
        publishedAt: '45 minutes ago',
        country: 'China',
        isBreaking: true,
        isTrending: true,
        category: 'Military',
        url: '#'
      },
      {
        id: 'cn2',
        title: 'Technology Export Controls Tighten on Semiconductor Industry',
        summary: 'New restrictions on advanced chip technology exports threaten global supply chain stability.',
        source: 'Wall Street Journal',
        publishedAt: '2 hours ago',
        country: 'China',
        isBreaking: false,
        isTrending: true,
        category: 'Technology',
        url: '#'
      }
    ]
  }

  if (country && countrySpecificNews[country]) {
    return [...countrySpecificNews[country], ...globalNews.slice(0, 3)]
  }

  return globalNews
}

export default function NewsPanel({ selectedCountry }: NewsPanelProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [filter, setFilter] = useState<'all' | 'breaking' | 'trending'>('all')
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newsData = generateNewsData(selectedCountry || undefined)
      setNews(newsData)
      setLastUpdate(new Date())
      setLoading(false)
    }, 800)
  }, [selectedCountry])

  const filteredNews = news.filter(article => {
    if (filter === 'breaking') return article.isBreaking
    if (filter === 'trending') return article.isTrending
    return true
  })

  const breakingCount = news.filter(n => n.isBreaking).length
  const trendingCount = news.filter(n => n.isTrending).length

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Military': 'text-red-400 bg-red-900/20',
      'Cybersecurity': 'text-purple-400 bg-purple-900/20',
      'Economics': 'text-green-400 bg-green-900/20',
      'Intelligence': 'text-orange-400 bg-orange-900/20',
      'Defense': 'text-red-400 bg-red-900/20',
      'Humanitarian': 'text-cyan-400 bg-cyan-900/20',
      'Technology': 'text-indigo-400 bg-indigo-900/20'
    }
    return colors[category] || 'text-gray-400 bg-gray-900/20'
  }

  return (
    <div className="h-full flex flex-col bg-black border-l border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {selectedCountry ? `${selectedCountry} Intel` : 'Global Intelligence'}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-400 font-medium">LIVE FEED</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setLoading(!loading)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700">
            <div className="text-xl font-bold text-white">{news.length}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="bg-red-900/30 rounded-lg p-3 text-center border border-red-800/30">
            <div className="text-xl font-bold text-red-400">{breakingCount}</div>
            <div className="text-xs text-red-400">Breaking</div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-3 text-center border border-orange-800/30">
            <div className="text-xl font-bold text-orange-400">{trendingCount}</div>
            <div className="text-xs text-orange-400">Trending</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Intel', count: news.length },
            { key: 'breaking', label: 'Breaking', count: breakingCount },
            { key: 'trending', label: 'Trending', count: trendingCount }
          ].map((filterType) => (
            <button
              key={filterType.key}
              onClick={() => setFilter(filterType.key as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition-all ${
                filter === filterType.key
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>{filterType.label}</span>
              <span className="bg-black/30 px-1.5 py-0.5 rounded text-xs">
                {filterType.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm">Gathering intelligence...</p>
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          <AnimatePresence>
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gray-900/50 hover:bg-gray-800/70 border border-gray-700 hover:border-orange-600/50 rounded-xl p-4 cursor-pointer transition-all duration-300"
                onClick={() => window.open(article.url, '_blank')}
              >
                {/* Article Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {article.isBreaking && (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse font-medium">
                        BREAKING
                      </span>
                    )}
                    {article.isTrending && (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-orange-400" />
                        <span className="text-orange-400 text-xs font-medium">TRENDING</span>
                      </div>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-white font-medium mb-2 leading-tight group-hover:text-orange-300 transition-colors">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                  {article.summary}
                </p>

                {/* Category and Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span className="text-xs">{article.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{article.publishedAt}</span>
                  </div>
                </div>

                {/* Hover Effect Line */}
                <div className="h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-3"></div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNews.length === 0 && !loading && (
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-2">No intelligence data found</p>
              <p className="text-gray-500 text-sm">
                {selectedCountry 
                  ? `No current intel for ${selectedCountry}` 
                  : 'Try adjusting your filters or check back later'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Intel Feed Active</span>
          </div>
          <div className="text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}