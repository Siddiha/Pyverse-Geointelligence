# Contributing to Pyverse Geointelligence

## Getting Started

1. Fork the repository and clone it locally
2. Copy `.env.example` to `.env.local` and fill in your API keys
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

## API Keys Required

| Key | Source |
|-----|--------|
| `COHERE_API_KEY` | [dashboard.cohere.ai](https://dashboard.cohere.ai/) |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `NEWS_API_KEY` | [newsapi.org](https://newsapi.org/) |
| `GUARDIAN_API_KEY` | [open-platform.theguardian.com](https://open-platform.theguardian.com/access/) |

## Development Workflow

- `npm run dev` — start local dev server
- `npm run lint` — run ESLint
- `npm run type-check` — run TypeScript type checker
- `npm run test` — run tests
- `npm run build` — production build

## Pull Requests

- Keep PRs focused — one feature or fix per PR
- Ensure `lint`, `type-check`, and `test` all pass before opening a PR
- Never commit `.env.local` or any file containing real API keys
