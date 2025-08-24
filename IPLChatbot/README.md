# ILP Chatbot (TCS Initial Learning Program)

## 📌 Project Overview & Purpose

The **ILP Chatbot** is an interactive web-based chatbot designed to assist new joiners of the **TCS Initial Learning Program (ILP)**. It helps trainees navigate the program by answering queries, providing guidance on training modules, schedules, and resources. The purpose of this project is to simplify onboarding, reduce manual dependency, and enhance the overall learning experience for associates.

---

## 🛠 Tech Stack & Dependencies

### Frontend

* **React** – UI framework for building interactive components
* **Vite** – Fast bundler & development server
* **Tailwind CSS** – Utility-first CSS framework for styling
* **TypeScript** – Type safety for JavaScript

### Backend/Support

* **Python** – for running helper scripts (`start_dev.py`)
* **Node.js** – package management & runtime

### Dependencies

* Listed in `package.json` & `pnpm-lock.yaml` (examples include ESLint, PostCSS, Autoprefixer, etc.)

---

## ⚙️ Setup & Installation Instructions

### 1. Clone the Repository

```bash
git clone <repo_url>
cd ILPChatbot
```

### 2. Install Dependencies

Using **npm**:

```bash
npm install
```

Or using **pnpm** (if preferred):

```bash
pnpm install
```

### 3. Run Development Server

```bash
npm run dev
```

This will start the Vite dev server, and the app will be accessible in your browser (usually at `http://localhost:5173`).

### 4. (Optional) Python Startup Script

If additional backend setup is needed, run:

```bash
python start_dev.py
```

---

## 🔄 Detailed Working Flow (Step by Step)

> This section breaks down exactly how the **UI**, **voice features**, and **backend API** work together. It’s based on the code in `src/components/ChatBot.tsx`, `src/components/Dashboard.tsx`, `src/pages/Index.tsx`, `src/services/chatService.ts`, and `server/app.py`.

### 0) High‑Level Architecture

```
[React (Vite)]  ──>  [ChatBot.tsx UI]  ──(HTTP via ChatService.ts)──>  [Flask API (server/app.py)]
      │                        │                               │
      │                        ├─ Voice (Web Speech API): TTS + STT
      │                        │
      │                        └─ Dashboard.tsx ──(GET /api/stats)──┘
```

---

### 1) App boot & routing

* `src/main.tsx` mounts React app.
* `src/App.tsx` wires **Toast / Tooltip providers** and **React Router**.
* `src/pages/Index.tsx` renders the main page with two tabs:

  * **Chat** → `ChatBot.tsx`
  * **Dashboard** → `Dashboard.tsx`

---

### 2) Chat UI flow (ChatBot.tsx)

**State & message model**
`Message` objects look like:

```ts
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  priority?: 'critical' | 'urgent' | 'high' | 'medium' | 'low';
  category?: string;            // e.g., wellness, program, schedule, hr, etc.
  isAnonymous?: boolean;        // UI toggle
  emotions_detected?: string[]; // e.g., ["stress", "anxiety"]
  response_type?: 'emotional_support' | 'informational';
}
```

* The component seeds a **warm welcome message** and tracks:

  * `inputValue`, `isTyping`, `currentAnonymous`
  * **Voice state**: `isVoiceEnabled`, `isSpeaking`, `currentSpeech`, `isListening`, `voiceSettings`
  * Quick suggestions (emotional & general) for one‑click prompts

**Sending a message**

1. User types or dictates text → `inputValue` updates.
2. On **Send**:

   * Push a **user** message into the timeline.
   * Show a typing indicator (`isTyping = true`).
   * **Current implementation:** calls a local `sendToAPI(...)` **mock** that simulates categorization, priority, and an empathetic reply (delayed with `setTimeout`).
   * **Recommended (real API):** replace the mock with `ChatService.chat()` (see §5. Wiring to Backend) to POST to `/api/chat`.
