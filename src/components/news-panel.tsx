'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Globe, TrendingUp, ExternalLink } from 'lucide-react'
import { useNews } from '@/hooks/use-news'
import type { NewsArticle } from '@/types/news'

interface NewsPanelProps {
  selectedCountry: string | null
}

export default function NewsPanel({ selectedCountry }: NewsPanelProps) {
  const { news, loading, error, fetchNews } = useNews()
  const [filter, setFilter] = useState<'all' | 'breaking' | 'trending'>('all')

  useEffect(() => {
    // Fix: Handle null selectedCountry properly
    if (selectedCountry) {
      fetchNews(selectedCountry)
    } else {
      fetchNews() // Global news - no parameter
    }
  }, [selectedCountry, fetchNews])

  const filteredNews = news.filter(article => {
    if (filter === 'breaking') return article.isBreaking
    if (filter === 'trending') return article.isTrending
    return true
  })

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {selectedCountry ? `${selectedCountry} News` : 'Global News'}
          </h2>
          <div className="flex items-center space-x-1 text-xs text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {['all', 'breaking', 'trending'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filter === filterType
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-400">
            <p>Failed to load news</p>
            <button 
              onClick={() => fetchNews(selectedCountry || undefined)} // Fix: convert null to undefined
              className="mt-2 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <AnimatePresence>
          {filteredNews.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="news-item glass-effect p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => window.open(article.url, '_blank')}
            >
              {/* Article Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {article.isBreaking && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                      BREAKING
                    </span>
                  )}
                  {article.isTrending && (
                    <TrendingUp className="h-4 w-4 text-orange-400" />
                  )}
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>

              {/* Title */}
              <h3 className="text-white font-medium mb-2 line-clamp-2">
                {article.title}
              </h3>

              {/* Summary */}
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {article.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Globe className="h-3 w-3" />
                  <span>{article.source}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.publishedAt}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No news articles found</p>
            <p className="text-sm">Try selecting a different country or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}