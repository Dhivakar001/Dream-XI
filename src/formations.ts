import { Formation } from './types';

export const FORMATIONS: Record<string, Formation> = {
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { id: 'GK', label: 'GK', category: 'GK', x: 50, y: 85 },
      
      { id: 'LB', label: 'LB', category: 'DEF', x: 15, y: 68 },
      { id: 'LCB', label: 'CB', category: 'DEF', x: 38, y: 70 },
      { id: 'RCB', label: 'CB', category: 'DEF', x: 62, y: 70 },
      { id: 'RB', label: 'RB', category: 'DEF', x: 85, y: 68 },
      
      { id: 'LCM', label: 'CM', category: 'MID', x: 30, y: 48 },
      { id: 'RCM', label: 'CM', category: 'MID', x: 70, y: 48 },
      { id: 'CAM', label: 'CAM', category: 'MID', x: 50, y: 38 },
      
      { id: 'LW', label: 'LW', category: 'ST', x: 20, y: 18 },
      { id: 'RW', label: 'RW', category: 'ST', x: 80, y: 18 },
      { id: 'ST', label: 'ST', category: 'ST', x: 50, y: 15 },
    ]
  },
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { id: 'GK', label: 'GK', category: 'GK', x: 50, y: 85 },
      
      { id: 'LB', label: 'LB', category: 'DEF', x: 15, y: 68 },
      { id: 'LCB', label: 'CB', category: 'DEF', x: 38, y: 70 },
      { id: 'RCB', label: 'CB', category: 'DEF', x: 62, y: 70 },
      { id: 'RB', label: 'RB', category: 'DEF', x: 85, y: 68 },
      
      { id: 'LM', label: 'LM', category: 'MID', x: 15, y: 45 },
      { id: 'LCM', label: 'CM', category: 'MID', x: 38, y: 48 },
      { id: 'RCM', label: 'CM', category: 'MID', x: 62, y: 48 },
      { id: 'RM', label: 'RM', category: 'MID', x: 85, y: 45 },
      
      { id: 'ST1', label: 'ST', category: 'ST', x: 35, y: 18 },
      { id: 'ST2', label: 'ST', category: 'ST', x: 65, y: 18 },
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { id: 'GK', label: 'GK', category: 'GK', x: 50, y: 85 },
      
      { id: 'LB', label: 'LB', category: 'DEF', x: 15, y: 70 },
      { id: 'LCB', label: 'CB', category: 'DEF', x: 38, y: 72 },
      { id: 'RCB', label: 'CB', category: 'DEF', x: 62, y: 72 },
      { id: 'RB', label: 'RB', category: 'DEF', x: 85, y: 70 },
      
      { id: 'LCDM', label: 'CDM', category: 'MID', x: 35, y: 55 },
      { id: 'RCDM', label: 'CDM', category: 'MID', x: 65, y: 55 },
      
      { id: 'LM', label: 'LM', category: 'MID', x: 20, y: 35 },
      { id: 'CAM', label: 'CAM', category: 'MID', x: 50, y: 32 },
      { id: 'RM', label: 'RM', category: 'MID', x: 80, y: 35 },
      
      { id: 'ST', label: 'ST', category: 'ST', x: 50, y: 15 },
    ]
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { id: 'GK', label: 'GK', category: 'GK', x: 50, y: 85 },
      
      { id: 'LCB', label: 'CB', category: 'DEF', x: 25, y: 72 },
      { id: 'CB', label: 'CB', category: 'DEF', x: 50, y: 74 },
      { id: 'RCB', label: 'CB', category: 'DEF', x: 75, y: 72 },
      
      { id: 'LM', label: 'LM', category: 'MID', x: 15, y: 48 },
      { id: 'LCDM', label: 'CDM', category: 'MID', x: 35, y: 52 },
      { id: 'RCDM', label: 'CDM', category: 'MID', x: 65, y: 52 },
      { id: 'RM', label: 'RM', category: 'MID', x: 85, y: 48 },
      { id: 'CAM', label: 'CAM', category: 'MID', x: 50, y: 34 },
      
      { id: 'ST1', label: 'ST', category: 'ST', x: 35, y: 16 },
      { id: 'ST2', label: 'ST', category: 'ST', x: 65, y: 16 },
    ]
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      { id: 'GK', label: 'GK', category: 'GK', x: 50, y: 85 },
      
      { id: 'LWB', label: 'LWB', category: 'DEF', x: 12, y: 62 },
      { id: 'LCB', label: 'CB', category: 'DEF', x: 32, y: 70 },
      { id: 'CB', label: 'CB', category: 'DEF', x: 50, y: 72 },
      { id: 'RCB', label: 'CB', category: 'DEF', x: 68, y: 70 },
      { id: 'RWB', label: 'RWB', category: 'DEF', x: 88, y: 62 },
      
      { id: 'LCM', label: 'CM', category: 'MID', x: 28, y: 45 },
      { id: 'CM', label: 'CM', category: 'MID', x: 50, y: 48 },
      { id: 'RCM', label: 'CM', category: 'MID', x: 72, y: 45 },
      
      { id: 'ST1', label: 'ST', category: 'ST', x: 35, y: 18 },
      { id: 'ST2', label: 'ST', category: 'ST', x: 65, y: 18 },
    ]
  }
};
