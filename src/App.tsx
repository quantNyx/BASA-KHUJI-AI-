import React, { useState } from 'react';
import { Header } from './components/Header';
import { ToLetDecoder } from './components/ToLetDecoder';
import { RealityReport } from './components/RealityReport';
import { BossFight } from './components/BossFight';
import { VeteranChatbot } from './components/VeteranChatbot';
import { DhakaSurvivalGuide } from './components/DhakaSurvivalGuide';
import { DhakaRealityReportData, BossPersona } from './types';
import { FAMOUS_DHAKA_BOSSES } from './presets';
import { generateDhakaRealityReport } from './utils/dhakaVeteranEngine';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'decoder' | 'bossfight' | 'chatbot' | 'guide'>('decoder');
  const [report, setReport] = useState<DhakaRealityReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Boss Fight Persona
  const [activeBoss, setActiveBoss] = useState<BossPersona>(FAMOUS_DHAKA_BOSSES[0]);
  const [currentBossScore, setCurrentBossScore] = useState<number>(FAMOUS_DHAKA_BOSSES[0].initialApproval);

  const handleAnalyze = async (text: string, imageBase64: string | null, areaHint?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/decode-tolet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          image: imageBase64,
          areaHint,
        }),
      });

      const data = await response.json();
      if (!data.success || !data.report) {
        throw new Error(data.error || data.details || 'Failed to decode To-Let listing.');
      }

      setReport(data.report);

      // Pre-set boss fight with data from decoded report
      if (data.report.bossFight) {
        setActiveBoss(data.report.bossFight);
        setCurrentBossScore(data.report.bossFight.initialApproval);
      }
    } catch (err: any) {
      console.warn('Backend unavailable, using client-side Dhaka veteran engine:', err);
      const fallbackReport = generateDhakaRealityReport(text || '', areaHint);
      setReport(fallbackReport);
      if (fallbackReport.bossFight) {
        setActiveBoss(fallbackReport.bossFight);
        setCurrentBossScore(fallbackReport.bossFight.initialApproval);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartBossFight = (bossFightData: BossPersona) => {
    setActiveBoss(bossFightData);
    setCurrentBossScore(bossFightData.initialApproval);
    setActiveTab('bossfight');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      {/* Rickshaw Art Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bossScore={currentBossScore}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 bg-red-950 border-2 border-red-500 rounded-2xl text-red-200 flex items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-bold shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MODE 1: THE TO-LET DECODER */}
        {activeTab === 'decoder' && (
          <div className="space-y-8">
            <ToLetDecoder onAnalyze={handleAnalyze} isLoading={isLoading} />

            {report && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Latest Decoded Report:
                  </span>
                  <button
                    onClick={() => {
                      setReport(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Decode Another Sign
                  </button>
                </div>
                <RealityReport
                  report={report}
                  onStartBossFight={handleStartBossFight}
                />
              </div>
            )}
          </div>
        )}

        {/* MODE 2: THE BARIWALA BOSS FIGHT ROLEPLAY */}
        {activeTab === 'bossfight' && (
          <div className="space-y-4">
            <BossFight
              initialBoss={activeBoss}
              phoneAlibiScript={report?.phoneAlibiScript}
              onScoreUpdate={(newScore) => setCurrentBossScore(newScore)}
            />
          </div>
        )}

        {/* GEMINI CHATBOT: VETERAN ADVISOR WITH GOOGLE MAPS & SEARCH */}
        {activeTab === 'chatbot' && (
          <div>
            <VeteranChatbot />
          </div>
        )}

        {/* DHAKA SURVIVAL GUIDE & TAX CALCULATOR */}
        {activeTab === 'guide' && (
          <div>
            <DhakaSurvivalGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-zinc-400">
            বাসা খুঁজি AI (Basa Khuji AI) 🏠🇧🇩 • Dedicated to every Dhaka bachelor student & job seeker surviving WASA water and 10 PM gates
          </p>
          <p className="text-[11px] text-zinc-600">
            Powered by 10-Year Mess Veteran Street Wisdom & Google Gemini AI • Mirpur • Mohammadpur • Farmgate • Badda • Uttara
          </p>
        </div>
      </footer>
    </div>
  );
}
