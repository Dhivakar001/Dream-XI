import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShieldAlert,
  Sparkles,
  Scale,
  Calendar,
  Trophy,
  Activity,
  Award,
  BookOpen,
  ArrowRightLeft
} from 'lucide-react';
import { Player } from '../types';
import { PLAYERS_DB } from '../playersData';
import { playFutSound } from '../utils';
import HolographicCard from './HolographicCard';

interface LegendsDatabaseProps {
  onSetSquad?: (squad: any) => void;
}

interface TimelineStep {
  years: string;
  club: string;
  clubLogo: string;
  title: string;
  highlights: string[];
}

// Custom curated visual career timelines for our stars
const getPlayerTimeline = (p: Player): TimelineStep[] => {
  const customTimelines: Record<string, TimelineStep[]> = {
    p1: [
      {
        years: "2003 - 2005",
        club: "FC Barcelona",
        clubLogo: "🔵🔴",
        title: "Youth Debut & First Steps",
        highlights: ["First professional contract", "Debut in La Liga aged 17", "Youngest goalscorer for Barcelona at the time"]
      },
      {
        years: "2005 - 2009",
        club: "FC Barcelona",
        clubLogo: "🔵🔴",
        title: "Breakthrough & First Ballon d'Or",
        highlights: ["Won Champions League in 2006", "Scored legendary solo goal vs Getafe (2007)", "Crowned Ballon d'Or winner in 2009"]
      },
      {
        years: "2009 - 2015",
        club: "FC Barcelona",
        clubLogo: "🔵🔴",
        title: "Pep's Tiki-Taka Peak Era",
        highlights: ["Won historic Sextuple in 2009", "Scored world record 91 goals in calendar year (2012)", "2x Champions League Winner (2011, 2015)"]
      },
      {
        years: "2015 - 2021",
        club: "FC Barcelona",
        clubLogo: "🔵🔴",
        title: "MSN Strike Force & Club Captain",
        highlights: ["Overtook Pele's one-club goal record (672 goals)", "Won final Copa del Rey as captain", "Secured 8th Ballon d'Or"]
      },
      {
        years: "2021 - 2023",
        club: "Paris Saint-Germain",
        clubLogo: "🗼",
        title: "The French Chapter",
        highlights: ["Won 2x Ligue 1 Titles", "Won the FIFA World Cup 2022 🇦🇷 with Argentina during this spell", "Shared pitch with Mbappe & Neymar"]
      },
      {
        years: "2023 - Present",
        club: "Inter Miami",
        clubLogo: "🦩",
        title: "Sunset Tour & American Fever",
        highlights: ["Won Leagues Cup (first club trophy)", "Brought unprecedented global attention to MLS", "Continues to captain Argentina"]
      }
    ],
    p2: [
      {
        years: "2002 - 2003",
        club: "Sporting CP Breakthrough",
        clubLogo: "🟢",
        title: "Portuguese Prodigy Debut",
        highlights: ["Promoted from youth to first-team within 1 year", "Debut at age 17", "Stunned Arsenal & Man Utd scout teams in pre-season"]
      },
      {
        years: "2003 - 2009",
        club: "Manchester United",
        clubLogo: "🔴",
        title: "Old Trafford Masterclass",
        highlights: ["Won 3 consecutive Premier League titles", "First Champions League & Ballon d'Or (2008)", "Scored legendary 40-yard free-kicks"]
      },
      {
        years: "2009 - 2018",
        club: "Real Madrid",
        clubLogo: "👑",
        title: "Galáctico Peak Era",
        highlights: ["Won 4x Champions League trophies (3 consecutive)", "Scored 450 goals in 438 matches", "Won 4 additional Ballon d'Or awards"]
      },
      {
        years: "2018 - 2021",
        club: "Juventus",
        clubLogo: "⚪",
        title: "Italian Hegemony",
        highlights: ["Won 2x Serie A Titles", "Scored 101 goals in just 134 appearances", "Fastest player to reach 50 goals in Serie A history"]
      },
      {
        years: "2021 - 2022",
        club: "Manchester United Return",
        clubLogo: "🔴",
        title: "Emotional Homecoming",
        highlights: ["Sensational debut double vs Newcastle", "United's top scorer of the season with 24 goals overall", "Passed 800 official goals milestone"]
      },
      {
        years: "2023 - Present",
        club: "Al Nassr",
        clubLogo: "🟡",
        title: "Middle Eastern Expansion",
        highlights: ["Highest paid professional player in history", "Won Arab Club Champions Cup trophy", "Finished 2023 as world's top goalscorer (54 goals)"]
      }
    ],
    p3: [
      {
        years: "2015 - 2017",
        club: "AS Monaco",
        clubLogo: "🔴",
        title: "Golden Boy Breakthrough",
        highlights: ["Won Ligue 1 championship at age 18", "Stunned Europe with 6 goals in UCL knockouts", "Shattered Thierry Henry's youngest debut records"]
      },
      {
        years: "2017 - 2024",
        club: "Paris Saint-Germain",
        clubLogo: "🗼",
        title: "Parisien Kingship",
        highlights: ["Became PSG's all-time record goalscorer", "Won 6x Ligue 1 Titles", "Won the FIFA World Cup 2018 🇫🇷 as a teenager"]
      },
      {
        years: "2024 - Present",
        club: "Real Madrid",
        clubLogo: "👑",
        title: "Galáctico Dream Realized",
        highlights: ["Signed dream multi-year contract", "Scored on official debut to win UEFA Super Cup", "Forming world's most feared offensive trident"]
      }
    ],
    p4: [
      {
        years: "2017 - 2019",
        club: "Molde & Salzburg",
        clubLogo: "🔵",
        title: "Austrian Goal Machine",
        highlights: ["Scored 9 goals in a single U20 World Cup match", "Scored back-to-back UCL hat-tricks as a kid", "Sought out by every top club in Europe"]
      },
      {
        years: "2020 - 2022",
        club: "Borussia Dortmund",
        clubLogo: "🟡",
        title: "Bundesliga Rampage",
        highlights: ["Scored hat-trick on Dortmund debut in 23 minutes", "Won the DFB-Pokal Cup", "Scored 86 goals in 89 matches for the club"]
      },
      {
        years: "2022 - Present",
        club: "Manchester City",
        clubLogo: "🔵",
        title: "Premier League Conqueror",
        highlights: ["Shattered absolute Premier League single-season goals record (36)", "Won historical Treble (UCL, FA Cup, PL)", "Back-to-back Premier League Golden Boot winner"]
      }
    ],
    p5: [
      {
        years: "Teenage Phenom",
        club: "Santos FC",
        clubLogo: "⚪",
        title: "Rise of O Rei (The King)",
        highlights: ["Discovered at age 15 in São Paulo", "Scored on senior Santos debut", "Won State Championship in his debut season"]
      },
      {
        years: "1958 - 1970",
        club: "Brazil National Team",
        clubLogo: "🇧🇷",
        title: "3-Time World Cup King",
        highlights: ["Won 1958 World Cup aged 17", "Won 1962 and 1970 FIFA World Cups", "Remains the only player in history with 3 World Cup medals"]
      },
      {
        years: "1956 - 1974",
        club: "Santos FC",
        clubLogo: "⚪",
        title: "Immortal Club Conquest",
        highlights: ["Scored 643 goals in 659 official matches", "Won 2x Copa Libertadores & Intercontinental Cups", "Recognized as global cultural ambassador for football"]
      },
      {
        years: "1975 - 1977",
        club: "New York Cosmos",
        clubLogo: "🇺🇸",
        title: "North American Explosion",
        highlights: ["Brought soccer awareness to the USA", "NASL Soccer Bowl Champion (1977)", "Played final match in front of 77,000 screaming fans"]
      }
    ],
    p6: [
      {
        years: "1976 - 1981",
        club: "Argentinos Juniors",
        clubLogo: "🇦🇷",
        title: "El Pibe de Oro Debut",
        highlights: ["Debut in Argentine league at age 15", "Overtook league goal records 5 consecutive times", "Renowned for superhuman balance and skill"]
      },
      {
        years: "1981 - 1982",
        club: "Boca Juniors",
        clubLogo: "🟡",
        title: "The Bombonera Connection",
        highlights: ["Won the Metropolitano Title", "Established lifelong love affair with Boca supporters", "Scored legendary El Clásico goals against River Plate"]
      },
      {
        years: "1982 - 1984",
        club: "FC Barcelona",
        clubLogo: "🔵🔴",
        title: "The Spanish Spell",
        highlights: ["Copa del Rey winner", "First Barcelona player applauded by Real Madrid fans", "Suffered and overcame severe ankle fracture"]
      },
      {
        years: "1984 - 1991",
        club: "SSC Napoli",
        clubLogo: "🔵",
        title: "Naples Miracle & World Cup 86",
        highlights: ["Led underdog Napoli to their first 2x Serie A Titles & UEFA Cup", "Captained Argentina to 1986 World Cup glory", "Scored 'Goal of the Century' and 'Hand of God' vs England"]
      }
    ],
    p7: [
      {
        years: "1998 - 2001",
        club: "Grêmio FBPA",
        clubLogo: "🇧🇷",
        title: "Rio Grande do Sul Prodigy",
        highlights: ["Debut in Copa Libertadores aged 18", "Gained global renown for freestyle juggling on pitch", "Scored 15 goals in debut Rio state league"]
      },
      {
        years: "2001 - 2003",
        club: "Paris Saint-Germain",
        clubLogo: "🗼",
        title: "Samba Flair in Paris",
        highlights: ["Captivated French crowds with dynamic dribbles", "Won 2002 FIFA World Cup 🇧🇷 while playing for PSG", "Formed stunning aesthetic partnerships"]
      },
      {
        years: "2003 - 2008",
        club: "FC Barcelona",
        clubLogo: "🔵🔴",
        title: "Golden Peak & Ballon d'Or",
        highlights: ["Won 2x La Liga titles and 2006 Champions League", "Crowned 2005 Ballon d'Or Winner", "Received standing ovation from Real Madrid fans at Bernabéu"]
      },
      {
        years: "2008 - 2011",
        club: "AC Milan",
        clubLogo: "🔴",
        title: "The Rossoneri Showman",
        highlights: ["Scored winning goal on Milan debut vs Inter", "Led Serie A in assists", "Won the Scudetto in 2011"]
      },
      {
        years: "2012 - 2014",
        club: "Atlético Mineiro",
        clubLogo: "🇧🇷",
        title: "Ultimate South American Crown",
        highlights: ["Won the historical 2013 Copa Libertadores", "Completed legendary cabinet: World Cup, Copa America, UCL, Libertadores"]
      }
    ],
    p11: [
      {
        years: "1999 - 2001",
        club: "Malmö FF",
        clubLogo: "🇸🇪",
        title: "The Audition",
        highlights: ["Famous response to Wenger: 'Zlatan doesn't do auditions'", "Promoted Malmö back to Swedish top flight", "Acquired by Ajax for record transfer fee"]
      },
      {
        years: "2001 - 2004",
        club: "Ajax Amsterdam",
        clubLogo: "🔴",
        title: "Total Footwork Magic",
        highlights: ["Won 2x Eredivisie championships", "Scored famous solo goal vs NAC Breda (dribbled 5 players)", "Cemented his name on European stage"]
      },
      {
        years: "2004 - 2009",
        club: "Juventus & Inter Milan",
        clubLogo: "🇮🇹",
        title: "Serie A Tyranny",
        highlights: ["Won 3 consecutive Serie A Scudetti with Inter Milan", "Crowned Capocannoniere top scorer (25 goals)", "Known for acrobatic bicycle kick headers"]
      },
      {
        years: "2012 - 2016",
        club: "Paris Saint-Germain",
        clubLogo: "🗼",
        title: "King of Paris",
        highlights: ["Won 4 consecutive Ligue 1 titles", "PSG's all-time top scorer at the time", "Stated: 'I came like a king, left like a legend'"]
      },
      {
        years: "2018 - 2023",
        club: "LA Galaxy & Milan Return",
        clubLogo: "🔴",
        title: "Eternal Gladiator Sunset",
        highlights: ["Stunned MLS with overhead 40-yard goals", "Returned to AC Milan aged 38", "Won Serie A title at age 40 (2022) to fulfill his promise"]
      }
    ],
    p33: [
      {
        years: "2018 - 2020",
        club: "São Paulo FC",
        clubLogo: "🇧🇷",
        title: "Cotia Academy Graduate",
        highlights: ["Won Copa São Paulo de Futebol Júnior (2019)", "Promoted directly to senior first-team", "Gained reputation for unmatched speed-dribble flair"]
      },
      {
        years: "2020 - 2022",
        club: "Ajax Amsterdam",
        clubLogo: "⚪🔴",
        title: "The Dutch Spin Craze",
        highlights: ["Won 2x Eredivisie Titles & KNVB Cup", "Formed telepathic bonding under manager Erik ten Hag", "Scored crucial Champions League goals"]
      },
      {
        years: "2022 - Present",
        club: "Manchester United",
        clubLogo: "🔴",
        title: "The Red Devil Showstopper",
        highlights: ["Scored in his first 3 consecutive PL matches (club record)", "Unleashed the legendary 360° Spin on live television", "Defies normal physics through sheer charisma and swagger"]
      }
    ],
    p34: [
      {
        years: "2011 - 2017",
        club: "Sheffield United & Hull",
        clubLogo: "🔴",
        title: "The Iron Grit Apprenticeship",
        highlights: ["3x Sheffield Utd Player of the Year", "Earned reputation as an unshakeable traditional center-back", "Secured promotion to the Premier League with Hull City"]
      },
      {
        years: "2017 - 2019",
        club: "Leicester City",
        clubLogo: "🔵",
        title: "Leicester Command & England Heroics",
        highlights: ["Leicester City Player of the Year (2018)", "Scored iconic header vs Sweden in World Cup 2018 🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Dubbed 'Slabhead' by teammates and fans"]
      },
      {
        years: "2019 - Present",
        club: "Manchester United",
        clubLogo: "🔴",
        title: "The Capitano Shield",
        highlights: ["Joined as world-record defender transfer fee", "Captained Manchester United to EFL Cup trophy", "Solely sustained the English football meme and media economy"]
      }
    ]
  };

  const selectedCustom = customTimelines[p.id];
  if (selectedCustom) return selectedCustom;

  // Real-time procedural high quality fallback generator
  const isLegend = p.era === 'Legend';
  return [
    {
      years: isLegend ? "Early Career Base" : "2018 - 2021",
      club: isLegend ? `${p.nation} Academy` : `${p.club} Development`,
      clubLogo: isLegend ? p.nationFlag : '⚽',
      title: "Youth Roots & Professional Breakthrough",
      highlights: [
        `Honed legendary technical prowess as a ${p.position}`,
        `Spotted by scouts for elite ${p.playstyle} capabilities`,
        `Emerged from ${p.nation} youth ranks with spectacular ratings`
      ]
    },
    {
      years: isLegend ? "Prime Career Gold" : "2021 - 2024",
      club: p.club,
      clubLogo: p.clubLogo,
      title: "Mainstage Expansion & Tactical Maturity",
      highlights: [
        `Transferred to ${p.club} as core tactician`,
        `Excelled in high-stakes matches with unmatched defensive/offensive balance`,
        `Reached an impressive stadium rating metric of ${p.rating}`
      ]
    },
    {
      years: "Present Era",
      club: isLegend ? "Hall of Fame Legends" : p.club,
      clubLogo: isLegend ? "👑" : p.clubLogo,
      title: isLegend ? "Immortal Hall of Fame Icon" : "World-Class Stadium Mastery",
      highlights: [
        `Maintains a glorious football swagger aura of ${p.auraRating}%`,
        `Achieved highlights: ${p.achievements?.join(" • ") || "Senior Championship medals"}`,
        `Acknowledged globally in Dream XI Labs as highly elite tier asset`
      ]
    }
  ];
};

