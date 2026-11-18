# NEXUS AI

**Current version: 1.4.0**

NEXUS is a mobile-friendly AI workspace with a compact open model running directly in the browser through WebLLM and WebGPU. No Hugging Face inference credits or cloud API key are required for chat.

## Run NEXUS on an iPhone

1. Deploy this repository to Vercel (or refresh the existing Vercel deployment after the latest GitHub commit).
2. Open the deployed HTTPS site in Safari. Use a normal tab, not Private Browsing.
3. Send a message. On the first chat, NEXUS downloads the Qwen2 0.5B quantized model (roughly a few hundred MB) into browser storage. Keep Safari open while it loads.
4. Later chats can reuse the cached model. If the browser clears site data, the model may need to download again.

## How it works

- Model: `Qwen2-0.5B-Instruct-q4f16_1-MLC` via the open-source WebLLM engine.
- Inference runs on the device using WebGPU; prompts are not sent to Hugging Face or another model API for chat.
- The model is intentionally small. It is useful for basic questions, short writing, and simple experiments, but is much less capable than large hosted assistants.
- iPhone support depends on the device, Safari version, available memory, and WebGPU support. If the browser reports that WebGPU is unavailable or the tab closes, the device may not be able to run this model reliably.
- The first model download requires internet. Chat generation after the model is cached can run locally.

## Included

- Responsive NEXUS 1.4.0 interface
- Local in-browser AI chat
- Local conversation history and library
- Public webpage text reader (this reader still fetches pages through the Vercel route)

## Limitations

This is an existing open model running locally, not a newly trained model or a copy of ChatGPT, Claude, or Gemini. The compact model can make mistakes and has limited reasoning ability. The webpage reader is separate from local chat and only extracts public page text. Browser automation, image understanding, voice, and cross-device sync are not included. Do not use this project to bypass school filters, monitoring, or device-management rules.


## NEXUS Tools (1.4.0)

The message composer has a Tools dropdown:
- **Web search**: searches Wikipedia's public API and provides article extracts and source links to the local model. This is an encyclopedia search, not a full Google-style web search.
- **Read webpage**: fetches readable text from the first public URL included in the message, using the existing server-side page reader.

These tools do not control browser tabs, log into sites, submit forms, or bypass school/device restrictions. Search results require an internet connection; the language model itself runs locally.
