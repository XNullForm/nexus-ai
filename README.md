# NEXUS AI

NEXUS is a browser-based AI workspace. Its chat model runs locally on the user's device through WebLLM and WebGPU, rather than relying on a hosted model API or a secret API token.

## Deploy on Vercel

1. Import this repository into Vercel: https://vercel.com/new
2. Deploy the project. No `HF_TOKEN`, OpenAI key, or other inference secret is required.
3. Open the deployed site in a modern browser with WebGPU support.
4. Send a message. NEXUS downloads the quantized Qwen2.5 1.5B model the first time and then runs inference on the device. The download is roughly around 1 GB and is cached by the browser when supported.

## Included

- Responsive chat interface and mobile navigation
- Local on-device model inference with WebLLM
- Local conversation history and library
- Settings and model status/progress
- Public webpage text reader

## Important limitations

This is a real open-weight language model running on the user's device, not a newly trained frontier model and not a copy of ChatGPT, Claude, or Gemini. A 1.5B model is much smaller and less capable than those services. The first model download needs internet access, and inference needs a compatible WebGPU browser and enough device memory. If WebGPU is unavailable, chat will explain the limitation rather than silently calling a paid cloud API.

The webpage reader extracts public HTML/text; it is not a full browser and cannot control tabs, sign into websites, or access pages behind a login. Image understanding, voice, web search, user accounts, and cross-device sync are not included yet. Do not use this project to bypass school filters, monitoring, or device-management rules.

## How it works

The static frontend loads WebLLM from its published package and initializes a quantized Qwen model. The model weights are downloaded from public model hosting on first use; prompts and generated responses are processed locally in the browser. The Vercel `/api/chat` route is no longer used by the chat interface.