export default function LegendsDatabase({}: LegendsDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [posFilter, setPosFilter] = useState('ALL');
  const [eraFilter, setEraFilter] = useState('ALL');
  const [rarityFilter, setRarityFilter] = useState('ALL');

  // Shared sidebar entities
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(PLAYERS_DB[0]);
  const [sidebarTab, setSidebarTab] = useState<'timeline' | 'compare'>('timeline');

  // Compare panel states
  const [compareA, setCompareA] = useState<Player | null>(null);
  const [compareB, setCompareB] = useState<Player | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const selectForComparison = (player: Player) => {
    playFutSound('click');
    if (!compareA) {
      setCompareA(player);
    } else if (!compareB && compareA.id !== player.id) {
      setCompareB(player);
      setShowComparison(true);
      setSidebarTab('compare');
    } else {
      setCompareA(player);
      setCompareB(null);
      setSidebarTab('compare');
    }
  };

  const handleCardClick = (player: Player) => {
    playFutSound('click');
    setSelectedPlayer(player);
  };

  const clearCompare = () => {
    playFutSound('click');
    setCompareA(null);
    setCompareB(null);
    setShowComparison(false);
  };

  const filteredPlayers = PLAYERS_DB.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term) || p.club.toLowerCase().includes(term) || p.nation.toLowerCase().includes(term);
    
    let posMatch = true;
    if (posFilter !== 'ALL') {
      if (posFilter === 'DEF') posMatch = ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position);
      else if (posFilter === 'MID') posMatch = ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.position);
      else if (posFilter === 'ST') posMatch = ['ST', 'CF', 'LW', 'RW'].includes(p.position);
      else posMatch = p.position === posFilter;
    }

    const eraMatch = eraFilter === 'ALL' || p.era === eraFilter;
    const rarityMatch = rarityFilter === 'ALL' || p.cardType === rarityFilter;

    return nameMatch && posMatch && eraMatch && rarityMatch;
  });

  // Comparisons stats list renderer
  const renderCompareStatsRow = (label: string, statKey: keyof Player['stats']) => {
    if (!compareA || !compareB) return null;
    const valA = compareA.stats[statKey];
    const valB = compareB.stats[statKey];
    
    const diff = valA - valB;
    const winA = diff > 0;
    const winB = diff < 0;

    return (
      <div className="flex flex-col gap-1.5 py-3 border-b border-white/5 last:border-0 font-mono text-[11px] select-none">
        <div className="flex justify-between items-baseline text-[10px] text-gray-400 font-bold uppercase tracking-wider select-none">
          <span className={winA ? 'text-emerald-400 font-black' : ''}>
            {valA} {winA && '★'}
          </span>
          <span className="text-gray-500 tracking-normal font-medium">{label}</span>
          <span className={winB ? 'text-emerald-400 font-black' : ''}>
            {winB && '★'} {valB}
          </span>
        </div>
        
        {/* Opposing double bar metrics */}
        <div className="flex gap-2 items-center w-full">
          {/* Bar A */}
          <div className="flex-1 bg-slate-800/80 rounded-full h-1.5 flex justify-end overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${winA ? 'bg-[#10b981]' : 'bg-slate-600'}`}
              style={{ width: `${valA}%` }}
            />
          </div>
          {/* Bar B */}
          <div className="flex-1 bg-slate-800/80 rounded-full h-1.5 flex overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${winB ? 'bg-[#10b981]' : 'bg-slate-600'}`}
              style={{ width: `${valB}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const timelineSteps = getPlayerTimeline(selectedPlayer);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 select-none">
      
      {/* Search Header toolbar */}
      <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl shadow-xl backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 select-none leading-none">
        
        <div className="flex items-center gap-3">
          <span className="text-gray-400 font-black text-xs uppercase tracking-wider select-none">PREFILTERS:</span>
          <div className="flex flex-wrap gap-2">
            
            {/* Search terms */}
            <div className="relative font-mono text-xs">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Star or Icon..."
                className="pl-8 pr-3 py-1.5 bg-black border border-white/10 text-white rounded-lg focus:outline-none focus:border-yellow-400 text-xs font-bold leading-none shrink-0"
              />
            </div>

            {/* Position filter */}
            <select
              value={posFilter}
              onChange={(e) => { playFutSound('click'); setPosFilter(e.target.value); }}
              className="bg-black border border-white/10 text-white text-[11px] p-1.5 rounded-lg focus:outline-none font-mono"
            >
              <option value="ALL">ALL POSITIONS</option>
              <option value="ST">STRIKERS / FORWARDS</option>
              <option value="MID">MIDFIELDERS</option>
              <option value="DEF">DEFENDERS</option>
              <option value="GK">GOALKEEPERS</option>
            </select>

            {/* Era filter */}
            <select
              value={eraFilter}
              onChange={(e) => { playFutSound('click'); setEraFilter(e.target.value); }}
              className="bg-black border border-white/10 text-white text-[11px] p-1.5 rounded-lg focus:outline-none font-mono"
            >
              <option value="ALL">ALL ERAS</option>
              <option value="Current">CURRENT PRO STARS</option>
              <option value="Legend">LEGENDS / ICONS</option>
            </select>
          </div>
        </div>

        {/* Counter count badges */}
        <div className="text-right font-mono text-xs text-slate-400">
          Showing <strong className="text-white">{filteredPlayers.length}</strong> star assets inside stadium index.
        </div>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Search Results list (Col 1) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          
          {/* Active Pick compare status block if chosen */}
          {(compareA || compareB) && !showComparison && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/25 p-4 rounded-xl flex items-center justify-between gap-4 mb-2 animate-pulse font-sans">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-yellow-400" />
                <span className="text-xs text-slate-200">
                  Compare selected: <b>{compareA?.name || '---'}</b> versus <b>{compareB?.name || '(Select next player below)'}</b>
                </span>
              </div>
              <button
                onClick={clearCompare}
                className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg hover:border-red-400 transition"
              >
                Reset
              </button>
            </div>
          )}

          {/* Quick instructions indicator */}
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5 pl-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
            <span>Click any card to load deep-dive timeline. Use "+ Compare Badge" to draft comparison.</span>
          </div>

          <div className="flex flex-wrap gap-4 justify-center py-2">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 w-full bg-slate-900/40 rounded-2xl border border-white/5">
                <ShieldAlert className="w-8 h-8 text-yellow-500/80 mx-auto mb-2 animate-pulse" />
                No match targets discovered with selected parameters.
              </div>
            ) : (
              filteredPlayers.map(player => {
                const isSelectedForCompare = compareA?.id === player.id || compareB?.id === player.id;
                const isDeepDiveActive = selectedPlayer.id === player.id;
                return (
                  <div key={player.id} className="relative group hover:z-10">
                    <HolographicCard
                      player={player}
                      onClick={() => handleCardClick(player)}
                    />
                    
                    {/* Floating check box or click trigger help overlays */}
                    <div
                      className="absolute top-2 left-2 bg-slate-950/90 border border-white/10 hover:border-yellow-400 hover:text-white text-[8px] font-black px-2 py-1.5 rounded leading-none text-yellow-400 uppercase tracking-wider cursor-pointer z-20 opacity-0 group-hover:opacity-100 transition shadow"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectForComparison(player);
                      }}
                    >
                      ⚔️ Compare
                    </div>

                    {/* Timeline active selected indicator */}
                    {isDeepDiveActive && (
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest z-20 shadow-[0_0_10px_#facc15]">
                        Active Deep-Dive
                      </div>
                    )}

                    {/* Marked as Selected for comparison indicator overlay */}
                    {isSelectedForCompare && (
                      <div className="absolute inset-0 bg-yellow-400/10 border-2 border-yellow-400 rounded-xl flex items-center justify-center p-3 text-center pointer-events-none select-none z-10">
                        <span className="bg-black/95 border border-yellow-500/30 text-yellow-400 font-sans font-black text-[9px] px-2.5 py-1.5 rounded-xl uppercase tracking-widest shadow-md">
                          Slot Assigned
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SIDEBAR DETAILED ANALYSIS & TIMELINE PANEL (Col 2) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl shadow-xl backdrop-blur flex flex-col min-h-[500px]">
            
            {/* Elegant Sidebar Navigation Tab Headers */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-4 font-mono text-[10px]">
              <button
                onClick={() => { playFutSound('click'); setSidebarTab('timeline'); }}
                className={`flex-1 py-2 rounded-lg font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  sidebarTab === 'timeline'
                    ? 'bg-slate-800 text-yellow-400 border border-yellow-400/20 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📅 Career Timeline
              </button>
              <button
                onClick={() => { playFutSound('click'); setSidebarTab('compare'); }}
                className={`flex-1 py-2 rounded-lg font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  sidebarTab === 'compare'
                    ? 'bg-slate-800 text-yellow-400 border border-yellow-400/20 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🆚 Stats Compare
              </button>
            </div>

            {sidebarTab === 'timeline' ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPlayer.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-4"
                >
                  {/* Selected Player Hero Profile Mini Card */}
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center border border-white/10 overflow-hidden relative shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${selectedPlayer.avatarSeed}`}
                        alt={selectedPlayer.name}
                        className="w-10 h-10 object-cover mt-1"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="text-yellow-400 font-extrabold text-[11px] font-mono">{selectedPlayer.rating} OVR</span>
                        <span className="text-[9px] text-gray-400">• {selectedPlayer.position}</span>
                      </div>
                      <h2 className="text-sm font-black text-white truncate uppercase font-sans tracking-tight mt-0.5">{selectedPlayer.name}</h2>
                      <p className="text-[10px] text-gray-500 font-mono truncate mt-0.5">{selectedPlayer.clubLogo} {selectedPlayer.club} • {selectedPlayer.nation}</p>
                    </div>
                  </div>

                  {/* Add to Compare faceoff shortcut action */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        playFutSound('click');
                        if (!compareA) {
                          setCompareA(selectedPlayer);
                          setSidebarTab('compare');
                        } else if (!compareB && compareA.id !== selectedPlayer.id) {
                          setCompareB(selectedPlayer);
                          setShowComparison(true);
                          setSidebarTab('compare');
                        } else {
                          setCompareA(selectedPlayer);
                          setCompareB(null);
                          setSidebarTab('compare');
                        }
                      }}
                      className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      Add to Comparison Slot
                    </button>
                  </div>

                  {/* Vertical Timeline Track Title */}
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold font-mono flex items-center gap-1.5 border-b border-white/5 pb-2 mb-1 mt-1">
                    <Activity className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                    <span>Club Career Timeline</span>
                  </div>

                  {/* Vertical scroll list of timeline elements */}
                  <div className="relative pl-3 flex flex-col gap-4 border-l border-white/10 max-h-[440px] overflow-y-auto pr-1">
                    {timelineSteps.map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="relative group/step"
                      >
                        {/* Timeline Connector Dot Node */}
                        <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-[#030712] border-2 border-yellow-400 flex items-center justify-center text-[8px] shadow-md group-hover/step:bg-yellow-400 transition duration-150">
                          <span className="scale-60">{step.clubLogo}</span>
                        </div>

                        <div className="bg-black/40 border border-white/5 rounded-xl p-3 hover:border-white/10 transition leading-normal">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[9px] font-black text-yellow-400 font-mono tracking-widest bg-yellow-400/10 px-1.5 py-0.5 rounded leading-none">
                              {step.years}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-white text-[11px] mb-1.5 uppercase font-sans tracking-tight">
                            {step.title}
                          </h3>

                          <ul className="flex flex-col gap-1 list-none pl-0 leading-relaxed text-[10px] text-slate-300 font-mono">
                            {step.highlights.map((light, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-1">
                                <span className="text-yellow-500 shrink-0 select-none">🏆</span>
                                <span>{light}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>
            ) : (
              /* COMPARISON VIEW TAB */
              compareA && compareB && showComparison ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col"
                  >
                    {/* Side-by-Side mini header cards */}
                    <div className="flex justify-between items-center py-4 bg-black/40 border border-white/5 rounded-xl p-3 mb-4 select-none">
                      <div className="text-center font-sans w-5/12">
                        <div className="text-xs font-black text-white truncate">{compareA.name}</div>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] text-yellow-400 mt-1 inline-block font-mono uppercase font-black uppercase">
                          {compareA.cardType}
                        </span>
                      </div>

                      <div className="text-center text-yellow-500 font-sans font-bold italic w-2/12 select-none">
                        VS
                      </div>

                      <div className="text-center font-sans w-5/12">
                        <div className="text-xs font-black text-white truncate">{compareB.name}</div>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] text-yellow-400 mt-1 inline-block font-mono uppercase font-black uppercase">
                          {compareB.cardType}
                        </span>
                      </div>
                    </div>

                    {/* Comparisons stats listings */}
                    <div className="flex flex-col mb-4">
                      {renderCompareStatsRow('Pace (PAC)', 'pac')}
                      {renderCompareStatsRow('Shooting (SHO)', 'sho')}
                      {renderCompareStatsRow('Passing (PAS)', 'pas')}
                      {renderCompareStatsRow('Dribbling (DRI)', 'dri')}
                      {renderCompareStatsRow('Defending (DEF)', 'def')}
                      {renderCompareStatsRow('Physical (PHY)', 'phy')}
                    </div>

                    {/* Aura side-by-side spec list card */}
                    <div className="bg-gradient-to-r from-emerald-950/10 to-teal-950/10 border border-emerald-500/10 p-4 rounded-xl font-mono mb-4 text-center select-none">
                      <label className="text-[9px] text-gray-400 uppercase tracking-widest block mb-2 font-mono font-bold">
                        🔥 STADIUM AURA INDEX MATCH
                      </label>
                      <div className="flex justify-between items-baseline select-none text-[11px]">
                        <span className={`font-black ${compareA.auraRating > compareB.auraRating ? 'text-emerald-400' : 'text-gray-300'}`}>
                          {compareA.auraRating}%
                        </span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-wider font-light">swagger score</span>
                        <span className={`font-black ${compareB.auraRating > compareA.auraRating ? 'text-emerald-400' : 'text-gray-300'}`}>
                          {compareB.auraRating}%
                        </span>
                      </div>
                    </div>

                    {/* Trophy cabinet highlights */}
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2 font-sans select-none">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold block mb-2">
                        🏆 HISTORIC CABINETS:
                      </span>
                      <div className="grid grid-cols-2 gap-3 leading-relaxed text-[10px] text-gray-300 font-mono">
                        <div>
                          <span className="text-slate-400 font-sans font-bold uppercase tracking-wider block border-b border-white/5 pb-1 mb-1 text-[9px]">@{compareA.name.split(' ')[0]}</span>
                          <ul className="flex flex-col gap-1 list-none pl-0">
                            {compareA.achievements?.slice(0, 2).map((ach, idx) => (
                              <li key={idx}>🏆 {ach}</li>
                            )) || <li>None registered</li>}
                          </ul>
                        </div>
                        <div>
                          <span className="text-slate-400 font-sans font-bold uppercase tracking-wider block border-b border-white/5 pb-1 mb-1 text-[9px]">@{compareB.name.split(' ')[0]}</span>
                          <ul className="flex flex-col gap-1 list-none pl-0">
                            {compareB.achievements?.slice(0, 2).map((ach, idx) => (
                              <li key={idx}>🏆 {ach}</li>
                            )) || <li>None registered</li>}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={clearCompare}
                      className="w-full mt-5 py-3 border border-red-500/20 text-red-400 bg-slate-900 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-slate-800 transition cursor-pointer"
                    >
                      Clear Comparison
                    </button>

                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono flex flex-col items-center">
                  <Scale className="w-8 h-8 text-slate-700 mb-2 rotate-12 animate-pulse" />
                  <p className="leading-relaxed mb-4">
                    Select any <b>two player cards</b> in the left database grid using the <b>⚔️ Compare</b> button to load comparative benchmark graphs.
                  </p>
                  {compareA && !compareB && (
                    <div className="bg-black/30 text-emerald-400 border border-emerald-400/10 rounded-xl p-3 text-[10px] text-left w-full">
                      <b>Slot A Assigned:</b> {compareA.name} <br/>
                      Click <b>⚔️ Compare</b> on another card on the left to complete your match-up faceoff!
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
