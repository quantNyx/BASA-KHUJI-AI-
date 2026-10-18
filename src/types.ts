export type OfficialVerdict =
  | '💀 CHADER NICHE TANDOORI TRAP'
  | '🚩 BARIWALA RED ALERT'
  | '🕵️ BKASH ADVANCE SCAM'
  | '💎 RARE DHAKA GEM';

export interface ClaimRealityPair {
  claim: string;
  reality: string;
}

export interface HiddenTaxItem {
  title: string;
  cost: number;
  description: string;
}

export interface BossPersona {
  bossName: string;
  bossTitle: string;
  initialApproval: number;
  openingLine: string;
  bossQuirks?: string[];
  suggestedReplies: string[];
}

export interface DhakaRealityReportData {
  rawMarkdown: string;
  survivalScore: number;
  survivalMeter: string;
  officialVerdict: OfficialVerdict;
  detectedArea: string;
  areaVibeRoast: string;
  claimsVsReality: ClaimRealityPair[];
  advertisedRent: number;
  hiddenTaxTotal: number;
  hiddenTaxBreakdown: HiddenTaxItem[];
  realMonthlyDamage: number;
  phoneAlibiScript: string;
  viewingTip: string;
  bossFight: BossPersona;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'uncle' | 'system';
  text: string;
  scoreChange?: number;
  timestamp: string;
  moodEmoji?: string;
}

export interface BossFightTurnResult {
  uncleDialogue: string;
  scoreChange: number;
  newScore: number;
  status: string;
  approvalMeter: string;
  uncleMoodEmoji: string;
  survivalCommentary: string;
  suggestedReplies: string[];
}

export interface PresetListing {
  id: string;
  title: string;
  area: string;
  badge: string;
  rent: string;
  imagePlaceholder?: string;
  text: string;
  description: string;
}

export interface GroundingSource {
  title: string;
  url: string;
  type: 'web' | 'map';
}

export interface AdvisorChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: GroundingSource[];
  mode?: 'chat' | 'maps' | 'search';
}

