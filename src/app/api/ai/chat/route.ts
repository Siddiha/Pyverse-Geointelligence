import { NextRequest, NextResponse } from 'next/server'
import { getCohereResponse, getOpenAIResponse, getNewsAnalysisPrompt } from '@/lib/ai-clients'

export async function POST(request: NextRequest) {
  try {
    const { message, country } = await request.json()

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    const context = getNewsAnalysisPrompt(country)
    
    let response: string
    try {
      response = await getCohereResponse(message, context)
    } catch (cohereError) {
      console.warn('Cohere failed, trying OpenAI:', cohereError)
      response = await getOpenAIResponse(message, context)
    }

    return NextResponse.json({
      success: true,
      data: { response }
    })
  } catch (error) {
    console.error('AI Chat API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}