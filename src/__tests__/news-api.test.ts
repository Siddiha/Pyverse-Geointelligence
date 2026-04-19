import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchNews } from '@/lib/news-api'

describe('fetchNews', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns mock data when no API keys are configured', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false } as Response)

    const articles = await fetchNews()

    expect(articles).toBeInstanceOf(Array)
    expect(articles.length).toBeGreaterThan(0)
    expect(articles[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      source: expect.any(String),
    })
  })

  it('filters mock data by country', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false } as Response)

    const articles = await fetchNews('United States')

    expect(articles.every(a => a.country === 'United States' || a.country === 'Global')).toBe(true)
  })
})
