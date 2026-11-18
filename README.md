# NEXUS AI

NEXUS is a browser-based AI workspace with a redesigned chat interface, local conversation library, model selector, and public webpage reader. It uses open-weight Qwen models through Hugging Face Inference Providers rather than the OpenAI API.

## Deploy on Vercel

1. Import this repository into Vercel: https://vercel.com/new
2. Create a Hugging Face account and review its current age, account, and billing requirements. If needed, ask a parent or guardian to help.
3. Create an access token with the minimum permissions required for inference.
4. In Vercel → Project → Settings → Environment Variables, add **HF_TOKEN** with the token value. Keep it private; never paste it into GitHub, frontend code, or a chat.
5. Redeploy after saving the environment variable.
6. Open the Vercel URL and send a test message.

The default model is Qwen2.5 7B Instruct; NEXUS Lite uses Qwen2.5 3B Instruct. Provider availability, speed, and possible costs depend on Hugging Face's current Inference Providers offering. This runs open-weight models through hosted inference; it does not train a new foundation model and does not need an OpenAI API key.

## Included

- Responsive NEXUS interface and mobile navigation
- Two open-model size options
- Chat history saved locally in the browser
- Library view to reopen conversations
- Settings and model selection
- Server-side model gateway
- Public webpage text reader with basic URL and redirect checks

## Current limitations

The reader extracts public HTML/text; it is not a full browser and cannot control tabs, click websites, sign into accounts, or access pages behind a login. Web search, image understanding, voice, user accounts, and cross-device sync are not included yet. Hosted inference may require an eligible account and available credits. Do not use this project to bypass school filters, monitoring, or device-management rules.

## Local development

The frontend is static and API routes use the Vercel serverless runtime. Run with the Vercel CLI (vercel dev) after configuring HF_TOKEN in your local environment.