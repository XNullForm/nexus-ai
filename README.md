# NEXUS AI

**Current version: 2.0.0**

NEXUS is a local-first AI workspace with a redesigned responsive interface, compact on-device language model, conversation library, response modes, and public webpage tools.

## Quick start

1. Deploy this repository to Vercel with the repository root as the project root.
2. Open the HTTPS deployment in a current browser.
3. Send a message. On first use, NEXUS downloads the Qwen2 0.5B quantized model through WebLLM. Keep the tab open while it initializes.
4. Later sessions can reuse the browser's cached model. Clearing site data may require another download.

## What's new in 2.0.0

- Completely redesigned responsive workspace and mobile navigation.
- Chat form handling prevents normal browser form navigation and keeps the message in the conversation if model startup fails.
- Streaming responses display as the model generates them.
- Better conversation context handling and task-specific response modes: Balanced, Tutor, Concise, Creative, and Technical.
- Local conversation history, delete controls, copy response, regenerate response, and export to a text file.
- Theme preferences and Enter-to-send preference.
- Web search and public webpage reading tools remain available in the composer.
- Improved model progress and clearer error states.

## Model and performance

- Model: \`Qwen2-0.5B-Instruct-q4f16_1-MLC\` using the open-source WebLLM engine.
- Inference runs in the browser using WebGPU. No model API key or Hugging Face inference token is required.
- The compact model is intentionally lightweight and is much less capable than large hosted AI models. The new response modes and prompt improvements help structure answers, but they do not change the model's underlying intelligence.
- The model is downloaded on first use and cached by the browser where supported. Streaming makes answers appear sooner, but it does not reduce the initial model download.
- Device support depends on browser, operating system, WebGPU support, and available memory. iPhone compatibility can vary.

## Tools

- **Web search:** queries Wikipedia's public API and provides article extracts and source links. This is not a full general-purpose search engine.
- **Read webpage:** extracts text from a public HTTP(S) webpage through \`/api/read\`. Pages behind sign-in may not work.
- Tools do not control browser tabs, sign in, submit forms, or bypass school/device restrictions.

## Privacy and limitations

- Chat inference runs locally after the model is downloaded. Conversation history is stored in this browser's local storage.
- Search and webpage reading send the query or URL to the NEXUS Vercel functions and retrieve public information.
- This is an existing open model, not a newly trained model or a copy of ChatGPT, Claude, or Gemini.
- Voice, image understanding, cross-device sync, full browser automation, and hosted frontier-model routing are not included in this release.
