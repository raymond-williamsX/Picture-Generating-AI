# Picture Generating AI

A minimal, professional web UI and Node backend that generates images from text prompts using a Hugging Face Stable Diffusion inference endpoint. The frontend posts a prompt to the backend, which calls the Hugging Face API, encodes the returned PNG as base64, and sends it back for immediate display in the browser.

## Features
- Single-page frontend: `index.html`, `script.js`, `style.css`
- Simple Node backend proxy: `server.js` (forwards requests to Hugging Face)
- Returns images as base64 PNG for direct embedding in the page
- Keeps the Hugging Face API key server-side to reduce exposure

## Quick Start (Local)
1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file inside `backend` with your Hugging Face API key:

```
HF_API_KEY=your_huggingface_api_key_here
```

3. Configure the frontend: open `script.js` and set `BACKEND_URL` (e.g., `http://localhost:3000`).

4. Start the backend:

```bash
npm start
```

5. Open `index.html` in your browser or serve the frontend with a static server.

## Usage
- Type a text prompt in the UI and click Generate.
- Frontend sends `POST /generate` with JSON `{ prompt: "..." }` to the backend.
- Backend forwards the prompt to the Hugging Face inference API (authorized with `HF_API_KEY`), receives a PNG, encodes it to base64, and returns `{ image: "<base64>" }`.
- Frontend sets `img.src = "data:image/png;base64,..."` to display the image.

## Prerequisites
- Node.js v16+
- A Hugging Face account with an API key and access to the chosen model
- Outbound HTTPS access to `api-inference.huggingface.co`

## Configuration & Deployment
- Keep `HF_API_KEY` as an environment variable on your server or hosting provider (do not commit it).
- Ensure CORS is configured correctly so the frontend origin can call the backend.
- When deploying, set `BACKEND_URL` in the frontend or serve the frontend from the same origin as the backend.

## Security & Cost Considerations
- Never expose `HF_API_KEY` in client-side code.
- Add authentication, rate limiting, or IP restrictions to protect the backend from abuse.
- Hugging Face inference usage may incur costs—monitor usage and quotas.

## Extending the Project
- Add generation parameters (width, height, guidance scale, steps) if the model/API supports them.
- Persist generated images (e.g., S3, database) and build a gallery or download feature.
- Add a job queue for long-running requests or integrate caching to reduce duplicate calls.

## Troubleshooting
- 400 "Prompt required": Ensure the frontend sends a non-empty prompt.
- 500 Server error: Check backend logs and Hugging Face responses; verify `HF_API_KEY` and model availability.
- Broken image: Verify backend returns valid base64 and the frontend uses `data:image/png;base64,` prefix.

## License
Add a license (e.g., MIT) if you plan to publish or share the project.

---

If you'd like, I can commit this change, open a PR, or add a short example of `server.js` request/response handling. Which would you prefer next?