import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  RotateCcw,
  Award,
  ChevronDown,
  UserCheck,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { BossPersona, ChatMessage, BossFightTurnResult } from '../types';
import { FAMOUS_DHAKA_BOSSES } from '../presets';
import { launchConfetti } from '../utils/confetti';
import { generateBossFightTurn } from '../utils/dhakaVeteranEngine';
import {
  playUncleBuzzer,
  playApprovalChime,
  playCallDisconnected,
  playVictoryFanfare,
  playRickshawBell,
} from '../utils/audio';

interface BossFightProps {
  initialBoss?: BossPersona;
  phoneAlibiScript?: string;
  onScoreUpdate?: (score: number) => void;
}

export const BossFight: React.FC<BossFightProps> = ({
  initialBoss,
  phoneAlibiScript,
  onScoreUpdate,
}) => {
  const defaultBoss = initialBoss || FAMOUS_DHAKA_BOSSES[0];

  const [currentBoss, setCurrentBoss] = useState<BossPersona>(defaultBoss);
  const [approvalScore, setApprovalScore] = useState<number>(defaultBoss.initialApproval);
  const [approvalMeter, setApprovalMeter] = useState<string>('🟥🟥⬜⬜⬜⬜⬜⬜⬜⬜');
  const [status, setStatus] = useState<string>('😠 Suspicious');
  const [userInput, setUserInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [callActive, setCallActive] = useState<boolean>(true);
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [showAlibiCheatSheet, setShowAlibiCheatSheet] = useState<boolean>(false);
  const [showWeaknessRadar, setShowWeaknessRadar] = useState<boolean>(true);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [lastCommentary, setLastCommentary] = useState<string>(
    'Tip: Greet Uncle with "Assalamu Alaikum", mention BCS 46th exam and early 9:30 PM sleep!'
  );
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>(
    defaultBoss.suggestedReplies || [
      'Assalamu Alaikum Uncle! Ami 46th BCS candidate, rat 9:30 tay ghumai!',
      'Uncle ami shudhu namaz pori ar pori, kono bondhu-bandhob nai Dhakay!',
      'Uncle 2 masher advance cash e dite raji achi, building er shanti nosto hobena!',
    ]
  );

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      role: 'uncle',
      text: defaultBoss.openingLine,
      timestamp: '00:01',
      moodEmoji: '👴🏾',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync when initialBoss changes
  useEffect(() => {
    if (initialBoss) {
      setCurrentBoss(initialBoss);
      setApprovalScore(initialBoss.initialApproval);
      setApprovalMeter(calcEmojiBar(initialBoss.initialApproval));
      setStatus('😠 Suspicious');
      setChatHistory([
        {
          id: 'msg-init',
          role: 'uncle',
          text: initialBoss.openingLine,
          timestamp: '00:01',
          moodEmoji: '👴🏾',
        },
      ]);
      setSuggestedReplies(initialBoss.suggestedReplies || []);
      setCallActive(true);
      setCallSeconds(0);
    }
  }, [initialBoss]);

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  function calcEmojiBar(score: number): string {
    const blocks = Math.round(Math.max(0, Math.min(100, score)) / 10);
    let bar = '';
    for (let i = 0; i < 10; i++) {
      if (i < blocks) {
        if (score >= 70) bar += '🟩';
        else if (score >= 40) bar += '🟨';
        else bar += '🟥';
      } else {
        bar += '⬜';
      }
    }
    return bar;
  }

  const handleSelectBoss = (boss: BossPersona) => {
    setCurrentBoss(boss);
    setApprovalScore(boss.initialApproval);
    setApprovalMeter(calcEmojiBar(boss.initialApproval));
    setStatus('😠 Suspicious');
    setCallActive(true);
    setCallSeconds(0);
    setChatHistory([
      {
        id: `msg-${Date.now()}`,
        role: 'uncle',
        text: boss.openingLine,
        timestamp: '00:01',
        moodEmoji: '👴🏾',
      },
    ]);
    setSuggestedReplies(boss.suggestedReplies || []);
    playRickshawBell();
  };

  const handleSendReply = async (textToSend?: string) => {
    const replyText = (textToSend || userInput).trim();
    if (!replyText || isSubmitting || !callActive) return;

    setUserInput('');
    setIsSubmitting(true);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: replyText,
      timestamp: formatCallTime(callSeconds),
    };

    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/boss-fight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bossName: currentBoss.bossName,
          bossTitle: currentBoss.bossTitle,
          currentApproval: approvalScore,
          chatHistory: chatHistory.map((m) => ({ role: m.role, text: m.text })),
          userReply: replyText,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to talk to Uncle');
      }

      const res: BossFightTurnResult = data.result;
      const newScore = res.newScore;
      const scoreChange = res.scoreChange;

      setApprovalScore(newScore);
      setApprovalMeter(res.approvalMeter || calcEmojiBar(newScore));
      setStatus(res.status);
      setLastCommentary(res.survivalCommentary);
      if (res.suggestedReplies && res.suggestedReplies.length > 0) {
        setSuggestedReplies(res.suggestedReplies);
      }

      if (onScoreUpdate) {
        onScoreUpdate(newScore);
      }

      // Play authentic sound reaction
      if (scoreChange > 0) {
        if (newScore >= 80) {
          playVictoryFanfare();
          launchConfetti();
          setHasWon(true);
        } else {
          playApprovalChime();
        }
      } else if (scoreChange < 0) {
        if (newScore <= 0 || res.status.includes('KICKED OUT')) {
          playCallDisconnected();
          setCallActive(false);
        } else {
          playUncleBuzzer();
        }
      }

      const uncleMsg: ChatMessage = {
        id: `uncle-${Date.now()}`,
        role: 'uncle',
        text: res.uncleDialogue,
        scoreChange: scoreChange,
        timestamp: formatCallTime(callSeconds),
        moodEmoji: res.uncleMoodEmoji || (newScore >= 80 ? '🎉' : newScore >= 50 ? '🤔' : '😠'),
      };

      setChatHistory((prev) => [...prev, uncleMsg]);

      if (newScore <= 0) {
        setCallActive(false);
      }
    } catch (err: any) {
      console.warn('Backend API unavailable, using client-side Dhaka veteran roleplay engine:', err);
      const res = generateBossFightTurn(currentBoss.bossName, approvalScore, replyText);
      const newScore = res.newScore;
      const scoreChange = res.scoreChange;

      setApprovalScore(newScore);
      setApprovalMeter(res.approvalMeter || calcEmojiBar(newScore));
      setStatus(res.status);
      setLastCommentary(res.survivalCommentary);
      if (res.suggestedReplies && res.suggestedReplies.length > 0) {
        setSuggestedReplies(res.suggestedReplies);
      }

      if (onScoreUpdate) {
        onScoreUpdate(newScore);
      }

      if (scoreChange > 0) {
        if (newScore >= 80) {
          playVictoryFanfare();
          launchConfetti();
          setHasWon(true);
        } else {
          playApprovalChime();
        }
      } else if (scoreChange < 0) {
        if (newScore <= 0 || res.status.includes('KICKED OUT')) {
          playCallDisconnected();
          setCallActive(false);
        } else {
          playUncleBuzzer();
        }
      }

      const uncleMsg: ChatMessage = {
        id: `uncle-fb-${Date.now()}`,
        role: 'uncle',
        text: res.uncleDialogue,
        scoreChange: scoreChange,
        timestamp: formatCallTime(callSeconds),
        moodEmoji: res.uncleMoodEmoji || (newScore >= 80 ? '🎉' : newScore >= 50 ? '🤔' : '😠'),
      };

      setChatHistory((prev) => [...prev, uncleMsg]);

      if (newScore <= 0) {
        setCallActive(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartCall = () => {
    setApprovalScore(currentBoss.initialApproval);
    setApprovalMeter(calcEmojiBar(currentBoss.initialApproval));
    setStatus('😠 Suspicious');
    setCallActive(true);
    setHasWon(false);
    setCallSeconds(0);
    setChatHistory([
      {
        id: `msg-${Date.now()}`,
        role: 'uncle',
        text: currentBoss.openingLine,
        timestamp: '00:01',
        moodEmoji: '👴🏾',
      },
    ]);
    setSuggestedReplies(currentBoss.suggestedReplies || []);
    playRickshawBell();
  };

  // Instant Win / Cheat Trigger
  const triggerInstantWin = () => {
    setApprovalScore(95);
    setApprovalMeter('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩');
    setStatus('🎉 CONVINCED! Come with NID photo & Character Certificate');
    setHasWon(true);
    playVictoryFanfare();
    launchConfetti();
    const winMsg: ChatMessage = {
      id: `uncle-win-${Date.now()}`,
      role: 'uncle',
      text: 'মাশাআল্লাহ! আপনি তো খাঁটি দ্বীনদার ও আদর্শ ছাত্র। আগামীকাল সকালেই ২ কপি পাসপোর্ট সাইজ ছবি আর জাতীয় পরিচয়পত্রের ফটোকপি নিয়ে আসেন। ফ্ল্যাটের চাবি আপনার জন্য রেডি!',
      scoreChange: 75,
      timestamp: formatCallTime(callSeconds),
      moodEmoji: '🎉',
    };
    setChatHistory((prev) => [...prev, winMsg]);
    if (onScoreUpdate) onScoreUpdate(95);
  };

  const isConvinced = approvalScore >= 80;
  const isKickedOut = (approvalScore <= 0 || !callActive) && !isConvinced;

  // Win probability calculation
  const winProbability = Math.min(100, Math.max(5, Math.round((approvalScore / 80) * 100)));

  return (
    <div className="space-y-6">
      {/* Boss Selector Bar */}
      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👴🏾</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Select Dhaka Landlord Boss Opponent:
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-400">
              Win Chance: <span className="text-emerald-400 font-black">{winProbability}%</span>
            </span>
            <button
              onClick={triggerInstantWin}
              className="text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 px-2.5 py-1 rounded-lg shadow hover:brightness-110 flex items-center gap-1 active:scale-95 transition"
              title="Trigger instant win to view certificate"
            >
              <Sparkles className="w-3 h-3 text-red-600" /> Instant Win Code
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FAMOUS_DHAKA_BOSSES.map((boss) => (
            <button
              key={boss.bossName}
              onClick={() => handleSelectBoss(boss)}
              className={`text-left p-3 rounded-xl border text-xs transition flex flex-col justify-between ${
                currentBoss.bossName === boss.bossName
                  ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow'
                  : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:border-zinc-500'
              }`}
            >
              <div>
                <div className="font-extrabold text-sm">{boss.bossName}</div>
                <div className="text-[11px] opacity-80 line-clamp-1">{boss.bossTitle}</div>
              </div>
              <div className="mt-2 text-[10px] uppercase font-bold opacity-75">
                Initial Approval: {boss.initialApproval}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Telephone Roleplay Interface */}
      <div className="relative bg-zinc-950 rounded-2xl border-4 border-amber-500 shadow-2xl overflow-hidden flex flex-col">
        {/* Telephone Call Top Bar */}
        <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-amber-950 p-4 border-b-2 border-amber-500/50 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-amber-400 flex items-center justify-center text-2xl shadow">
                👴🏾
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 ${
                  callActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {currentBoss.bossName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-zinc-300 border border-white/10">
                  {currentBoss.bossTitle}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <Phone className="w-3 h-3 animate-bounce" />
                  {callActive ? `Active Call (${formatCallTime(callSeconds)})` : 'Call Ended'}
                </span>
                <span>•</span>
                <span className="text-amber-200 font-semibold">{status}</span>
              </div>
            </div>
          </div>

          {/* Live Approval Meter & Score Header */}
          <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-xl border border-white/10">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 text-right">
                Uncle Approval Meter
              </div>
              <div className="text-xs font-mono tracking-widest text-center mt-0.5">
                {approvalMeter}
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-2xl font-black ${
                  approvalScore >= 70
                    ? 'text-emerald-400'
                    : approvalScore >= 40
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {approvalScore}
              </span>
              <span className="text-xs text-zinc-400">/100</span>
            </div>
          </div>
        </div>

        {/* Scoring Rules & Weakness Radar Toggle */}
        <div className="bg-zinc-900/90 px-4 py-2 border-b border-zinc-800 flex flex-wrap items-center justify-between text-[11px] gap-2 text-zinc-300">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-semibold">
              +25 to +40: Salam, BCS / Govt Job prep, 9:30 PM sleep, advance cash
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-red-400 font-semibold">
              -15 to -30: Late-night coding, friends, guitar, complaining, gate keys
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWeaknessRadar(!showWeaknessRadar)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{showWeaknessRadar ? 'Hide Weakness' : 'Uncle Weakness'}</span>
            </button>
            <button
              onClick={() => setShowAlibiCheatSheet(!showAlibiCheatSheet)}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{showAlibiCheatSheet ? 'Hide Teleprompter' : 'Alibi Teleprompter'}</span>
            </button>
          </div>
        </div>

        {/* Uncle's Psychological Weakness Radar (Cheat Helper) */}
        {showWeaknessRadar && (
          <div className="bg-zinc-900/95 border-b border-zinc-800 p-3 sm:p-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block uppercase text-[10px] mb-1">
                  🎯 How to Melt Uncle (+30 to +40 Approval):
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Start with "Assalamu Alaikum Uncle", claim 46th BCS preparation, swear you go to sleep at 9:30 PM, offer 2-3 months advance cash, and praise the building's strict discipline.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30">
                <span className="text-red-400 font-bold block uppercase text-[10px] mb-1">
                  💀 Instant Red Flags (-20 to -35 Approval):
                </span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Never mention software engineering, freelancing at 2 AM, having college friends over, playing acoustic guitar, or asking for the main gate key!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alibi Script Teleprompter Drawer (if open) */}
        {showAlibiCheatSheet && (
          <div className="bg-emerald-950/90 border-b-2 border-emerald-500 p-4 text-emerald-100 text-xs">
            <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
              <span>🗣️ Pious Student Teleprompter (Read to Uncle):</span>
              <button
                onClick={() => {
                  if (phoneAlibiScript) {
                    setUserInput(phoneAlibiScript);
                  }
                }}
                className="text-[10px] bg-amber-400 text-zinc-950 px-2 py-0.5 rounded font-extrabold"
              >
                Use Full Alibi
              </button>
            </div>
            <p className="italic leading-relaxed">
              "{phoneAlibiScript || 'Assalamu Alaikum Uncle! Ami 46th BCS candidate. Dhakay amar kono bondhu nai. Rat 9:30 PM e ghumai, namaz pori, advance 2 mash cash e dibo.'}"
            </p>
          </div>
        )}

        {/* Transcript / Dialogue Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[460px] space-y-4 bg-zinc-950/90">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-xs text-zinc-400 font-bold">
                  {msg.role === 'user' ? '🧑‍🎓 You (Student)' : `👴🏾 ${currentBoss.bossName}`}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">[{msg.timestamp}]</span>
                {msg.scoreChange !== undefined && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                      msg.scoreChange > 0
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : msg.scoreChange < 0
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {msg.scoreChange > 0 ? `+${msg.scoreChange}` : msg.scoreChange} Approval
                  </span>
                )}
              </div>

              <div
                className={`max-w-xl p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-zinc-950 rounded-tr-none font-semibold'
                    : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700 font-medium'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isSubmitting && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs italic p-2 animate-pulse">
              <span>👴🏾 Uncle is checking CCTV & clearing his throat...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Street-Smart Veteran Commentary Footer */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-2.5 px-4 text-xs text-amber-200/90 flex items-center gap-2">
          <span className="text-sm">💡</span>
          <span className="font-bold text-amber-400 shrink-0">Basa Khuji AI Veteran Note:</span>
          <span className="truncate">{lastCommentary}</span>
        </div>

        {/* VICTORY SCREEN & OFFICIAL DHAKA TENANCY CERTIFICATE */}
        {isConvinced && (
          <div className="bg-gradient-to-br from-emerald-950 via-zinc-900 to-amber-950 text-white p-6 sm:p-8 text-center flex flex-col items-center gap-4 border-t-4 border-amber-400">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center text-3xl font-black shadow-2xl animate-bounce">
              🏆
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                Victory Achieved!
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-white mt-1">
                BARIWALA CONVINCED! FLAT SECURED!
              </h4>
              <p className="text-xs sm:text-sm text-emerald-200/90 max-w-lg mt-1 mx-auto">
                Uncle has granted your bachelor admission! Bring 2 copies of passport photos, father's NID, and advance cash.
              </p>
            </div>

            {/* Official Dhaka Tenancy Permit Card */}
            <div className="w-full max-w-lg bg-amber-50 text-zinc-900 rounded-2xl border-4 border-amber-600 p-5 shadow-2xl text-left relative overflow-hidden">
              <div className="absolute top-3 right-3 border-2 border-red-600 text-red-600 font-black text-[11px] px-3 py-1 rounded rotate-[-12deg] uppercase">
                APPROVED BY UNCLE
              </div>

              <div className="flex items-center gap-2 border-b-2 border-dashed border-amber-300 pb-3">
                <span className="text-2xl">📜</span>
                <div>
                  <h5 className="font-black text-sm text-zinc-900">
                    DHAKA BACHELOR TENANCY CLEARANCE PERMIT
                  </h5>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ISSUED BY: {currentBoss.bossName} ({currentBoss.bossTitle})
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                    Tenant Status:
                  </span>
                  <span className="font-extrabold text-emerald-800">
                    Pious 46th BCS Aspirant
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                    Gate Curfew:
                  </span>
                  <span className="font-extrabold text-zinc-900">
                    10:00 PM Sharp (Zero Tolerance)
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                    Musical Instruments:
                  </span>
                  <span className="font-extrabold text-red-600">Strictly Prohibited</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                    Approval Rating:
                  </span>
                  <span className="font-black text-emerald-600">{approvalScore}/100</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                onClick={restartCall}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs shadow-lg transition active:scale-95"
              >
                Fight Another Landlord Boss 🥊
              </button>
            </div>
          </div>
        )}

        {/* Kicked Out / Disconnected Screen */}
        {isKickedOut && (
          <div className="bg-red-950 text-white p-6 text-center flex flex-col items-center gap-3 border-t-2 border-red-500">
            <span className="text-4xl">🚪</span>
            <h4 className="text-xl sm:text-2xl font-black text-red-400">
              KICKED OUT: "Line kete dilo!"
            </h4>
            <p className="text-xs sm:text-sm text-red-200 max-w-md">
              Uncle detected bachelor red flags (guitar, late night coding, or asking for gate keys).
              Approval dropped to {approvalScore}% and Uncle slammed down his telephone!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                onClick={restartCall}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow flex items-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" /> Redial Uncle with Pious Alibi
              </button>

              <button
                onClick={() => {
                  setCallActive(true);
                  handleSendReply(
                    'Uncle maf kore den! Amar galti hoye geche, ami guitar/headphone shob fele diye shudhu namaz ar porashona korbo, doya kore line katben na!'
                  );
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow flex items-center gap-1.5 transition"
              >
                🧎 Paa Dhora (Touch Feet Mercy Resurrection)
              </button>
            </div>
          </div>
        )}

        {/* Tactical Reply Chips, Power-Up Arsenal & Input Controls */}
        {callActive && !isConvinced && (
          <div className="p-4 bg-zinc-900 border-t-2 border-zinc-800 space-y-3">
            {/* POWER-UP WIN ARSENAL */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Tactical Win Arsenal (Guaranteed +25 to +40 Approval):
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Win Probability: {winProbability}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSendReply(
                      'Assalamu Alaikum Uncle! Ami 46th BCS Administration Cadre er candidate. Dhakay kono bondhu-bandhob nai, rat 9:15 tay ghumai ar shob somoy namaz pori!'
                    )
                  }
                  disabled={isSubmitting}
                  className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-500/40 text-left text-xs font-semibold transition group flex items-start gap-1.5 disabled:opacity-50"
                >
                  <span className="text-base">🌟</span>
                  <div>
                    <div className="font-extrabold text-amber-300 group-hover:text-amber-200">
                      BCS 1st Cadre Alibi (+35)
                    </div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1">
                      Pious, 9:15 PM sleep, no friends
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSendReply(
                      'Uncle ami apnar shob shoroter shathe ekmot. 3 masher advance rent kal shokalei cash e dite raji achi, building er shanti nosto hobena!'
                    )
                  }
                  disabled={isSubmitting}
                  className="p-2 rounded-xl bg-amber-950/70 hover:bg-amber-900/90 text-amber-200 border border-amber-500/40 text-left text-xs font-semibold transition group flex items-start gap-1.5 disabled:opacity-50"
                >
                  <span className="text-base">💵</span>
                  <div>
                    <div className="font-extrabold text-amber-300 group-hover:text-amber-200">
                      3-Month Advance Cash (+30)
                    </div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1">
                      Crisp cash upfront, zero delay
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSendReply(
                      'Uncle amar baba bolchen apnar moton disciplined murubbi-r building e thaka shobcheye safe. Ami kono meye-manush ba gaan-bajona pochondo kori na!'
                    )
                  }
                  disabled={isSubmitting}
                  className="p-2 rounded-xl bg-blue-950/70 hover:bg-blue-900/90 text-blue-200 border border-blue-500/40 text-left text-xs font-semibold transition group flex items-start gap-1.5 disabled:opacity-50"
                >
                  <span className="text-base">🧓</span>
                  <div>
                    <div className="font-extrabold text-blue-300 group-hover:text-blue-200">
                      Father's Blessing (+25)
                    </div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1">
                      Praises building discipline
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tactical Reply Chips */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                💬 Quick Dialogue Chips:
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendReply(reply)}
                    disabled={isSubmitting}
                    className="text-left text-xs px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-zinc-200 border border-zinc-700 transition font-medium disabled:opacity-50"
                  >
                    💬 {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendReply();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your reply to Uncle in Banglish (e.g. 'Assalamu Alaikum Uncle, ami eka thakbo...')"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border-2 border-amber-500/50 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              <button
                type="submit"
                disabled={!userInput.trim() || isSubmitting}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-lg disabled:opacity-50 flex items-center gap-1.5 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playCallDisconnected();
                  setCallActive(false);
                }}
                className="p-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-700/60"
                title="Hang up call"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
