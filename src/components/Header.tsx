import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, Swords, Compass, BellRing, Bot } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playRickshawBell } from '../utils/audio';

interface HeaderProps {
  activeTab: 'decoder' | 'bossfight' | 'chatbot' | 'guide';
  setActiveTab: (tab: 'decoder' | 'bossfight' | 'chatbot' | 'guide') => void;
  bossScore?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, bossScore }) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      playRickshawBell();
    }
  };

  const handleRickshawClick = () => {
    playRickshawBell();
  };

  return (
    <header className="relative bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 text-white border-b-4 border-amber-400 shadow-xl overflow-hidden">
      {/* Dhaka Rickshaw Border Motif */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_12px,#ef4444_12px,#ef4444_24px,#10b981_24px,#10b981_36px)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Persona Badge */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleRickshawClick} title="Click to ring Rickshaw bell!">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 flex items-center justify-center text-3xl shadow-lg border-2 border-amber-300 transform group-hover:rotate-6 transition-transform">
                🏠
              </div>
              <span className="absolute -bottom-1 -right-1 text-base">🇧🇩</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-300 drop-shadow">
                  বাসা খুঁজি AI <span className="text-white text-lg font-normal">/ Basa Khuji</span>
                </h1>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                  Dhaka Veteran
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                10-Year Bachelor Mess Survivor • Anti-Bariwala Lie Decoder • Boss Fight 🥊
              </p>
            </div>
          </div>

          {/* Action Tabs & Sound Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {/* Rickshaw Bell Button */}
            <button
              onClick={handleRickshawClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-semibold transition active:scale-95"
              title="Ring Dhaka Rickshaw Bell"
            >
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
              <span>Tring-Tring!</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg border text-xs font-semibold transition ${
                soundOn
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/40'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
              }`}
              title={soundOn ? 'Sound is ON (Click to mute)' : 'Sound is MUTED (Click to enable)'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Mode Switcher Buttons */}
            <nav className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  setActiveTab('decoder');
                  playRickshawBell();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'decoder'
                    ? 'bg-amber-400 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>To-Let Decoder</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('bossfight');
                  playRickshawBell();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition relative ${
                  activeTab === 'bossfight'
                    ? 'bg-red-600 text-white shadow-md font-extrabold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Bariwala Boss Fight</span>
                {bossScore !== undefined && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/60 text-amber-300 border border-amber-400/30">
                    {bossScore}%
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('chatbot');
                  playRickshawBell();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'chatbot'
                    ? 'bg-emerald-400 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Veteran Chatbot</span>
                <span className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-black/40 text-emerald-200">
                  Maps & Search
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('guide');
                  playRickshawBell();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'guide'
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Dhaka Guide & Tax</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
