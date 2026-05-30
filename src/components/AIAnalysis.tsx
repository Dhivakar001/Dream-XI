import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Wand2, Lightbulb } from 'lucide-react';
import { Squad } from '../types';
import { playFutSound } from '../utils';

interface AIAnalysisProps {
  squad: Squad | null;
}

interface AnalysisResult {
  comment: string;
  ratings: {
    attack: number;
    midfield: number;
    defense: number;
    pace: number;
    creativity: number;
    tacticalBalance: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  aura: number;
  auraComment: string;
}

export default function AIAnalysis({ squad }: AIAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Periodic sporting statuses to keep loading screen extremely engaging
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    'Benchmarking player synergy algorithms...',
    'Feeding position heatmaps to Gemini analytic layers...',
    'Synthesizing clinical forward statistics...',
    'Measuring tactical alignment across chemistry linkages...',
    'Calibrating combined squad football aura indices...'
  ];

  useEffect(() => {
    if (!squad) return;

    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading, squad]);

  useEffect(() => {
    if (!squad) return;
    
    const fetchAnalysis = async () => {
      setLoading(true);
      setErrorCode(null);
      setResult(null);

      try {
        const res = await fetch('/api/gemini/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(squad),
        });
        const data = await res.json();
        setResult(data);
        playFutSound('success');
      } catch (e) {
        console.error('Failed to query squad analytical module', e);
        setErrorCode('Failed to complete tactical telemetry.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [squad]);

  // Render a beautiful interactive SVG radar chart based on statistics values
  const renderRadarChart = (ratings: AnalysisResult['ratings']) => {
    const categories = [
      { key: 'attack', label: 'ATTACK' },
      { key: 'midfield', label: 'MIDFIELD' },
      { key: 'defense', label: 'DEFENSE' },
      { key: 'pace', label: 'PACE' },
      { key: 'creativity', label: 'CREATIVITY' },
      { key: 'tacticalBalance', label: 'BALANCE' }
    ];

    const width = 320;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = 100;
    const angleStep = (Math.PI * 2) / categories.length;

    // Calculate grid ring coordinates
    const gridRings = [25, 50, 75, 100];
    
    // Calculates point from coordinates
    const getPoint = (index: number, value: number) => {
      const angle = angleStep * index - Math.PI / 2;
      const radius = (value / 100) * maxRadius;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    };

    // Calculate data points polygon string
    const dataPoints = categories.map((cat, idx) => {
      const val = (ratings as any)[cat.key] || 50;
      const pt = getPoint(idx, val);
      return `${pt.x},${pt.y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-[320px] mx-auto filter drop-shadow-[0_0_15px_rgba(16,185,129,0.15)] select-none">
        {/* Radar Concentric Ring Grids */}
        {gridRings.map(ring => {
          const points = categories.map((_, idx) => {
            const pt = getPoint(idx, ring);
            return `${pt.x},${pt.y}`;
          }).join(' ');
          return (
            <polygon
              key={ring}
              points={points}
              fill="none"
              stroke="white"
              strokeOpacity="0.05"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Web Spoke lines */}
        {categories.map((cat, idx) => {
          const peak = getPoint(idx, 100);
          return (
            <line
              key={cat.key}
              x1={centerX}
              y1={centerY}
              x2={peak.x}
              y2={peak.y}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Glowing Data Polygon filled path */}
        <polygon
          points={dataPoints}
          fill="rgba(16, 185, 129, 0.2)"
          stroke="#10b981"
          strokeWidth="2.5"
          className="transition-all duration-500 animate-[pulse_3s_infinite]"
        />

        {/* Data Vertices glowing dots */}
        {categories.map((cat, idx) => {
          const val = (ratings as any)[cat.key] || 50;
          const pt = getPoint(idx, val);
          return (
            <circle
              key={`${cat.key}-dot`}
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#22c55e"
              stroke="#000"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels Map */}
        {categories.map((cat, idx) => {
          const pt = getPoint(idx, 115);
          const val = (ratings as any)[cat.key] || 50;
          
          // Adjust label text anchors
          let textAnchor = 'middle';
          if (pt.x > centerX + 20) textAnchor = 'start';
          if (pt.x < centerX - 20) textAnchor = 'end';

          return (
            <g key={`${cat.key}-lbl`} className="font-mono text-[9px] font-black tracking-widest select-none">
              <text
                x={pt.x}
                y={pt.y - 2}
                fill="#94a3b8"
                textAnchor={textAnchor}
              >
                {cat.label}
              </text>
              <text
                x={pt.x}
                y={pt.y + 7}
                fill="#22c55e"
                textAnchor={textAnchor}
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3">
      {/* 1. Empty Squad warning */}
      {!squad && (
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-10 text-center text-gray-400 font-mono text-xs shadow-xl backdrop-blur">
          <Cpu className="w-10 h-10 mx-auto text-yellow-500/80 mb-3 animate-spin-slow" />
          <h4 className="font-black text-white text-sm uppercase tracking-wider mb-2">TELEMETRY PREPARATION</h4>
          <p className="max-w-md mx-auto text-gray-400 leading-relaxed mb-4">
            Place some of the worlds finest legends and star players on the tactical pitch, then click <b>AI SQUAD COMMENTARY</b> above to unlock real-time intelligence feeds!
          </p>
        </div>
      )}

      {/* 2. Loading State */}
      {squad && loading && (
        <div className="bg-slate-900/70 border border-emerald-500/15 rounded-2xl p-12 text-center shadow-xl backdrop-blur relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent animate-[pulse_2s_infinite]" />
          
          <div className="relative mb-5">
            <Cpu className="w-12 h-12 text-[#10b981] animate-spin-slow filter drop-shadow-[0_0_10px_#10b981]" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute bottom-0 right-0 animate-bounce" />
          </div>

          <h4 className="font-black text-white text-sm uppercase tracking-widest mb-2">
            INTELLIGENCE TELEMETRY BUSY
          </h4>
          
          <div className="text-xs text-slate-400 font-mono italic max-w-sm h-6 overflow-hidden">
            {loadingMessages[loadingStep]}
          </div>

          <div className="w-48 bg-slate-800 rounded-full h-1.5 mt-6 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-300 h-1.5 rounded-full animate-[loading_1.5s_infinite]" style={{ width: '40%' }} />
          </div>
        </div>
      )}

      {/* 3. Error state */}
      {squad && !loading && errorCode && (
        <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6 text-center text-rose-400 font-mono text-xs">
          <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-2 animate-bounce" />
          <p className="font-bold uppercase tracking-wider mb-1">Telemetry Loop Interrupted</p>
          <p className="text-gray-400">{errorCode}</p>
        </div>
      )}

      {/* 4. Complete AI Tactical Dashboard */}
      {squad && !loading && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/80 border border-white/5 p-6 rounded-2xl backdrop-blur shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#10b981]/5 to-transparent pointer-events-none select-none" />

          {/* Core Commentary Header */}
          <div className="md:col-span-12 pb-5 border-b border-white/5 flex flex-col sm:flex-row items-start gap-4 justify-between">
            <div className="flex-1">
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1.5 mb-1 select-none">
                <Wand2 className="w-3.5 h-3.5 animate-pulse" />
                GEMINI AI TACTICAL REPORT
              </span>
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-2">
                ANALYSIS FOR: {squad.name}
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed font-mono">
                {result.comment}
              </p>
            </div>

            {/* Combined Football Aura Meter */}
            <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/20 rounded-2xl p-4 sm:w-60 w-full shrink-0 flex flex-col justify-center">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest text-[9px]">SQUAD AURA SCORE:</span>
                <span className="text-xl font-black text-[#10b981]">{result.aura}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-300 h-1.5 rounded-full filter drop-shadow-[0_0_2px_#10b981]" style={{ width: `${result.aura}%` }} />
              </div>
              <p className="text-[9px] text-gray-400 leading-relaxed font-mono mt-2 italic select-none">
                💬 {result.auraComment}
              </p>
            </div>
          </div>

          {/* Radar Chart (Col 1) */}
          <div className="md:col-span-4 flex items-center justify-center bg-black/40 border border-white/5 p-4 rounded-xl">
            <div className="w-full flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest block mb-1">TACTICAL WEB MATRIX</span>
              {renderRadarChart(result.ratings)}
            </div>
          </div>

          {/* Strengths & Weaknesses (Col 2) */}
          <div className="md:col-span-8 flex flex-col gap-4 font-mono text-xs">
            {/* Strengths Grid card */}
            <div className="bg-black/30 border border-emerald-500/10 rounded-xl p-4">
              <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-3 select-none">
                <CheckCircle2 className="w-4 h-4" />
                TACTICAL STRENGTHS
              </h4>
              <ul className="flex flex-col gap-2 list-none">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-emerald-500 text-sm leading-none mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses Grid card */}
            <div className="bg-black/30 border border-yellow-500/10 rounded-xl p-4">
              <h4 className="text-[11px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-1.5 mb-3 select-none">
                <AlertTriangle className="w-4 h-4" />
                POTENTIAL EXPOSURES
              </h4>
              <ul className="flex flex-col gap-2 list-none">
                {result.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-yellow-500 text-sm leading-none mt-0.5">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions Advice strip */}
            <div className="p-4 bg-[#eab308]/5 border border-[#eab308]/10 rounded-xl">
              <h4 className="text-[11px] font-black text-[#eab308] uppercase tracking-widest flex items-center gap-1.5 mb-2.5 select-none">
                <Lightbulb className="w-4 h-4" />
                TACTICAL INSTRUCTIONS (LOCKS)
              </h4>
              <ul className="flex flex-col gap-1.5 list-none">
                {result.suggestions.map((sug, idx) => (
                  <li key={idx} className="text-gray-300">
                    💡 <span className="font-sans leading-relaxed">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
