import React, { useState } from 'react';
import { GlassWater, Coffee, CupSoda, Plus } from 'lucide-react';

interface QuickIntakeButtonsProps {
  onAdd: (amount: number) => void;
  defaultQuickAmount: number;
}

const PRESET_PORTIONS = [
  { label: 'Sip', amount: 150, icon: GlassWater, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20' },
  { label: 'Glass', amount: 250, icon: GlassWater, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' },
  { label: 'Mug', amount: 350, icon: Coffee, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20' },
  { label: 'Bottle', amount: 500, icon: CupSoda, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20' },
];

export const QuickIntakeButtons: React.FC<QuickIntakeButtonsProps> = ({ onAdd }) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customValue, setCustomValue] = useState('200');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customValue, 10);
    if (!isNaN(val) && val > 0) {
      onAdd(val);
      setShowCustomModal(false);
      setCustomValue('200');
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2.5">
        {PRESET_PORTIONS.map((portion) => {
          const Icon = portion.icon;
          return (
            <button
              key={portion.amount}
              onClick={() => onAdd(portion.amount)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer backdrop-blur-md shadow-sm ${portion.color}`}
            >
              <Icon size={22} className="mb-1" />
              <span className="text-xs font-semibold text-slate-200">+{portion.amount}</span>
              <span className="text-[10px] text-slate-400">{portion.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex justify-center">
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-full border border-slate-700/60 transition active:scale-95"
        >
          <Plus size={14} className="text-sky-400" />
          <span>Custom amount...</span>
        </button>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Custom Intake</h3>
            <p className="text-xs text-slate-400 mb-4">Enter amount in milliliters (ml)</p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  autoFocus
                  min="10"
                  max="3000"
                  step="10"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-sky-500 text-center"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                  ml
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/20 transition"
                >
                  Add Water
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
