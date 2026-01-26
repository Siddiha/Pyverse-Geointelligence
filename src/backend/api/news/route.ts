import { NextRequest, NextResponse } from 'next/server'
import { fetchNews } from '@/lib/news-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || undefined
    const category = searchParams.get('category') || undefined

    const news = await fetchNews(country, category)
    
    return NextResponse.json({ 
      success: true, 
      data: news,
      count: news.length
    })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}