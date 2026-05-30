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
    
    let ignore = false;
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
        if (ignore) return;
        const data = await res.json();
        setResult(data);
        playFutSound('success');
      } catch (e) {
        if (ignore) return;
        console.error('Failed to query squad analytical module', e);
        setErrorCode('Failed to complete tactical telemetry.');
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchAnalysis();

    return () => {
      ignore = true;
    };
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
        <div className="bg-black border-2 border-black rounded-2xl p-10 text-center text-gray-400 font-mono text-xs shadow-[6px_6px_0px_#000] select-none">
          <Cpu className="w-10 h-10 mx-auto text-[#FBE116] mb-3 animate-spin-slow" />
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-2 font-outfit">GEN AI CHAT TELEMETRY READY</h4>
          <p className="max-w-md mx-auto text-gray-400 leading-relaxed mb-4">
            Place some of the worlds finest legends and star players on the tactical pitch, then click <b className="text-[#FBE116]">AI SQUAD COMMENTARY</b> above to unlock real-time intelligence feeds!
          </p>
        </div>
      )}

      {/* 2. Loading State */}
      {squad && loading && (
        <div className="bg-[#050408]/90 border-2 border-black rounded-2xl p-12 text-center shadow-[6px_6px_0px_#FBE116] backdrop-blur relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[#009E49]/5 animate-[pulse_2s_infinite] pointer-events-none" />
          
          <div className="relative mb-5">
            <Cpu className="w-12 h-12 text-[#FBE116] animate-spin-slow filter drop-shadow-[0_0_10px_#FBE116]" />
            <Sparkles className="w-4 h-4 text-[#009E49] absolute bottom-0 right-0 animate-bounce" />
          </div>

          <h4 className="font-black text-white text-sm uppercase tracking-widest mb-2 font-outfit italic">
            🇧🇷 CALIBRATING TACTICAL AURA DEBATE
          </h4>
          
          <div className="text-xs text-slate-300 font-mono italic max-w-sm h-6 overflow-hidden">
            {loadingMessages[loadingStep]}
          </div>

          <div className="w-48 bg-black rounded-full h-2.5 mt-6 border-2 border-black overflow-hidden pointer-events-none">
            <div className="bg-[#FBE116] h-full rounded-full animate-[loading_1.5s_infinite]" style={{ width: '40%' }} />
          </div>
        </div>
      )}

      {/* 3. Error state */}
      {squad && !loading && errorCode && (
        <div className="bg-black border-2 border-red-500 rounded-2xl p-6 text-center text-rose-400 font-mono text-xs">
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
          className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-black border-2 border-black p-6 rounded-2xl backdrop-blur shadow-[8px_8px_0px_#009E49] relative overflow-hidden text-left"
        >
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#FBE116]/10 to-transparent pointer-events-none select-none" />

          {/* Core Commentary Header */}
          <div className="md:col-span-12 pb-5 border-b-2 border-black flex flex-col sm:flex-row items-start gap-4 justify-between">
            <div className="flex-1">
              <span className="text-[10px] text-black font-extrabold bg-[#009E49] text-white px-2.5 py-1 rounded border border-black uppercase tracking-widest flex items-center gap-1.5 mb-2.5 select-none w-fit">
                <Wand2 className="w-3.5 h-3.5 animate-pulse" />
                🇧🇷 CHAT DOS CRISTAL • UNFILTERED AI REPORT
              </span>
              <h2 className="text-xl font-black text-white uppercase tracking-tight font-outfit mb-2">
                GAFFER REVIEW: {squad.name}
              </h2>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                {result.comment}
              </p>
            </div>

            {/* Combined Football Aura Meter */}
            <div className="bg-neutral-950 border-2 border-black rounded-xl p-4 sm:w-65 w-full shrink-0 flex flex-col justify-center">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[9px] text-[#FBE116] font-mono uppercase tracking-wider font-bold">STREET AURA CERT:</span>
                <span className="text-xl font-black text-[#FBE116] font-graffiti">{result.aura}%</span>
              </div>
              <div className="w-full bg-black rounded-full h-2 border border-black overflow-hidden">
                <div className="bg-gradient-to-r from-[#FBE116] to-[#009E49] h-full rounded-full" style={{ width: `${result.aura}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-mono mt-2 italic select-none">
                💬 {result.auraComment}
              </p>
            </div>
          </div>

          {/* Radar Chart (Col 1) */}
          <div className="md:col-span-4 flex items-center justify-center bg-zinc-950 border-2 border-black p-4 rounded-xl">
            <div className="w-full flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest block mb-1">STREET RADAR RATINGS</span>
              {renderRadarChart(result.ratings)}
            </div>
          </div>

          {/* Strengths & Weaknesses (Col 2) */}
          <div className="md:col-span-8 flex flex-col gap-4 font-mono text-xs">
            {/* Strengths Grid card */}
            <div className="bg-zinc-950 border-2 border-[#009E49]/30 rounded-xl p-4">
              <h4 className="text-[11px] font-black text-[#009E49] uppercase tracking-widest flex items-center gap-1.5 mb-3 select-none font-outfit">
                <CheckCircle2 className="w-4 h-4" />
                TACTICAL STRENGTHS
              </h4>
              <ul className="flex flex-col gap-2 list-none text-left">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-200">
                    <span className="text-[#009E49] text-base leading-none mt-0.5">•</span>
                    <span className="font-sans text-sm">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses Grid card */}
            <div className="bg-zinc-950 border-2 border-[#FBE116]/30 rounded-xl p-4">
              <h4 className="text-[11px] font-black text-[#FBE116] uppercase tracking-widest flex items-center gap-1.5 mb-3 select-none font-outfit">
                <AlertTriangle className="w-4 h-4" />
                POTENTIAL EXPOSURES
              </h4>
              <ul className="flex flex-col gap-2 list-none text-left">
                {result.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-200">
                    <span className="text-[#FBE116] text-base leading-none mt-0.5">•</span>
                    <span className="font-sans text-sm">{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions Advice strip */}
            <div className="p-4 bg-orange-950/20 border-2 border-[#FBE116]/20 rounded-xl">
              <h4 className="text-[11px] font-black text-[#FBE116] uppercase tracking-widest flex items-center gap-1.5 mb-2.5 select-none font-outfit">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                STREET LOCK TACTICAL INSTRUCTIONS
              </h4>
              <ul className="flex flex-col gap-1.5 list-none text-left">
                {result.suggestions.map((sug, idx) => (
                  <li key={idx} className="text-gray-200 text-sm">
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