3. On response:

   * Push a **bot** message with fields like `priority`, `category`, `emotions_detected`, `response_type`.
   * Auto‑scroll to latest.
   * If **voice is enabled**, speak the bot reply (see §3 TTS).

**UI extras**

* **Anonymous mode** toggle (shield icon) → reflected in `currentAnonymous` and should be sent to backend as `isAnonymous`.
* **Quick actions** chips insert pre‑filled questions (e.g., “I’m feeling overwhelmed with ILP”).
* **Priority & Category** chips rendered on messages for visual triage.

---

### 3) Voice features (built into ChatBot.tsx)

The app uses the **Web Speech API** for both **Text‑to‑Speech (TTS)** and **Speech‑to‑Text (STT)**.

**Text‑to‑Speech (TTS)**

* Uses `speechSynthesis` + `SpeechSynthesisUtterance`.
* Default `voiceSettings`: `{ rate: 0.9, pitch: 1.1, volume: 0.8 }` (calm, friendly delivery).
* Attempts to pick a **female‑sounding voice** (names containing `female`, `woman`, `Zira`, `Susan`, `Samantha`) when available; otherwise uses the browser default.
* Controls in UI:

  * **Enable/Disable Voice**: cancels any ongoing speech and toggles `isVoiceEnabled`.
  * **Pause/Resume**: toggles `speechSynthesis.pause()` / `speechSynthesis.resume()` when speaking.
  * Automatically **cancels** ongoing speech when a new response arrives or voice is turned off.

**Speech‑to‑Text (STT)**

* Uses `window.webkitSpeechRecognition || window.SpeechRecognition`.
* Config:

  * `continuous = false`, `interimResults = false`, `lang = 'en-US'`.
* On **Mic** click (`toggleListening`) → starts recognition:

  * `onstart` → `isListening = true`
  * `onresult` → transcript set to `inputValue`
  * `onerror` / `onend` → `isListening = false`
* **Fallback**: if the API isn’t supported, the UI alerts the user.

> Browser support varies: Chrome desktop has the most reliable `webkitSpeechRecognition`. Other browsers may only support TTS.

---

### 4) Dashboard flow (Dashboard.tsx)

* On mount, calls `ChatService.getStats()`.
* Renders metrics like **total queries**, **resolution rates**, **priority mix**, **wellness stats**, etc.
* If the backend is unavailable or returns an error, shows a friendly error state.

---

### 5) Wiring the Chat UI to the real backend

**Current code** uses a mock `sendToAPI(...)` inside `ChatBot.tsx`. To enable real calls:

1. Import service at top of `ChatBot.tsx`:

   ```ts
   import { ChatService } from '@/services/chatService';
   ```
2. Replace the mock call with:

   ```ts
   const response = await ChatService.chat({
     message: content,
     isAnonymous: currentAnonymous,
   });
   ```
3. Ensure `src/services/chatService.ts` points to your API:

   ```ts
   const API_BASE_URL = 'http://localhost:5000/api';
   ```
4. Start backend (see §7 Backend API).

---

### 6) End‑to‑end request lifecycle

```
User types/speaks → ChatBot.tsx builds Message → (optional STT → inputValue)
→ ChatService.chat({ message, isAnonymous })
→ Flask `/api/chat` categorizes & enriches (priority, emotions, support text)
→ JSON response → ChatBot shows bot message → (optional TTS speaks it)
→ Dashboard.tsx periodically GETs `/api/stats` for KPIs
```

---

### 7) Backend API (Flask) – `server/app.py`

**Framework & middleware**

* Flask + `Flask-CORS` with `CORS(app)` enabled.
* Runs on `0.0.0.0:5000` in debug by default.

**External model integration**

* Contains a Gemini endpoint config (`GEMINI_URL = https://generativelanguage.googleapis.com/...`) and an `API_KEY` placeholder. Replace the hard‑coded key with an environment variable for security in production.

**Routes**

