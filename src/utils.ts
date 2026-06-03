import { Player, SquadSlot } from './types';

// Calculate Team Chemistry based on FUT-inspired rules
export function calculateSquadChemistry(slots: SquadSlot[]): {
  total: number; // 0 - 100
  playerChemistry: Record<string, number>; // player id -> chemistry points (0 - 3)
} {
  const activeSlots = slots.filter(s => s.player !== null);
  const playerChemMap: Record<string, number> = {};
  
  if (activeSlots.length === 0) {
    return { total: 0, playerChemistry: {} };
  }

  // Count frequencies of clubs, nations, and leagues
  const clubCounts: Record<string, number> = {};
  const nationCounts: Record<string, number> = {};
  const leagueCounts: Record<string, number> = {};

  activeSlots.forEach(slot => {
    const p = slot.player!;
    clubCounts[p.club] = (clubCounts[p.club] || 0) + 1;
    nationCounts[p.nation] = (nationCounts[p.nation] || 0) + 1;
    leagueCounts[p.league] = (leagueCounts[p.league] || 0) + 1;
  });

  // Calculate chemistry points (0 - 3) for each player slot
  slots.forEach(slot => {
    if (!slot.player) return;
    const p = slot.player;
    let score = 0;

    // 1. Natural Position check
    // Simple verification if player's natural position group fits the slot category
    const isNatural = checkNaturalPosition(p.position, slot.positionId);
    if (isNatural) score += 1;

    // 2. Nation Links (2+ players = +1)
    if (nationCounts[p.nation] >= 2) {
      score += 1;
    }

    // 3. Club Links (2+ players = +1)
    if (clubCounts[p.club] >= 2) {
      score += 1;
    }

    // 4. League Links (3+ players = +1)
    if (leagueCounts[p.league] >= 3) {
      score += 1;
    }

    playerChemMap[p.id] = Math.min(3, score);
  });

  // Scale total chemistry to 100 percentage: max points = 11 positions on pitch * 3 = 33
  const totalPoints = Object.values(playerChemMap).reduce((acc, curr) => acc + curr, 0);
  const normalizedPercentage = Math.round((totalPoints / 33) * 100);

  return {
    total: Math.min(100, normalizedPercentage),
    playerChemistry: playerChemMap
  };
}

// Check if a player profile fits a given tactical position slot
function checkNaturalPosition(playerPos: string, slotId: string): boolean {
  if (slotId.startsWith(playerPos)) return true;
  
  // Group mappings
  const defSlots = ['LB', 'RB', 'CB', 'LCB', 'RCB', 'LWB', 'RWB'];
  const midSlots = ['CM', 'LCM', 'RCM', 'CDM', 'LCDM', 'RCDM', 'CAM', 'LM', 'RM'];
  const attSlots = ['ST', 'ST1', 'ST2', 'LW', 'RW', 'CF'];

  if (playerPos === 'GK' && slotId === 'GK') return true;
  if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(playerPos) && defSlots.includes(slotId)) return true;
  if (['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(playerPos) && midSlots.includes(slotId)) return true;
  if (['ST', 'CF', 'LW', 'RW'].includes(playerPos) && attSlots.includes(slotId)) return true;

  return false;
}

// Calculate team rating
export function calculateSquadRating(slots: SquadSlot[]): number {
  const active = slots.filter(s => s.player !== null);
  if (active.length === 0) return 0;
  const sum = active.reduce((acc, curr) => acc + curr.player!.rating, 0);
  return Math.round(sum / active.length);
}

// Calculate squad average aura score
export function calculateSquadAura(slots: SquadSlot[]): number {
  const active = slots.filter(s => s.player !== null);
  if (active.length === 0) return 0;
  const sum = active.reduce((acc, curr) => acc + curr.player!.auraRating, 0);
  return Math.round((sum / active.length) * 10) / 10;
}

// Precise mobile haptic engine helper leveraging the Navigator Vibrate API
export function vibrateDevice(pattern: number | number[]) {
  if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined' && typeof window.navigator.vibrate === 'function') {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Ignored gracefully: some browsers/devices restrict auto-vibrations without user interaction
    }
  }
}

// UI Tone synthesizers using Web Audio API so it runs offline and is highly interactive
export function playFutSound(type: 'click' | 'success' | 'stadium' | 'hover' | 'whistle' | 'kickoff' | 'fulltime') {
  // Silent fallback to provide a cleaner and distraction-free user experience
  
  // Tactical TikTok-like dynamic haptic feedback mapping based on sound/interaction events
  switch (type) {
    case 'click':
      // Extremely subtle tactile snap (9ms) - perfect for tab navigation and selection clicks
      vibrateDevice(9);
      break;
    case 'success':
      // Satisfying dual tactile pulse feedback (15ms tick, 40ms wait, 12ms tick) for completing/saving builds
      vibrateDevice([15, 40, 12]);
      break;
    case 'whistle':
      // Simulated physical whistle whistle rumble
      vibrateDevice([35, 25, 40]);
      break;
    case 'kickoff':
      // Solid kickoff blast (40ms) when match starts
      vibrateDevice(40);
      break;
    case 'fulltime':
      // Multiple whistle sweeps to denote ending (50ms tap, 30ms gap, 50ms tap, 30ms gap, 100ms finish)
      vibrateDevice([50, 30, 50, 30, 100]);
      break;
    case 'hover':
      // Almost imperceptible touch tick for slider changes or item hovers
      vibrateDevice(5);
      break;
    default:
      break;
  }
}
