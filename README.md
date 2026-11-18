# NEXUS AI

A browser-based AI workspace starter. The frontend is a static responsive site and the chat API runs as a Vercel serverless function.

## Deploy

1. Import this repository into Vercel: https://vercel.com/new
2. In the Vercel project settings, add an environment variable named `OPENAI_API_KEY` with your own OpenAI API key.
3. Deploy. Open the generated Vercel URL in a browser.

Never put provider API keys in `app.js`, `index.html`, or any public repository file.

## Features in this starter

- Responsive dark NEXUS interface
- Chat interface with conversation history stored in the current browser
- Server-side OpenAI API integration
- Fast and Advanced model options
- No local installation required for visitors

## Planned next

- Additional model providers (Anthropic and Gemini)
- Webpage reading with safe URL validation
- Accounts and cloud-synced chat history
- Browser tools that operate only on sites and devices where the user has permission

This project does not bypass school network filters or device-management policies. Use it on managed school devices only when permitted by school rules.
