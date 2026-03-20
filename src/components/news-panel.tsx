'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, AlertTriangle, Activity, ExternalLink, TrendingUp, RefreshCw } from 'lucide-react'
import { useNews } from '@/hooks/use-news'

interface NewsPanelProps {
  selectedCountry: string | null
}

const CATEGORIES = ['All', 'General', 'Technology', 'Business', 'Science', 'Health', 'Sports', 'Entertainment']

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Military': 'text-red-400 bg-red-900/20',
    'Cybersecurity': 'text-purple-400 bg-purple-900/20',
    'Economics': 'text-green-400 bg-green-900/20',
    'Business': 'text-green-400 bg-green-900/20',
    'Intelligence': 'text-orange-400 bg-orange-900/20',
    'Defense': 'text-red-400 bg-red-900/20',
    'Humanitarian': 'text-cyan-400 bg-cyan-900/20',
    'Technology': 'text-indigo-400 bg-indigo-900/20',
    'Science': 'text-blue-400 bg-blue-900/20',
    'Health': 'text-pink-400 bg-pink-900/20',
    'Sports': 'text-yellow-400 bg-yellow-900/20',
    'Entertainment': 'text-purple-400 bg-purple-900/20',
    'Environment': 'text-teal-400 bg-teal-900/20',
  }
  return colors[category] || 'text-gray-400 bg-gray-900/20'
}

const REFRESH_INTERVAL_MS = 60_000 // auto-refresh every 60 seconds

export default function NewsPanel({ selectedCountry }: NewsPanelProps) {
  const { news, loading, error, fetchNews } = useNews()
  const [filter, setFilter] = useState<'all' | 'breaking' | 'trending'>('all')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadNews = (silent = false) => {
    const category = selectedCategory !== 'All' ? selectedCategory : undefined
    fetchNews(selectedCountry || undefined, category).then(() => {
      setLastUpdate(new Date())
      if (!silent) setCountdown(REFRESH_INTERVAL_MS / 1000)
    })
  }

  // Reset and restart auto-refresh whenever country or category changes
  useEffect(() => {
    loadNews()

    if (intervalRef.current) clearInterval(intervalRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)

    setCountdown(REFRESH_INTERVAL_MS / 1000)

    // Countdown ticker
    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL_MS / 1000 : prev - 1))
    }, 1000)

    // Auto-refresh
    intervalRef.current = setInterval(() => {
      loadNews(true)
      setCountdown(REFRESH_INTERVAL_MS / 1000)
    }, REFRESH_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [selectedCountry, selectedCategory])

  const filteredNews = news.filter(article => {
    if (filter === 'breaking') return article.isBreaking
    if (filter === 'trending') return article.isTrending
    return true
  })

  const breakingCount = news.filter(n => n.isBreaking).length
  const trendingCount = news.filter(n => n.isTrending).length

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
                {selectedCountry ? `${selectedCountry} News` : 'Global News'}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-400 font-medium">LIVE FEED</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loadNews}
            disabled={loading}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh news"
          >
            <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
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
        <div className="flex space-x-2 mb-3">
          {[
            { key: 'all', label: 'All', count: news.length },
            { key: 'breaking', label: 'Breaking', count: breakingCount },
            { key: 'trending', label: 'Trending', count: trendingCount }
          ].map((f) => (
            <button
              type="button"
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition-all ${
                filter === f.key
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>{f.label}</span>
              <span className="bg-black/30 px-1.5 py-0.5 rounded text-xs">{f.count}</span>
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'
              }`}
            >
              {cat}
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
              <p className="text-gray-400 text-sm">Fetching latest news...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="p-4">
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 text-sm mb-3">{error}</p>
              <button
                type="button"
                onClick={loadNews}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {filteredNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-gray-900/50 hover:bg-gray-800/70 border border-gray-700 hover:border-orange-600/50 rounded-xl p-4 cursor-pointer transition-all duration-300"
                  onClick={() => article.url && article.url !== '#' && window.open(article.url, '_blank')}
                >
                  {/* Article Image */}
                  {article.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                  )}

                  {/* Article Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
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
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-orange-400 transition-colors flex-shrink-0 ml-2" />
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-medium mb-2 leading-tight group-hover:text-orange-300 transition-colors">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">
                    {article.summary}
                  </p>

                  {/* Category and Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.source}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{article.publishedAt}</span>
                    </div>
                  </div>

                  {article.author && article.author !== 'Unknown' && (
                    <p className="text-xs text-gray-600 mt-1">by {article.author}</p>
                  )}

                  <div className="h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-3"></div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 mb-2">No news articles found</p>
                <p className="text-gray-500 text-sm">
                  {selectedCountry
                    ? `No current news for ${selectedCountry}`
                    : 'Try adjusting your filters or check back later'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span className={error ? 'text-red-400' : 'text-green-400'}>
              {error ? 'Feed Error' : 'Live Feed Active'}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
            {!error && (
              <span className="text-orange-400/70">
                next in {countdown}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
