import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { PLAYERS_DB } from './src/playersData';
import { Squad, Battle, Comment, SocialPost, UserProfile } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent JSON Database Configuration
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure db directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

// Initial Mock Seed Data
const DEFAULT_USER: UserProfile = {
  id: 'u-user',
  username: 'Gaffer_XI',
  email: 'ppssdhivakar@gmail.com',
  favoriteClub: 'Real Madrid',
  winRate: 74,
  footballIQ: 142,
  followers: 842,
  following: 195,
  badges: ['Aura Master', 'Tactical Elite', 'Sim Specialist'],
  squadsCount: 3,
  bio: 'Tactician. Builder of elite chemistry hybrids. If you average less than 95 aura, do not talk to me.',
};

const INITIAL_SQUADS: Squad[] = [
  {
    id: 's-samba',
    name: 'Samba Kings XI',
    userId: 'u-pele',
    userName: 'Kinger_99',
    formation: '4-3-3',
    likes: 312,
    likedBy: [],
    chemistry: 100,
    rating: 97,
    isPublic: true,
    description: 'The ultimate Brazilian samba lineup of legends and superstars.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    auraScore: 98,
    slots: [
      { positionId: 'GK', player: PLAYERS_DB.find(p => p.id === 'p31') || null }, // Alisson
      { positionId: 'LB', player: PLAYERS_DB.find(p => p.id === 'p24') || null }, // Carlos
      { positionId: 'LCB', player: PLAYERS_DB.find(p => p.id === 'p22') || null }, // Maldini (Icon)
      { positionId: 'RCB', player: PLAYERS_DB.find(p => p.id === 'p23') || null }, // Van Dijk
      { positionId: 'RB', player: PLAYERS_DB.find(p => p.id === 'p29') || null }, // Cafu
      { positionId: 'LCM', player: PLAYERS_DB.find(p => p.id === 'p20') || null }, // Modric
      { positionId: 'RCM', player: PLAYERS_DB.find(p => p.id === 'p14') || null }, // KDB
      { positionId: 'CAM', player: PLAYERS_DB.find(p => p.id === 'p15') || null }, // Zidane
      { positionId: 'LW', player: PLAYERS_DB.find(p => p.id === 'p7') || null }, // Ronaldinho
      { positionId: 'RW', player: PLAYERS_DB.find(p => p.id === 'p1') || null }, // Messi
      { positionId: 'ST', player: PLAYERS_DB.find(p => p.id === 'p5') || null } // Pele
    ]
  },
  {
    id: 's-galacticos',
    name: 'Galacticos Hybrid',
    userId: 'u-gaffer',
    userName: 'Gaffer_XI',
    formation: '4-3-3',
    likes: 192,
    likedBy: [],
    chemistry: 95,
    rating: 94,
    isPublic: true,
    description: 'Combining speed and clinical midfield control. Watch out.',
    createdAt: new Date().toISOString(),
    auraScore: 96,
    slots: [
      { positionId: 'GK', player: PLAYERS_DB.find(p => p.id === 'p30') || null }, // Yashin
      { positionId: 'LB', player: PLAYERS_DB.find(p => p.id === 'p27') || null }, // Davies
      { positionId: 'LCB', player: PLAYERS_DB.find(p => p.id === 'p26') || null }, // Rudiger
      { positionId: 'RCB', player: PLAYERS_DB.find(p => p.id === 'p23') || null }, // Van Dijk
      { positionId: 'RB', player: PLAYERS_DB.find(p => p.id === 'p28') || null }, // Hakimi
      { positionId: 'LCM', player: PLAYERS_DB.find(p => p.id === 'p19') || null }, // Rodri
      { positionId: 'RCM', player: PLAYERS_DB.find(p => p.id === 'p14') || null }, // KDB
      { positionId: 'CAM', player: PLAYERS_DB.find(p => p.id === 'p16') || null }, // Bellingham
      { positionId: 'LW', player: PLAYERS_DB.find(p => p.id === 'p9') || null }, // Vini Jr
      { positionId: 'RW', player: PLAYERS_DB.find(p => p.id === 'p10') || null }, // Salah
      { positionId: 'ST', player: PLAYERS_DB.find(p => p.id === 'p3') || null } // Mbappe
    ]
  }
];

