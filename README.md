# NEXUS AI\n\n**Current version: 1.2.0**

NEXUS is a browser-based AI workspace. Chat requests are sent to a Vercel serverless route, which calls Hugging Face Inference Providers. The secret token remains server-side.

## Setup on Vercel

1. Import this repository into Vercel (or open the existing NEXUS project).
2. In Hugging Face, open Settings → Access Tokens and create a **fine-grained** token.
3. Grant the token the permission **Make calls to Inference Providers**. Do not paste the token into chat, GitHub, or frontend files.
4. In Vercel, open Project → Settings → Environment Variables.
5. Add a variable named `HF_TOKEN` and paste the token as its value. Select the Production environment (and Preview too if testing preview deployments).
6. Save, then go to Deployments and redeploy the latest commit so the server function receives the variable.
7. Open the deployed NEXUS site, refresh, and send a short test message.

The server uses the chat-completion model `Qwen/Qwen3.5-9B` through Hugging Face's OpenAI-compatible router. The provider is automatically selected; no Featherless provider suffix is forced. Model availability, credits, and any billing requirements depend on Hugging Face and its provider partners. Review current pricing before enabling paid usage. If billing is needed, ask a parent or guardian to help.

## Included

- Responsive NEXUS 1.2.0 interface with refreshed visual design and mobile navigation
- Hosted open-model inference through a server-side API route
- Local conversation history and library
- Settings and model selection
- Public webpage text reader

## Limitations

This is an open-weight model hosted by an inference provider, not a newly trained model or a copy of ChatGPT, Claude, or Gemini. The webpage reader extracts public HTML/text; it is not a full browser and cannot control tabs, sign into websites, or access pages behind a login. Image understanding, voice, web search, user accounts, and cross-device sync are not included yet. Do not use this project to bypass school filters, monitoring, or device-management rules.
