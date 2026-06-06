# Dream XI Arena Labs 🏆⚽

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-Flash_2.5-FBE116?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

Dream XI Arena Labs is an incredibly immersive, interactive, full-stack tactical football simulation and fantasy drafting platform. Designed with dynamic squad orchestration, native fluid UI transitions, "TikTok-like" micro-haptic haptic pulses, and an advanced AI-powered tactical assessment engine, it allows football fans ("Gaffers") to build their dream squads, pit them against community boards, and level up their ultimate tactical football IQ.

---

## 📖 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Installation & Setup](#-installation--setup)
5. [Usage Examples](#-usage-examples)
6. [Folder Structure](#-folder-structure)
7. [Security & Optimization Architecture](#-security--optimization-architecture)
8. [Deployment Guidelines](#-deployment-guidelines)
9. [Contribution Principles](#-contribution-principles)

---

## 🚀 Key Features

### 1. Interactive Pitch Builder & Squad Blueprinting
- **Fluid Formations**: Live tactical adjustment supporting several templates (e.g. *4-3-3*, *4-2-3-1*, *3-5-2*, *4-4-2*, and *4-1-2-1-2*).
- **Holographic Legends & Superstars**: Custom visual game cards styled with live-updated high-energy CSS glows, dynamic physical ratings (PAC, SHO, PAS, DRI, DEF, PHY), and individual chemistry connections.
- **Mathematical Chemistry & Aura Solvers**: Dynamic calculations linking players by club, nation, era, and position to generate live chemistry ratings.

### 2. Tactical Match Engine & Battle Arena
- **Simulated Match Engine**: Ticker showing events in real-time. Features goal probability math factoring in chemistry ratings, squad stars, and randomized football match patterns.
- **Arena Battles**: Engage in battle simulations against other Gaffers in interactive tournaments.

### 3. Tactile Mobile Micro-Haptics
- **Action-Targeted Vibrations**: Leverages the native mobile **Navigator Vibrate API** to deliver snappy, TikTok-like physical feedback during key events:
  - **Single Tactile Tick (9ms)**: Activates on navigation bar tab-swaps and secondary button clicks.
  - **Interactive Dual-Pulse (15ms tick, 40ms wait, 12ms tick)**: Signals a successful squad save or formation completion.
  - **Strategic Whistle Rumble**: Multi-pulse sweep mimicking real referee whistles upon kickoff or full-time alerts.

### 4. Smart AI Tactical Assistant
- **Gemini Pro Integrations**: Utilizing the server-side `@google/genai` TypeScript SDK, users receive deep-dive tactical ratings, formation feedback, and recommended additions based on actual pitch dynamics.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 19, TypeScript 5
- **Build System**: Vite 6, esbuild (optimized for bundling Express and client entrypoints)
- **Styling**: Tailwind CSS v4, Motion (fluid interface choreography)
- **Backend API**: Express.js (custom RESTful middlewares)
- **Database**: Supabase SDK or Local-Storage Fallback Engines
- **Generative AI Link**: Google Gen AI SDK (`@google/genai`)

---

## 📋 Prerequisites

Before proceeding with installation, verify that your development workspace includes:

- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9.x or higher (or Yarn v1.22+ / pnpm v8+)
- **Browser Compatibility**: A modern web browser supporting the following APIs to enable the full high-fidelity user experience:
  - **Web Audio API**: Standard across modern mobile/desktop browsers (for simulated stadium SFX and click synthetic tones).
  - **Navigator Vibrate API**: Supported on most Android browsers (Chrome, Firefox, Opera) and Chromium mobile containers (to enable the tactile micro-haptic experiences).

---

## 📦 Installation & Setup

### 1. Clone & Set Up the Repository
```bash
# Clone the repository
git clone https://github.com/your-username/dreamxi-arena-labs.git
cd dreamxi-arena-labs

# Install primary packages
npm install
```

### 2. Set Up Environment Secrets
Duplicate the `.env.example` configurations to manage your dynamic keys safely:
```bash
cp .env.example .env
```

Open the `.env` file and supply your private configuration credentials. **Do not prefix these variables with `VITE_`** if they are meant to be shielded securely on the backend server:
```env
# Required for running the AI Team Analyst feature
GEMINI_API_KEY=your_secured_gemini_api_key_here

# Required for remote cloud synchronization
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Compile and Run Local Dev Environment
Launch the combined frontend assets builder and backend Express routing server:
```bash
npm run dev
```
The server will bind and become accessible on:
- **Local Dev Server**: `http://localhost:3000`

---

## 💡 Usage Examples

### 1. Triggering Micro-Haptic Tactics (Client Side)
To trigger physical haptics in sync with actions, import the secure vibration utilities in `/src/utils.ts`:

```typescript
import { playFutSound, vibrateDevice } from './utils';

// Trigger a lightweight, 9ms tactical tap upon selecting a card
function handleSelectPlayer() {
  playFutSound('click'); // Automatically executes vibrateDevice(9) and optional SFX
}

// Trigger a custom complex pattern (e.g. dual alert) programmatically
function handleSuccessfulDraft() {
  // 15ms pulse, 40ms wait, 12ms pulse
  vibrateDevice([15, 40, 12]);
}
```

### 2. Backend Endpoint Security Guarding (Server Side)
The server implementation in `server.ts` uses robust rate limiters, payload size gates, and central exception shielding:

```typescript
import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();

// Defensive Body Buffer Guards
app.use(express.json({ limit: '100kb' }));

// Restrict authentication script bots
const bruteForceAuthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  message: { error: "Authentication retry threshold reached. Please wait 5 minutes." }
});

app.post('/api/auth/login', bruteForceAuthLimiter, (req, res) => {
  // Login handler
});
```

---

## 🗂️ Folder Structure

The layout separates frontend presentation components, core assets, and backend server routers:

```text
├── data/                      # Local JSON Database Fallbacks (persistent storage backup)
├── src/                       # Main Front-End Application Directory
│   ├── components/            # Reusable UI & Widget layouts
│   │   ├── auth/              # Secure Auth Forms (Login / Signup)
│   │   ├── AIAnalysis.tsx     # Gemini smart AI analysis viewport
│   │   ├── HolographicCard.tsx# Customized CSS interactive game cards
│   │   └── PitchBuilder.tsx   # Visual 11-player formation planner
│   ├── lib/                   # Database interfaces & API sync adapters
│   │   ├── supabase.ts        # Supabase API connectors
│   │   └── translations.ts    # Multi-language translation tokens
│   ├── pages/                 # Full Screen/Tab layouts (e.g., HomePage, MatchSim)
│   ├── App.tsx                # Master applet orchestration & routing
│   ├── index.css              # Custom Tailwind directives and root styles
│   ├── types.ts               # Shared global TypeScript interfaces and models
│   └── utils.ts               # Chemistry engines, synthesizers, and haptic APIs
├── server.ts                  # Production-hardened Express API and static assets router
├── .env.example               # Safe blueprint for local environment secrets
├── vite.config.ts             # Vite bundling rules for development routing
├── tsconfig.json              # TypeScript compilation rules
└── README.md                  # Comprehensive platform documentation (This file)
```

---

## 🛡️ Security & Optimization Architecture

Dream XI Arena Labs incorporates strict measures to safeguard application operations, API resources, and user data:

- **Strict Custom Content Security Policies (CSP)**: Built via `helmet` to support crossport rendering inside sandboxed developer iframes while forbidding execution of inline styling injection vectors.
- **Obfuscated Exception Layer**: Prevents exposure of database stack traces, file system indices, or developer machine names to client-side responses.
- **Resource Exhaustion Shields**: Rate limiting protects server resources, while request limits prevent high-memory JSON payload attacks.
- **Dicebear Avatar Exceptions**: Specifically allowed in CSP `imgSrc` variables to generate high-fidelity pixel avatars safely.

---

## ⚡ Deployment Guidelines

These guidelines ensure your application compiles and deploys seamlessly across hosting platforms.

### Production Build Compilation
To bundle production assets and compile the backend into a single target file:
```bash
npm run build
```
This script triggers:
1. Client-side compilation: Packages static HTML, CSS, and JS into `/dist`.
2. Backend compilation: Uses `esbuild` to compile `server.ts` into a self-contained CommonJS file (`dist/server.cjs`).

### Deploying directly to Cloud Run / Docker
A typical serverless container Dockerfile should use the following commands:
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contribution Principles

Thank you for contributing to Dream XI Arena Labs! Ensure your code updates follow these principles:

1. **Keep Imports Safe**: Place all imports at the top-level of the module files. Do not import raw CSS inside nested blocks.
2. **Preserve User Accessibility**: Ensure proper contrast when adding customized dark holographic textures to player cards.
3. **Respect Core Persistence Patterns**: Write clean data calls; always prioritize backend database safety, and structure fallbacks using structural model definitions in `/src/types.ts`.
