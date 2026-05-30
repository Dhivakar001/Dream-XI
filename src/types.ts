export interface Player {
  id: string;
  name: string;
  rating: number;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'CM' | 'CDM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'ST' | 'CF';
  category: 'ST' | 'MID' | 'DEF' | 'GK'; // Grouped for tactical slot alignment
  nation: string;
  nationFlag: string;
  club: string;
  clubLogo: string;
  league: string;
  era: 'Current' | 'Legend';
  playstyle: string;
  cardType: 'Gold' | 'Icon' | 'Legend' | 'TOTY' | 'Future Star';
  auraRating: number; // Football Aura Meter (0-100)
  avatarSeed: string; // Used for dynamic premium avatars
  stats: {
    pac: number; // Pace
    sho: number; // Shooting
    pas: number; // Passing
    dri: number; // Dribbling
    def: number; // Defending
    phy: number; // Physical
  };
  achievements?: string[];
}

export type FormationName = '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2' | '5-3-2';

export interface FormationPosition {
  id: string; // e.g., 'ST', 'LCM', 'CB1'
  label: string;
  category: 'ST' | 'MID' | 'DEF' | 'GK';
  x: number; // Percentage from left of pitch (0-100)
  y: number; // Percentage from top of pitch (0-100)
}

export interface Formation {
  name: FormationName;
  positions: FormationPosition[];
}

export interface SquadSlot {
  positionId: string; // references formation position id
  player: Player | null;
}

export interface Squad {
  id: string;
  name: string;
  userId: string;
  userName: string;
  formation: FormationName;
  slots: SquadSlot[];
  chemistry: number; // 0-100
  rating: number; // Average player rating (0-100)
  isPublic: boolean;
  description: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  auraScore: number; // Integrated average squad aura metric
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  favoriteClub: string;
  favoriteSquadId?: string;
  winRate: number; // Match simulation winrate e.g. 64%
  footballIQ: number; // Dynamic evaluation score (e.g. 135)
  followers: number;
  following: number;
  badges: string[];
  squadsCount: number;
  bio: string;
  avatar?: string;
  favoritePlayer?: string;
  createdAt?: string;
  likesReceived?: number;
  auraScore?: number;
}

export interface Battle {
  id: string;
  squadA: Squad;
  squadB: Squad;
  votesA: number;
  votesB: number;
  votedUserIds: string[]; // Track user ids who voted to avoid duplicate voting
  createdAt: string;
  concluded: boolean;
  commentsCount: number;
}

export interface Comment {
  id: string;
  targetId: string; // battleId or postId
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userBio: string;
  text: string;
  squad?: Squad; // Optional attached squad
  likes: number;
  likedBy: string[];
  commentsCount: number;
  createdAt: string;
}

export interface MatchEvent {
  time: number;
  type: 'GOAL' | 'YELLOW' | 'RED' | 'SUB' | 'INJURY' | 'COMMENTARY';
  playerId?: string;
  playerName?: string;
  team: 'A' | 'B';
  description: string;
}

export interface SimulationResult {
  squadA: Squad;
  squadB: Squad;
  scoreA: number;
  scoreB: number;
  stats: {
    possessionA: number;
    possessionB: number;
    shotsA: number;
    shotsB: number;
    foulsA: number;
    foulsB: number;
  };
  events: MatchEvent[];
  mvp: Player;
}
