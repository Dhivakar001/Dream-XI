# Dream XI Arena Labs 🏆⚽

Dream XI Arena Labs is a highly immersive, interactive, full-stack tactical football simulation and fantasy builder platform. Designed with dynamic squad orchestration, "TikTok-like" micro-haptic interactions, and an advanced AI-powered tactical assessor, it empowers football fans ("Gaffers") to draft dream squads, pit them against formidable opponents in a simulated arena, engage with fellow managers, and level up their tactical Football IQ.

---

## 🚀 Key Features

### 1. Interactive Pitch Builder & Squad Blueprinting
- **Dynamic Formations**: Supports traditional and modern structures (e.g., *4-3-3*, *4-2-3-1*, *3-5-2*, *4-4-2*, and *4-1-2-1-2*).
- **Holographic Team Card Drafting**: Custom cards styled with dynamic aura reflections, individual stats (PAC, SHO, PAS, DRI, DEF, PHY), and tactical indices.
- **Dynamic Chemistry & Aura Calculations**: Custom mathematical algorithms calculating immediate synergy based on players' clubs, nations, eras, and roles.

### 2. Tactical Pitch Simulation
- **Arena Battles**: Match custom lineups in physical simulation duels against community boards or simulated rival structures.
- **Match Engine**: Simulated match event ticker that factors in cumulative rating, aura levels, and randomized tactical events.

### 3. Star Database & Global Rankings
- **Historical Legends & Active Superstars**: Real-time stats, country/club tags, career timelines, and multi-player visual index comparisons.
- **Dynamic Rankings**: Global community leaderboards tracking the top-performing tactical squads or Gaffers.

### 4. TikTok-like Tactile Micro-Haptics
- **Tactile Responses**: Leveraging the browser-level **Navigator Vibrate API**, the platform emits subtle, micro-targeted physical feedback on supported mobile devices:
  - **Single Tiny Tick (9ms)**: On-tab changes and general button selection clicks.
  - **Dynamic Dual-Pulse (15ms tick, 40ms wait, 12ms tick)**: On completing tactical pitch builds or successfully saving custom formations.
  - **Multiple Sweeping Shocks**: When simulate whistle blows, kickoffs happen, or full-time results are announced.

### 5. Multi-Layer Security Architecture
- **API Payload Protection**: Defensive limit gates preventing request-body buffer exhaustion overloads (limited to `100kb`).
- **Global & Asset-Specific Rate Limiters**: Prevents brute-forcing endpoints with custom thresholds:
  - Default API paths (`300 requests/min`).
  - Compute-heavy AI analysis (`15 requests/min` to prevent api key starvation).
  - Credentials & Mock authentication paths (`20 tries/5 mins` to block script automation).
- **Hardened HTTP Headers via Helmet**: Sanitized CSP to safely whitelist third-party assets (such as dynamic Dicebear SVGs, Google Fonts, and Supabase connections) while forbidding clickjacking via responsive frame-ancestor rules inside port/iframe sandbox previews.
- **Global Error Interception Middleware**: Hides raw database exception stacks, database configurations, or third-party endpoint details by returning standardized obfuscated security tickets.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + TypeScript | Direct UI binding, component modularity, and strong types. |
| **Bundling/Dev** | Vite 6 + esbuild | Ultra-fast runtime compiling, module resolving, and bundling. |
| **Styling** | Tailwind CSS v4 | Class-driven responsive styling, gradients, and utility variables. |
| **Backend API** | Express.js | Unified routes, custom rate-limiting middleware, and asset fallbacks. |
| **Animations** | Motion (React) | High-fidelity fluid transitions and responsive touch interaction. |
| **Database** | Supabase SDK + Local DB | Robust cloud sync with fallback JSON local state persistence. |
| **Generative AI** | @google/genai SDK | Harnesses server-side Gemini 2.5 Flash for critical squad analysis. |

---

## 📦 Installation & Setup

Ensure you have **Node.js (v18 or higher)** and **npm** installed on your system.

### 1. Clone & Install Dependencies
Navigate to the root directory and install all packages:
```bash
npm install
```

### 2. Configure Environment variables
Create a private `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Define the variables correctly without client exposes:
```env
# Required for full-scale AI analysis & Smart tactical assessments
GEMINI_API_KEY=your_gemini_api_key_here

# Required if syncing with your direct PostgreSQL database or remote storage
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 💻 Development Workflow

To launch the unified Express + Vite server locally:

```bash
npm run dev
```
The server will start on **`http://localhost:3000`**.
> **Note**: Port **3000** is hardcoded for sandbox routing consistency across developer proxies.

### Production Build compilation
To build and package both the React bundle and compile the TypeScript backend:
```bash
npm run build
```
This script triggers standard Vite assets bundling inside `/dist` and uses `esbuild` to compile `server.ts` into a self-contained CommonJS target (`dist/server.cjs`), bypassing standard module loading checks.

### Run Production Server
To emulate a live cloud container locally:
```bash
npm run start
```

---

## ⚡ Deployment Instructions

This repository is optimized for direct serverless container engines (e.g., **Google Cloud Run**).

1. **Prerequisites**: Ensure your service environment has `NODE_ENV=production` set.
2. **Execution Flow**:
   - The container builds with `npm run build`.
   - The instance starts by executing the compiled server: `node dist/server.cjs`.
3. **Environment Security**: The `GEMINI_API_KEY` or `SUPABASE_ANON_KEY` **must** be stored securely in Secret Manager and injected at runtime rather than committed inline.

---

## 🤝 Contribution Guidelines

1. **Type Safety**: Avoid using `any`. Write proper interfaces or update target classes in `/src/types.ts`.
2. **Styling Rules**: Utilize Tailwind utility classes directly in standard components. Avoid creating secondary static `.css` files.
3. **Haptic Implementations**: For any new buttons or critical transaction actions, import and execute `vibrateDevice` or pass events to `playFutSound` in `/src/utils.ts` to uphold the tactile manager environment feedback.
