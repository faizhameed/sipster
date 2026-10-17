import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { MASCOTS, type Mascot } from '../utils/mascots';
import { playMascotGiggle } from '../utils/audio';

interface KidsMascotCompanionProps {
  currentMascotId: string;
  onSelectMascot: (id: string) => void;
  percentage: number;
  isSipping: boolean;
  soundEnabled: boolean;
}

export const KidsMascotCompanion: React.FC<KidsMascotCompanionProps> = ({
  currentMascotId,
  onSelectMascot,
  percentage,
  isSipping,
  soundEnabled,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);
  const mascot: Mascot = MASCOTS.find((m) => m.id === currentMascotId) || MASCOTS[0];

  const getMascotMood = () => {
    if (isSipping) return { text: mascot.sippingMessage, mood: 'drinking' };
    if (percentage >= 100) return { text: mascot.goalMessage, mood: 'super-happy' };
    if (percentage >= 50) return { text: mascot.happyMessage, mood: 'happy' };
    return { text: mascot.thirstyMessage, mood: 'thirsty' };
  };

  const { text, mood } = getMascotMood();

  const handleMascotClick = () => {
    setIsWiggling(true);
    if (soundEnabled) {
      playMascotGiggle();
    }
    setTimeout(() => setIsWiggling(false), 800);
  };

  const cycleNextMascot = () => {
    const currentIndex = MASCOTS.findIndex((m) => m.id === mascot.id);
    const nextIndex = (currentIndex + 1) % MASCOTS.length;
    onSelectMascot(MASCOTS[nextIndex].id);
    if (soundEnabled) {
      playMascotGiggle();
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-3.5 mb-3 border border-sky-400/25 relative overflow-hidden shadow-xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 backdrop-blur-xl">
      {/* Decorative stars/bubbles in background */}
      <div className="absolute top-1 right-3 text-sky-400/20 text-xs pointer-events-none">✨ 🫧</div>

      <div className="flex items-center gap-3">
        {/* Animated mascot avatar */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={handleMascotClick}
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mascot.color} flex items-center justify-center text-3xl shadow-lg border-2 border-white/20 cursor-pointer select-none transition-transform active:scale-90 ${
              isWiggling || isSipping ? 'animate-bounce scale-110' : 'hover:scale-105'
            }`}
            title="Tap me to tickle!"
          >
            <span className="drop-shadow-md select-none transform transition-transform duration-300">
              {mascot.avatar}
            </span>
          </button>

          {/* Level / Mood Badge */}
          <span className="absolute -bottom-1 -right-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-slate-950 text-white border border-white/20 shadow">
            {mood === 'super-happy' ? '🏆' : mood === 'drinking' ? '🥤' : mood === 'happy' ? '⚡️' : '🥺'}
          </span>
        </div>

        {/* Mascot speech bubble */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs font-black text-white tracking-wide">{mascot.name}</span>
              <span className="text-[10px] text-slate-400 font-medium truncate">({mascot.species})</span>
            </div>

            {/* Quick change mascot button */}
            <button
              onClick={cycleNextMascot}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-sky-300 border border-white/10 transition active:scale-95 cursor-pointer shrink-0"
              title="Change mascot companion"
            >
              <RefreshCw size={10} className="text-sky-400" />
              <span>Switch</span>
            </button>
          </div>

          {/* Dialogue balloon */}
          <div
            onClick={handleMascotClick}
            className="p-2 rounded-xl bg-slate-950/70 border border-sky-500/20 text-xs text-sky-100 font-medium leading-relaxed relative cursor-pointer hover:border-sky-500/40 transition select-none shadow-inner"
          >
            <p className="line-clamp-2 text-[11px] sm:text-xs">
              {text}
            </p>
          </div>
        </div>
      </div>

      {/* Mascot picker tray */}
      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles size={11} className="text-amber-400" />
          Choose your drinking buddy:
        </span>

        <div className="flex items-center gap-1.5">
          {MASCOTS.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                onSelectMascot(m.id);
                if (soundEnabled) playMascotGiggle();
              }}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm transition-all cursor-pointer ${
                m.id === mascot.id
                  ? 'bg-sky-500 scale-110 shadow-md shadow-sky-500/30 ring-2 ring-white/30'
                  : 'bg-slate-800/80 hover:bg-slate-700 opacity-60 hover:opacity-100'
              }`}
              title={m.name}
            >
              {m.avatar}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
