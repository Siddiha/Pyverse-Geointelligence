'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Globe, TrendingUp, ExternalLink, AlertTriangle, Activity, Filter } from 'lucide-react'
import { useNews } from '@/hooks/use-news'
import type { NewsArticle } from '@/types/news'

interface NewsPanelProps {
  selectedCountry: string | null
}

export default function NewsPanel({ selectedCountry }: NewsPanelProps) {
  const { news, loading, error, fetchNews } = useNews()
  const [filter, setFilter] = useState<'all' | 'breaking' | 'trending'>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (selectedCountry) {
      fetchNews(selectedCountry)
    } else {
      fetchNews()
    }
  }, [selectedCountry, fetchNews])

  const filteredNews = news.filter(article => {
    if (filter === 'breaking') return article.isBreaking
    if (filter === 'trending') return article.isTrending
    return true
  })

  const breakingCount = news.filter(n => n.isBreaking).length
  const trendingCount = news.filter(n => n.isTrending).length

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {selectedCountry ? `${selectedCountry}` : 'Global News'}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-400 font-medium">LIVE FEED</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-900 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{news.length}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="bg-red-900/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-400">{breakingCount}</div>
            <div className="text-xs text-red-400">Breaking</div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-orange-400">{trendingCount}</div>
            <div className="text-xs text-orange-400">Trending</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex space-x-2 pb-3">
                {[
                  { key: 'all', label: 'All News', count: news.length },
                  { key: 'breaking', label: 'Breaking', count: breakingCount },
                  { key: 'trending', label: 'Trending', count: trendingCount }
                ].map((filterType) => (
                  <button
                    key={filterType.key}
                    onClick={() => setFilter(filterType.key as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition-all ${
                      filter === filterType.key
                        ? 'bg-blue-600 text-white'
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm">Loading intelligence feed...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 text-center">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 text-sm mb-2">Feed Connection Error</p>
              <button 
                onClick={() => fetchNews(selectedCountry || undefined)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
              >
                Reconnect Feed
              </button>
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          <AnimatePresence>
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-gray-900/50 hover:bg-gray-800/70 border border-gray-700 hover:border-gray-600 rounded-xl p-4 cursor-pointer transition-all duration-300"
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
                  <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-white font-medium mb-2 leading-tight group-hover:text-blue-300 transition-colors">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.category === 'Breaking' ? 'bg-red-900/30 text-red-400' :
                      article.category === 'Technology' ? 'bg-blue-900/30 text-blue-400' :
                      article.category === 'Business' ? 'bg-green-900/30 text-green-400' :
                      article.category === 'Environment' ? 'bg-emerald-900/30 text-emerald-400' :
                      article.category === 'Science' ? 'bg-purple-900/30 text-purple-400' :
                      article.category === 'Health' ? 'bg-pink-900/30 text-pink-400' :
                      'bg-gray-900/30 text-gray-400'
                    }`}>
                      {article.category}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Globe className="h-3 w-3" />
                      <span className="text-xs">{article.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{article.publishedAt}</span>
                  </div>
                </div>

                {/* Hover Effect Line */}
                <div className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-3"></div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNews.length === 0 && !loading && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-2">No intelligence data found</p>
              <p className="text-gray-500 text-sm">
                {selectedCountry 
                  ? `No current news for ${selectedCountry}` 
                  : 'Try adjusting your filters or check back later'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Live Feed Active</span>
          </div>
          <div className="text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}