const INITIAL_BATTLES: Battle[] = [
  {
    id: 'b-legendary',
    squadA: INITIAL_SQUADS[0], // Samba Kings
    squadB: INITIAL_SQUADS[1], // Galacticos
    votesA: 345,
    votesB: 289,
    votedUserIds: [],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    concluded: false,
    commentsCount: 3
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    targetId: 'b-legendary',
    userId: 'u-chelsea-fan',
    userName: 'BlueTrue_01',
    text: 'Samba Kings has Ronaldinho and Pelé. There is no defense on earth that can stop this chemistry!',
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    likes: 42
  },
  {
    id: 'c2',
    targetId: 'b-legendary',
    userId: 'u-madrid-boy',
    userName: 'Hala_Tactics',
    text: 'Do not sleep on that Galacticos midfield of Rodri, KDB, and Jude Bellingham. It is completely fort-knox.',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    likes: 19
  },
  {
    id: 'c3',
    targetId: 'b-legendary',
    userId: 'u-antony-king',
    userName: 'Antony_Enjoyer',
    text: 'If you substitute Antony in, Galacticos wins of 10-0 ratio instantly. He is aura lord!',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    likes: 154
  }
];

const INITIAL_SOCIAL_FEED: SocialPost[] = [
  {
    id: 'post-1',
    userId: 'u-antony-king',
    userName: 'Spin_Maestro_Antony',
    userBio: 'Certified football theorist, Antony enthusiast.',
    text: 'Some gaeffers say Antony has only 1 goal in 20 matches. I say Antony has completed 360° rotational force vectors in mid-air, defeating Isaac Newton. Who is the real winner? 👑🌀',
    likes: 412,
    likedBy: [],
    commentsCount: 21,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'post-2',
    userId: 'u-user',
    userName: 'Gaffer_XI',
    userBio: 'Tactician. Builder of elite chemistry hybrids.',
    text: 'Just assembled this Galacticos Hybrid squad with 95 Chemistry! Check this defense and midfield synergy. Rodri is the real key to free up Mbappe and Vini on the wings.',
    squad: INITIAL_SQUADS[1],
    likes: 84,
    likedBy: [],
    commentsCount: 2,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

// Load Database Store
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const data = {
      users: [DEFAULT_USER],
      squads: INITIAL_SQUADS,
      battles: INITIAL_BATTLES,
      comments: INITIAL_COMMENTS,
      feed: INITIAL_SOCIAL_FEED,
      totalSimulations: 42
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON DB, initializing with empty template', err);
    return {
      users: [DEFAULT_USER],
      squads: INITIAL_SQUADS,
      battles: INITIAL_BATTLES,
      comments: INITIAL_COMMENTS,
      feed: INITIAL_SOCIAL_FEED,
      totalSimulations: 42
    };
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write back data', err);
  }
}

// -------------------------------------------------------------
// AI Squad Analysis Engine Using @google/genai & gemini-3.5-flash
// -------------------------------------------------------------
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST APIs
app.get(['/auth/callback', '/auth/callback/'], (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Gaffer Verified</title>
        <style>
          body {
            background-color: #07060b;
            color: #10b981;
            font-family: monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .card {
            border: 1px solid rgba(16, 185, 129, 0.2);
            padding: 24px;
            border-radius: 16px;
            background-color: #12111c;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h3>⚡ GAFFER TELEMETRY VERIFIED</h3>
          <p>Syncing multi-portal coordinates...</p>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'OAUTH_AUTH_SUCCESS',
              hash: window.location.hash,
              search: window.location.search
            }, '*');
            setTimeout(() => {
              window.close();
            }, 600);
          } else {
            window.location.href = '/';
          }
        </script>
      </body>
    </html>
  `);
});

// 1. Auth Mock API
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, username } = req.body;
  const db = loadDB();
  let user = db.users.find((u: any) => u.email === email);
  if (!user) {
    user = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      username: username || email.split('@')[0],
      email: email,
      favoriteClub: 'Real Madrid',
      winRate: 50,
      footballIQ: 100,
      followers: 12,
      following: 15,
      badges: ['Rookie Builder'],
      squadsCount: 0,
      bio: 'New Dream XI Gaffer!'
    };
    db.users.push(user);
    writeDB(db);
  }
  res.json({ success: true, user });
});

app.get('/api/auth/profile/:id', (req: Request, res: Response) => {
  const db = loadDB();
  const profile = db.users.find((u: any) => u.id === req.params.id) || DEFAULT_USER;
  res.json(profile);
});

app.get('/api/profile', (req: Request, res: Response) => {
  const db = loadDB();
  const profile = db.users.find((u: any) => u.id === 'u-user') || db.users[0] || DEFAULT_USER;
  res.json(profile);
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const { id, favoriteClub, bio, username } = req.body;
  const db = loadDB();
  const idx = db.users.findIndex((u: any) => u.id === id);
  if (idx !== -1) {
    db.users[idx] = {
      ...db.users[idx],
      favoriteClub: favoriteClub || db.users[idx].favoriteClub,
      bio: bio || db.users[idx].bio,
      username: username || db.users[idx].username
    };
    writeDB(db);
    res.json({ success: true, user: db.users[idx] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/api/profile', (req: Request, res: Response) => {
  const { userName, bio, favoriteClub } = req.body;
  const db = loadDB();
  const idx = db.users.findIndex((u: any) => u.id === 'u-user');
  if (idx !== -1) {
    db.users[idx] = {
      ...db.users[idx],
      favoriteClub: favoriteClub || db.users[idx].favoriteClub,
      bio: bio !== undefined ? bio : db.users[idx].bio,
      username: userName || db.users[idx].username
    };
    writeDB(db);
    res.json({ success: true, user: db.users[idx] });
  } else {
    const newUser = {
      ...DEFAULT_USER,
      favoriteClub: favoriteClub || DEFAULT_USER.favoriteClub,
      bio: bio || DEFAULT_USER.bio,
      username: userName || DEFAULT_USER.username
    };
    db.users.push(newUser);
    writeDB(db);
    res.json({ success: true, user: newUser });
  }
});

// 2. Play Database API
app.get('/api/players', (req: Request, res: Response) => {
  const { search, position, era, rarity } = req.query;
  let results = [...PLAYERS_DB];
  
  if (search) {
    const q = (search as string).toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(q) || p.club.toLowerCase().includes(q) || p.nation.toLowerCase().includes(q));
  }
  if (position && position !== 'ALL') {
    results = results.filter(p => p.position === position);
  }
  if (era && era !== 'ALL') {
    results = results.filter(p => p.era === era);
  }
  if (rarity && rarity !== 'ALL') {
    results = results.filter(p => p.cardType === rarity);
  }
  
  res.json(results);
});

// 3. Squads Builder APIs
app.get('/api/squads', (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.squads);
});

app.post('/api/squads', (req: Request, res: Response) => {
  const squadData: Squad = req.body;
  const db = loadDB();
  
  // Assign simple ID if missing
  if (!squadData.id) {
    squadData.id = 's-' + Math.random().toString(36).substring(2, 9);
  }
  
  const existingIndex = db.squads.findIndex((s: Squad) => s.id === squadData.id);
  if (existingIndex > -1) {
    db.squads[existingIndex] = squadData;
  } else {
    db.squads.unshift(squadData);
  }
  
  // Add automatically to the user post feed as shared
  const matchingUser = db.users.find((u: any) => u.id === squadData.userId);
  if (matchingUser) {
    matchingUser.squadsCount = (matchingUser.squadsCount || 0) + 1;
    // auto trigger badge achievement if 5 squads are created
    if (matchingUser.squadsCount >= 5 && !matchingUser.badges.includes('Tactical Master')) {
      matchingUser.badges.push('Tactical Master');
    }
  }

  // Create a social post to share it
  if (squadData.isPublic) {
    const sharedPost: SocialPost = {
      id: 'post-' + Math.random().toString(36).substring(2, 9),
      userId: squadData.userId,
      userName: squadData.userName,
      userBio: matchingUser?.bio || 'Elite squad builder',
      text: `Tactical breakdown of my new squad: ${squadData.name}. Perfect chemistry of ${squadData.chemistry} achieved! Check out that tactical positioning. 📐⚽`,
      squad: squadData,
      likes: 0,
      likedBy: [],
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };
    db.feed.unshift(sharedPost);
  }

  writeDB(db);
  res.json({ success: true, squad: squadData });
});

app.delete('/api/squads/:id', (req: Request, res: Response) => {
  const db = loadDB();
  db.squads = db.squads.filter((s: Squad) => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Likes squad
app.post('/api/squads/:id/like', (req: Request, res: Response) => {
  const { userId } = req.body;
  const db = loadDB();
  const squad = db.squads.find((s: Squad) => s.id === req.params.id);
  if (squad) {
    if (!squad.likedBy) squad.likedBy = [];
    if (squad.likedBy.includes(userId)) {
      squad.likedBy = squad.likedBy.filter((uid: string) => uid !== userId);
      squad.likes = Math.max(0, squad.likes - 1);
    } else {
      squad.likedBy.push(userId);
      squad.likes += 1;
    }
    writeDB(db);
    res.json({ success: true, likes: squad.likes, likedBy: squad.likedBy });
  } else {
    res.status(404).json({ error: 'Squad not found' });
  }
});

// 4. Battles / Battle Arena API
app.get('/api/battles', (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.battles);
});

app.post('/api/battles', (req: Request, res: Response) => {
  const { squadA_id, squadB_id } = req.body;
  const db = loadDB();
  
  const squadA = db.squads.find((s: Squad) => s.id === squadA_id);
  const squadB = db.squads.find((s: Squad) => s.id === squadB_id);
  
  if (!squadA || !squadB) {
    res.status(404).json({ error: 'Squad(s) not found for debate challenge' });
    return;
  }
  
  const newBattle: Battle = {
    id: 'b-' + Math.random().toString(36).substring(2, 9),
    squadA,
    squadB,
    votesA: 0,
    votesB: 0,
    votedUserIds: [],
    createdAt: new Date().toISOString(),
    concluded: false,
    commentsCount: 0
  };
  
  db.battles.unshift(newBattle);
  writeDB(db);
  res.json({ success: true, battle: newBattle });
});

// Voting API
app.post('/api/battles/:id/vote', (req: Request, res: Response) => {
  const { userId, team } = req.body; // team is 'A' or 'B'
  const db = loadDB();
  const battle = db.battles.find((b: Battle) => b.id === req.params.id);
  
  if (!battle) {
    res.status(404).json({ error: 'Battle not found' });
    return;
  }
  
  if (!battle.votedUserIds) battle.votedUserIds = [];
  
  if (battle.votedUserIds.includes(userId)) {
    res.status(400).json({ error: 'You have already voted in this battle!' });
    return;
  }
  
  if (team === 'A') {
    battle.votesA += 1;
  } else if (team === 'B') {
    battle.votesB += 1;
  } else {
    res.status(400).json({ error: 'Invalid vote team' });
    return;
  }
  
  battle.votedUserIds.push(userId);
  writeDB(db);
  res.json({ success: true, votesA: battle.votesA, votesB: battle.votesB });
});

// 5. General Comment Threads API
app.get('/api/comments/:targetId', (req: Request, res: Response) => {
  const db = loadDB();
  const comments = db.comments.filter((c: Comment) => c.targetId === req.params.targetId);
  res.json(comments);
});

app.post('/api/comments', (req: Request, res: Response) => {
  const { targetId, userId, userName, text } = req.body;
  const db = loadDB();
  
  const newComment: Comment = {
    id: 'c-' + Math.random().toString(36).substring(2, 9),
    targetId,
    userId,
    userName,
    text,
    timestamp: new Date().toISOString(),
    likes: 0
  };
  
  db.comments.push(newComment);
  
  // increment counts
  const battle = db.battles.find((b: Battle) => b.id === targetId);
  if (battle) battle.commentsCount = (battle.commentsCount || 0) + 1;
  
  const post = db.feed.find((p: SocialPost) => p.id === targetId);
  if (post) post.commentsCount = (post.commentsCount || 0) + 1;
  
  writeDB(db);
  res.json({ success: true, comment: newComment });
});

// 6. Social Feed APIs
app.get('/api/feed', (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.feed);
});

app.post('/api/feed', (req: Request, res: Response) => {
  const { userId, userName, userBio, text, squad } = req.body;
  const db = loadDB();
  
  const newPost: SocialPost = {
    id: 'post-' + Math.random().toString(36).substring(2, 9),
    userId,
    userName,
    userBio: userBio || 'Dream XI Tactician',
    text,
    squad,
    likes: 0,
    likedBy: [],
    commentsCount: 0,
    createdAt: new Date().toISOString()
  };
  
  db.feed.unshift(newPost);
  writeDB(db);
  res.json({ success: true, post: newPost });
});

// Like Social Post
app.post('/api/feed/:id/like', (req: Request, res: Response) => {
  const { userId } = req.body;
  const db = loadDB();
  const post = db.feed.find((p: SocialPost) => p.id === req.params.id);
  if (post) {
    if (!post.likedBy) post.likedBy = [];
    if (post.likedBy.includes(userId)) {
      post.likedBy = post.likedBy.filter((uid: string) => uid !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }
    writeDB(db);
    res.json({ success: true, likes: post.likes, likedBy: post.likedBy });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// 7. Leaderboards
app.get('/api/leaderboards', (req: Request, res: Response) => {
  const db = loadDB();
  
  // Sorted users by Football IQ & win rate
  const topUsers = [...db.users].sort((a, b) => b.footballIQ - a.footballIQ).slice(0, 10);
  // Sorted public squads by Likes
  const topSquads = [...db.squads].sort((a, b) => b.likes - a.likes).slice(0, 10);
  
  res.json({ topUsers, topSquads });
});

// 8. Gemini API - Smart Squad Analysis Endpoint
app.post('/api/gemini/analyze', async (req: Request, res: Response) => {
  const { squadName, formation, slots, chemistry, rating } = req.body;
  
  // Prepare dynamic team description to feed Gemini
  const activePlayers = slots
    .filter((slot: any) => slot.player !== null)
    .map((slot: any) => `${slot.player.name} (${slot.player.position}, rating: ${slot.player.rating}, club: ${slot.player.club}, nation: ${slot.player.nation}, era: ${slot.player.era})`);
  
  if (activePlayers.length === 0) {
    res.json({
      comment: "Your squad on the pitch is currently empty. Place some legendary assets or premium current stars to receive a multi-million dollar tactical breakdown!",
      ratings: { attack: 0, midfield: 0, defense: 0, pace: 0, creativity: 0, tacticalBalance: 0 },
      strengths: ["Infinite vacancies"],
      weaknesses: ["No goalkeeper to stop simple shots", "No forward line to generate goals"],
      suggestions: ["Add legendary playmakers like Ronaldinho or Lionel Messi to ignite your attack."],
      aura: 0,
      auraComment: "Non-existent level of aura. Zlatan Ibrahimović is extremely disappointed in this blank canvas."
    });
    return;
  }

  const promptText = `
    Conduct an extremely professional, premium-sports-tech level tactical evaluation for this soccer team called "${squadName || 'Dream XI Squad'}".
    Formation Selected: ${formation || '4-3-3'}
    Team Chemistry: ${chemistry || 0}%
    Players Selected On Pitch (${activePlayers.length}/11 Players):
    ${activePlayers.join('\n')}

    Base your analysis on their soccer stats, chemistry, positional synergies, historical playstyles, and humorous "football aura".
    
    You MUST output a valid JSON response matching this schema exactly.
    Do not output any introductory text, markdown flags, or trailing code snippets. Output only RAW JSON matching:
    {
      "comment": "Complete tactical evaluation overview (2-4 sentences in a highly polished sports analytic tone)",
      "ratings": {
        "attack": 0-100 rating based on clinical forwards,
        "midfield": 0-100 rating based on playmakers and defensive pivots,
        "defense": 0-100 rating based on defenders and sweeps,
        "pace": 0-100 rating based on winger/back speeds,
        "creativity": 0-100 rating based on passing skill,
        "tacticalBalance": 0-100 balance percentage
      },
      "strengths": ["Strength detail 1", "Strength detail 2"],
      "weaknesses": ["Weakness detail 1", "Weakness detail 2"],
      "suggestions": ["Strategic tactical suggestion 1", "Strategic tactical suggestion 2"],
      "aura": 0-100 overall team aura rating,
      "auraComment": "Funny, comical critique of the team's combined soccer aura (mentioning iconic star players if they are in the team, e.g. Antony's spin index, Zlatan's ownership, or Ronaldinho's happiness)."
    }
  `;

  // Fallback helper if key is missing or model fails
  const getFallbackAnalysis = () => {
    const avgRating = Math.round(rating || 85);
    const chem = chemistry || 50;
    
    const hasAntony = slots.some((s: any) => s.player?.id === 'p33');
    const hasZlatan = slots.some((s: any) => s.player?.id === 'p11');
    const hasMessi = slots.some((s: any) => s.player?.id === 'p1');
    const hasRonaldo = slots.some((s: any) => s.player?.id === 'p2');
    
    let aura = Math.min(100, Math.max(70, Math.round(avgRating * 0.9 + chem * 0.1)));
    let auraComment = "Solid combined squad swagger. Respectable tactics!";
    if (hasAntony) {
      aura = 101; 
      auraComment = "LIMIT BREAKING AURA! Antony's 360 spin rate has broken our tactical calculators. Pure celestial greatness.";
    } else if (hasZlatan) {
      aura = 99.9;
      auraComment = "Zlatan Ibrahimovic has declared himself the owner, coach, and stadium landlord. 99.9% of these tactics are powered by pure charisma!";
    } else if (hasMessi && hasRonaldo) {
      aura = 99;
      auraComment = "Messi and Cristiano Ronaldo in the same team? This is not a squad, this is a cinematic history event of pure 99.9% football IQ!";
    }

    return {
      comment: `An impressive assembly of talents utilizing a ${formation} system. Achieving ${chem}% chemistry provides critical passing avenues and rapid transitional defensive shifts under load.`,
      ratings: {
        attack: Math.min(100, Math.max(60, Math.round(avgRating + Math.random() * 8 - 4))),
        midfield: Math.min(100, Math.max(60, Math.round(avgRating + Math.random() * 6 - 3))),
        defense: Math.min(100, Math.max(60, Math.round(avgRating + Math.random() * 10 - 5))),
        pace: Math.min(100, Math.max(60, Math.round(avgRating + 3))),
        creativity: Math.min(100, Math.max(60, Math.round(avgRating + 5))),
        tacticalBalance: Math.min(100, Math.max(50, Math.round(chem * 0.8 + 15)))
      },
      strengths: [
        "Aesthetic elite transition along wing channels",
        "Commanding physical attributes and height distribution in defenders"
      ],
      weaknesses: [
        "Slight hyper-focus on direct forwards could expose high counters",
        "Pace of veteran assets might drag defensive lines back"
      ],
      suggestions: [
        "Incorporate a designated defensive CDM pivot to shelter deep center halves.",
        "Trigger high wing-back overrides to support overlapping runs on counterattacks."
      ],
      aura: aura,
      auraComment: auraComment
    };
  };

  if (!aiClient) {
    // If API key is missing, mock beautifully so the UI remains 100% active and responsive
    console.log('Gemini API key is not set. Generating fallback tactical response.');
    setTimeout(() => {
      res.json(getFallbackAnalysis());
    }, 1000);
    return;
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comment: { type: Type.STRING },
            ratings: {
              type: Type.OBJECT,
              properties: {
                attack: { type: Type.INTEGER },
                midfield: { type: Type.INTEGER },
                defense: { type: Type.INTEGER },
                pace: { type: Type.INTEGER },
                creativity: { type: Type.INTEGER },
                tacticalBalance: { type: Type.INTEGER }
              },
              required: ["attack", "midfield", "defense", "pace", "creativity", "tacticalBalance"]
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            aura: { type: Type.NUMBER },
            auraComment: { type: Type.STRING }
          },
          required: ["comment", "ratings", "strengths", "weaknesses", "suggestions", "aura", "auraComment"]
        }
      }
    });

    const output = JSON.parse(response.text.trim());
    res.json(output);
  } catch (err) {
    console.error('Gemini API Call failed, fallback used', err);
    res.json(getFallbackAnalysis());
  }
});


// Serve Front-End SPA Assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dream XI Football Server running on http://localhost:${PORT}`);
  });
}

startServer();