* `POST /api/chat` → primary chat handler

  * **Request** body:

    ```json
    { "message": "text from user", "isAnonymous": true }
    ```
  * **Behavior**: validates input, runs lightweight keyword heuristics to set `category` (e.g., technical, program, schedule, hr, wellness, career, general), computes a **priority**, and composes an **empathetic response**. (Optionally, forwards to Gemini based on config.)
  * **Response** (shape used by UI):

    ```json
    {
      "success": true,
      "message": "supportive reply text",
      "priority": "high",
      "category": "wellness",
      "emotions_detected": ["stress"],
      "response_type": "emotional_support"
    }
    ```

* `POST /api/wellness-check` → returns wellness tips / resources (used for supportive side‑panel experiences).

* `GET /api/health` → `{ ok: true }` if server is up (used by health checks).

* `GET /api/stats` → returns aggregate metrics for `Dashboard.tsx` (query counts, resolution rate, priority distribution, wellness KPIs, etc.).

**Dev utilities**

* `start_dev.py` (root): spins up backend (`server/app.py`) and the Vite dev server together.
* `server/start_backend.py`: installs deps and runs Flask server only.
* `server/requirements.txt`: Flask + CORS + requests + python-dotenv.

---

### 8) Configuration & environment

* **Frontend**: `src/services/chatService.ts` → `API_BASE_URL` (default `http://localhost:5000/api`).
* **Backend**: move secrets (e.g., `API_KEY`) to environment variables. Example:

  ```bash
  # .env (not committed)
  GEMINI_API_KEY=your_key_here
  FLASK_ENV=development
  PORT=5000
  ```

  Load via `python-dotenv` in `app.py` and read with `os.getenv(...)`.
* **CORS**: allowed for local dev by default via `CORS(app)`.

---

### 9) Error handling & edge cases

* **Frontend**

  * STT unsupported → graceful alert, continue with typing.
  * TTS voice not found → uses browser default.
  * Network/blips → show error toast, keep user/bot messages persisted in local state.
  * Voice toggles cancel/resume correctly (`speechSynthesis.cancel/pause/resume`).
* **Backend**

  * Validates payload; returns `400` with supportive fallback message if `message` is missing.
  * Catches exceptions and returns a friendly error JSON.

---

### 10) Voice controls quick reference (UI)

* 🎙 **Mic**: start/stop listening (STT). Transcript auto‑fills the input.
* 🔊 **Voice On/Off**: enable/disable TTS for bot messages.
* ⏯ **Pause/Play**: pause/resume current speech.
* ⚙️ (optional) Tune TTS **rate/pitch/volume** via `voiceSettings` in code.

---

### 11) Example: switching to real API

Replace the mock in `ChatBot.tsx`:

```ts
// BEFORE
const response = await sendToAPI(content, currentAnonymous);

// AFTER
const api = await ChatService.chat({ message: content, isAnonymous: currentAnonymous });
const botResponse: Message = {
  id: crypto.randomUUID(),
  content: api.message,
  sender: 'bot',
  timestamp: new Date(),
  priority: api.priority,
  category: api.category,
  response_type: api.response_type,
};
```

With this change, your UI will use the real Flask responses (and optional Gemini integration) end‑to‑end.

---

## 💡 Example Use Cases & Impact

* **Trainees** → Get instant answers on ILP modules, schedules, policies.
* **HR/Faculty Support** → Reduce repetitive queries and improve efficiency.
* **Onboarding** → Helps new joiners settle quickly by providing program-related information.
* **Voice Accessibility** → Voice-based queries make the chatbot more inclusive and easy to use.
* **Future Expansion** → Can integrate with TCS portals/APIs for real-time updates, NLP models for intelligent answers, and multilingual support.

---

## 🚀 Impact

This project demonstrates how a chatbot can streamline **corporate onboarding**, enhance the **training experience** for associates, and reduce manual dependency for mentors and HR coordinators. With **voice support, real-time APIs, and AI integration**, it can evolve into a complete digital assistant for ILP.
