# AI Customer Support Bot

## Overview

A simulated AI-powered customer support chatbot with FAQ handling, contextual memory, escalation simulation, and REST API backend. Optionally integrates with an LLM for advanced responses.

## Features

- FAQ-based and AI-generated responses
- Contextual session memory
- Escalation to human agent simulation
- REST API backend (Node.js/Express)
- Frontend chat interface (HTML/CSS/JS)
- Session tracking (in-memory, can be extended to DB)

## API Endpoints

- `POST /api/session` — Start a new session
- `POST /api/chat` — Send a message, get AI/FAQ response
- `POST /api/escalate` — Escalate to human agent
- `GET /api/session/:sessionId` — Get session history

## Prompts & LLM Usage

- FAQ matching: Directly answers common questions
- LLM (simulated): Generates fallback responses, summarizes, and suggests next actions
- Escalation: If no answer, offers escalation

## Setup

1. `cd server && npm install && npm start` (starts backend on port 3001)
2. Open `index.html` in your browser (update JS to use backend API)

## Customization

- To use a real LLM, replace the `getLLMResponse` function in `server/server.js` with an API call to OpenAI, HuggingFace, etc.
- For persistent sessions, connect to a database (e.g., SQLite, MongoDB).

## Demo Video

- [Add your demo video link here]

## License

MIT
