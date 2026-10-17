import React from 'react';
import { Droplets, Sparkles } from 'lucide-react';
import { MASCOTS } from '../utils/mascots';

interface CircularWaterVisualProps {
  percentage: number;
  currentAmount: number;
  goalAmount: number;
  onQuickDrink: () => void;
  quickAmount: number;
  currentMascotId?: string;
  isSipping?: boolean;
}

export const CircularWaterVisual: React.FC<CircularWaterVisualProps> = ({
  percentage,
  currentAmount,
  goalAmount,
  onQuickDrink,
  quickAmount,
  currentMascotId,
  isSipping,
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const isGoalReached = currentAmount >= goalAmount;
  const mascot = MASCOTS.find((m) => m.id === currentMascotId) || MASCOTS[0];

  return (
    <div className="relative flex flex-col items-center justify-center my-2">
      {/* Outer ambient glow */}
      <div 
        className="absolute w-72 h-72 rounded-full transition-all duration-700 opacity-40 blur-2xl"
        style={{
          background: isGoalReached 
            ? 'radial-gradient(circle, rgba(56,189,248,0.5) 0%, rgba(14,165,233,0) 70%)'
            : 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(3,105,161,0) 70%)'
        }}
      />

      {/* Main interactive circular water vessel */}
      <div
        onClick={onQuickDrink}
        role="button"
        tabIndex={0}
        aria-label={`Log ${quickAmount}ml water`}
        className="group relative w-60 h-60 sm:w-64 sm:h-64 rounded-full p-2.5 bg-gradient-to-b from-slate-800/80 to-slate-900/90 shadow-2xl border-2 border-sky-500/20 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-md select-none"
      >
        {/* Inner container with clipping */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-950/70 border border-white/5 flex items-center justify-center">
          
          {/* Animated Water Level fill */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
            style={{ height: `${clampedPercentage}%` }}
          >
            {/* Top wavy SVG line */}
            {clampedPercentage > 0 && (
              <div className="absolute -top-3 left-0 w-[200%] h-6 flex overflow-hidden pointer-events-none">
                <svg
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                  className="w-[200%] h-full text-sky-400 fill-current opacity-70 animate-wave-fast"
                >
                  <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z" />
                </svg>
              </div>
            )}

            {/* Water body gradient */}
            <div className="w-full h-full bg-gradient-to-t from-sky-600 to-sky-400 opacity-90 relative">
              {/* Floating micro bubbles */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent_60%)] pointer-events-none" />
            </div>
          </div>

          {/* Floating Mascot Head inside Water Bubble */}
          <div 
            className={`absolute z-10 transition-all duration-500 flex flex-col items-center pointer-events-none select-none ${
              isSipping ? 'scale-125 animate-bounce' : 'animate-pulse'
            }`}
            style={{
              bottom: `${Math.max(16, Math.min(68, clampedPercentage - 8))}%`,
              transition: 'bottom 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="text-3xl filter drop-shadow-lg transform transition-transform">
              {mascot.avatar}
            </div>
          </div>

          {/* Central metrics content */}
          <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none text-center mt-6">
            {isGoalReached ? (
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[11px] font-bold mb-1 backdrop-blur-sm border border-emerald-500/40 shadow-sm">
                <Sparkles size={12} className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Super Hydrated!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-0.5 drop-shadow">
                <Droplets size={12} />
                <span>Hydrated</span>
              </div>
            )}

            <div className="flex items-baseline justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                {currentAmount}
              </span>
              <span className="text-[11px] text-sky-200/80 font-medium ml-1">/ {goalAmount}ml</span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-sky-300 drop-shadow">
              {Math.round(clampedPercentage)}%
            </div>

            <div className="mt-1 text-[10px] sm:text-[11px] font-medium text-slate-300 group-hover:text-sky-300 transition-colors flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-full border border-white/5">
              <span>Tap to drink +{quickAmount}ml</span>
            </div>
          </div>

          {/* Glass reflection highlight on top-left of circle */}
          <div className="absolute top-2 left-6 w-20 h-8 rounded-full bg-white/10 blur-[1px] transform -rotate-25 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
