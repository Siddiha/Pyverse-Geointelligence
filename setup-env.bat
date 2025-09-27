@echo off
echo Creating environment file...
echo.
echo # AI API Keys > .env.local
echo COHERE_API_KEY=8B6APzN19FZx66vm7SX1vhqQAIo5vf4oEEjpE9DZ >> .env.local
echo OPENAI_API_KEY=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 >> .env.local
echo VAPI_API_KEY=your_vapi_api_key_here >> .env.local
echo. >> .env.local
echo # News API Keys >> .env.local
echo NEWS_API_KEY=053ee916de2c4fb08a08b38a77bbc77e >> .env.local
echo GUARDIAN_API_KEY=e80a56ab-475e-433e-942e-99ade2444db1 >> .env.local
echo. >> .env.local
echo # Next.js >> .env.local
echo NEXTAUTH_SECRET=geointel-ai-dev-2024-f8n9x2p7k1m5q3w8r6t4y9u2i5o7a1s3d6g9h2j4k7l0 >> .env.local
echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
echo.
echo Environment file created successfully!
echo.
pause
