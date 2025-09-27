# Pyverse GeoIntelligence Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# AI API Keys
# Get your Cohere API key from: https://cohere.ai/
COHERE_API_KEY=your_cohere_api_key_here

# Get your OpenAI API key from: https://platform.openai.com/
OPENAI_API_KEY=your_openai_api_key_here

# News API (optional)
NEWS_API_KEY=your_news_api_key_here
```

## Features Implemented

### ✅ Black Glamorism Design
- Pure black background with white accents
- Removed all blue colors
- White nodes visible on the globe
- Sleek, modern interface

### ✅ Three.js Globe
- Auto-rotating globe (slow rotation)
- Visible white nodes on countries
- Interactive controls (drag to rotate, scroll to zoom)
- Black/grey globe with white atmosphere

### ✅ AI Chat Integration
- Real Cohere API integration
- Fallback to OpenAI if Cohere fails
- Proper error handling
- Mock responses when no API keys provided

### ✅ Backend Functionality
- Working chat API endpoint
- Proper AI client integration
- Error handling and fallbacks

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Keys Setup

### Cohere API
1. Go to [https://cohere.ai/](https://cohere.ai/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

### OpenAI API (Optional)
1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

## Design Features

- **Black Glamorism**: Pure black background with white accents
- **Minimalist**: Clean, modern interface
- **Interactive Globe**: 3D Earth with visible nodes
- **AI Integration**: Real-time chat with AI assistants
- **Responsive**: Works on all screen sizes
