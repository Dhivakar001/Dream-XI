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

// UI Tone synthesizers using Web Audio API so it runs offline and without size
export function playFutSound(type: 'click' | 'success' | 'stadium' | 'hover') {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    }
    
    if (type === 'hover') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }

    if (type === 'success') {
      // Arpeggio chord sweep
      const now = audioCtx.currentTime;
      [330, 440, 554, 660, 880].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.1, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.22);
      });
    }

    if (type === 'stadium') {
      // Low rumble wind filtering crowd cheer noise
      const bufferSize = audioCtx.sampleRate * 1.5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 250;
      filter.Q.value = 1.0;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
      noise.stop(audioCtx.currentTime + 1.5);
    }
  } catch (e) {
    // Fail silently if browser audio block takes place
  }
}
