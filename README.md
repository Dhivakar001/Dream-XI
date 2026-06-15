# Dream XI Arena Labs 🏆⚽

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-Flash_2.5-FBE116?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

Dream XI Arena Labs is an immersive, interactive, full-stack tactical football simulation and fantasy drafting platform. Crafted with dynamic squad orchestration, holographic player cards with glow shaders, native Web Audio feedback, mobile micro-haptics, and a powerful server-side AI-powered tactical assessor, it empowers football managers (aka **"Gaffers"**) to blueprint their dream squads, run live pitch simulations, and compete on the tactical leaderboard.

> ### 🌐 Live Production Demo
> **Experience the active platform live on Cloud Run**: [https://dream-xi-labs-605556465034.asia-southeast1.run.app](https://dream-xi-labs-605556465034.asia-southeast1.run.app)

---

## 📖 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Native Integrations](#-tech-stack--native-integrations)
- [📋 Prerequisites & System Requirements](#-prerequisites--system-requirements)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [⚙️ Database Setup (Supabase)](#%EF%B8%8F-database-setup-supabase)
- [💡 Interactive Code & Architecture Patterns](#-interactive-code--architecture-patterns)
- [🗂️ Folder Directory Structure](#%EF%B8%8F-folder-directory-structure)
- [🛡️ Security & Performance Safeguards](#%EF%B8%8F-security--performance-safeguards)
- [⚡ Production Deployment Guide](#-production-deployment-guide)
- [🤝 Contribution Principles](#-contribution-principles)

---

## ✨ Key Features

### 🏟️ Interactive Pitch Builder & Formation Blueprinting
- **Fluid Tactical Matrices**: Real-time canvas rendering supporting multiple standard tactical formations (e.g., *4-3-3*, *4-2-3-1*, *3-5-2*, *4-4-2*, and *4-1-2-1-2*).
- **Holographic Cards & Glow Shaders**: Custom premium visual game cards showcasing live-updated ratings (PAC, SHO, PAS, DRI, DEF, PHY) alongside special traits and team insignia.
- **Mathematical Chemistry & Aura Solvers**: Dynamic calculation engine linking players based on club affiliations, national origins, common eras, and position affinities to compute exact chemistry quotients.

### ⚔️ Live Tactical Match Engine & Battle Arena
- **Event Ticker Simulation**: Full simulation runtime displaying high-fidelity events (goals, fouls, tactics shifts, substitutions, yellow/red cards).
- **Stochastic Win-Probability Algorithm**: A custom matching mathematics engine weighing chemistry quotients and star levels against stochastic football variants to determine live scores.

### 📱 Feel the Game: Tactical Mobile Micro-Haptics
- **Action-Targeted Vibrations**: Integrates with the native **Navigator Vibrate API** to provide silent, immersive, haptic feedback during interactions:
  - **Single Haptic Tick (9ms)**: Fires on UI tab swaps and player selections.
  - **Dynamic Dual-Pulse (15ms pulse, 40ms wait, 12ms pulse)**: Fires upon successfully saving squads.
  - **Siren Sweep Whistle**: Simulates a referee's starting and full-time whistle with a sequence of multi-pulse sweeps.

### 🧠 Smart Server-Side AI Assistant
- **Gemini AI Integration**: Consuming the official `@google/genai` SDK on the server, the virtual Assistant analyses squad synergy, visualizes weak links, and recommends optimal tactical additions.

---

## 🛠️ Tech Stack & Native Integrations

- **Frontend Core**: React 19, TypeScript 5, Vite 6 (Single Page Application architecture)
- **Fluid Animation**: Motion (from `motion/react`) for smooth physical transitions and card hover physics
- **Styles**: Tailwind CSS v4 (Modern CSS variables, ultra-fast precompiled utility engine)
- **Backend API Server**: Express.js with custom middlewares
- **Database Layer**: Supabase (PostgreSQL with custom relational triggers) or dynamic local-storage mirror fallbacks
- **Generative AI Link**: Google Gen AI SDK (`@google/genai`) running securely inside server-side proxies

---

## 📋 Prerequisites & System Requirements

Ensure the target system meets these requirements prior to bootstrap:

- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9.x or higher
- **Browser Accessibility APIs**:
  - **Web Audio API**: Standard across modern mobile/desktop browsers (for simulated stadium ambient SFX and physical synthetic UI tones).
  - **Navigator Vibrate API**: Supported on modern mobile browsers (Chrome, Firefox, Opera) to experience tactile micro-haptic integrations.

---

## 🚀 Quick Start & Installation

### 1. Clone & Initialize the Workspace
```bash
# Clone the repository
git clone https://github.com/your-username/dreamxi-arena-labs.git
cd dreamxi-arena-labs

# Install base dependencies
npm install
```

### 2. Configure Local Environment State
Copy the safe blueprint file `.env.example` into a local configuration variable file:
```bash
cp .env.example .env
```

Open the newly created `.env` file and supply your private credentials securely. **Do not prefix backend secrets with `VITE_`** to prevent exposure to client-side bundles:
```env
# Google Gemini API Key - Required for server-directed Team Analyst insights
GEMINI_API_KEY=your_secured_gemini_api_key_here

# Supabase Auth & Storage API Connectors
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Run the Development Server
Launch the local Express backend proxy coupled with the Vite development engine:
```bash
npm run dev
```

Your system dev-server is now accessible at:
- **Local Host URL**: `http://localhost:3000`

---

## ⚙️ Database Setup (Supabase)

To enable robust database operations, user accounts, and tactical sharing, apply the schema located in `supabase-schema.sql` to your Supabase SQL editor:

```sql
-- Create custom profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  favorite_club TEXT,
  favorite_player TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Allow authenticated users to update their own profile data
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

---

## 💡 Interactive Code & Architecture Patterns

### 🎧 Seamless Vibrate & Audio Synthesis (Client-side)
Integrate tactile haptic rhythms with click synthesis using `/src/utils.ts`:

```typescript
import { playFutSound, vibrateDevice } from './utils';

// Trigger brief 9ms haptic response + tactical futuristic click sound
function onPlayerCardSelect() {
  playFutSound('click');
}

// Custom manual patterns: 15ms vibrate, 40ms deadspace, 12ms second tick
function onTacticalFormCommit() {
  vibrateDevice([15, 40, 12]);
}
```

### 🛡️ Production Express Protection Layers (Server-side)
Our `server.ts` proxy sets robust rate-limit walls, payload boundaries, and custom CSP setups:

```typescript
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Guard against bulky JSON inputs
app.use(express.json({ limit: '100kb' }));

// Express brute-force protective shield for authentication lines
const authSafetyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute isolation period
  max: 20, // Max requests
  message: { error: "Security checkpoint: Too many verification attempts. Please unlock in 5 minutes." }
});

app.post('/api/auth/login', authSafetyLimiter, (req, res) => {
  // Login verification logics
});
```

---

## 🗂️ Folder Directory Structure

```text
├── data/                      # Persistent state backups & JSON assets fallbacks
├── src/                       # Master Frontend Application Source
│   ├── components/            # Reusable components & interface structures
│   │   ├── auth/              # Secure authentication layouts (Login, Signup Forms)
│   │   ├── AIAnalysis.tsx     # Gemini AI tactical analysis module
│   │   ├── HolographicCard.tsx# Interactive, glowing holographic player cards
│   │   └── PitchBuilder.tsx   # Drag-and-drop squad planner & chemistry solver
│   ├── lib/                   # Database interfaces & translation modules
│   │   ├── supabase.ts        # Supabase API connector client
│   │   └── translations.ts    # Multi-language system bundle (EN, ES, etc.)
│   ├── pages/                 # Full Screen Views (Home, Arena Battles, Match Simulator)
│   ├── App.tsx                # Base client router and portal root
│   ├── index.css              # Custom Tailwind directives & visual utilities
│   ├── types.ts               # Shared global TypeScript typings
│   └── utils.ts               # Sound synthesizers, mobile haptics, & chemistry solvers
├── server.ts                  # Hardened production Express backend & production server
├── .env.example               # Environmental blueprints (excluding active keys)
├── supabase-schema.sql        # Database initialization DDL commands
├── vite.config.ts             # Vite build orchestration & asset loaders
├── tsconfig.json              # TypeScript compilation specifications
└── README.md                  # Comprehensive platform documentation (This file)
```

---

## 🛡️ Security & Performance Safeguards

Dream XI Arena Labs enforces high-standard security rules to maintain stable performance and browser isolation:

1. **Helmet-Configured Content Security Policy (CSP)**: Includes direct exception rules for safe asset fetching (e.g., Google OAuth API callbacks, Google User Avatars, and secured pixel-art placeholders from Dicebear).
2. **Abstract Exception Shields**: Keeps internal file paths, module structures, and backend node properties invisible during system runtime exceptions.
3. **Optimized Dev & Production Builds**: Relies on a unified building chain where `esbuild` bundles typescript server entry points directly into highly performant CommonJS targets.

---

## ⚡ Production Deployment Guide

Our runtime supports full compilation of the frontend and packaging of the server to ensure fast deployment.

### 1. Execute Unified Build Command
```bash
npm run build
```
This multi-process step triggers:
- Client bundle: Packages optimized browser-side index assets to `/dist`.
- Backend compile: Bundles `server.ts` into an optimized CommonJS bundle at `dist/server.cjs` via `esbuild`.

### 2. Standalone Container Packaging
Deploy easily using the standard serverless container recipe below:
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

Contributions are welcome! Please follow these standards to maintain high codebase hygiene:

- **Type Integrity**: Run `npm run lint` regularly to verify strict type verification (`tsc --noEmit`).
- **Global Path Declarations**: Ensure all imports are declared cleanly at the top of active modules. Never include inline imports.
- **Inclusive Typography & Design**: Maintain professional color contrast (minimum AAA standards) across pitch graphics, card faces, and terminal outputs.

---

*Crafted with ⚽ passion by Gaffers for Gaffers.*
