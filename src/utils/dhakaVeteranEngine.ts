import { DhakaRealityReportData, BossFightTurnResult, OfficialVerdict } from '../types';

function getEmojiBar(score: number): string {
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

/**
 * Intelligent Dhaka Veteran Fallback Engine
 * Generates full authentic reports and roleplay turns tailored to listing keywords
 */
export function generateDhakaRealityReport(text: string, areaHint?: string): DhakaRealityReportData {
  const t = (text || '').toLowerCase();
  const area = (areaHint || '').toLowerCase();

  let detectedArea = 'Mirpur-10, Dhaka';
  let roast = 'Land of flyover dust, coaching centers, and landlords who watch CCTV 14 hours a day.';
  let verdict: OfficialVerdict = '💀 CHADER NICHE TANDOORI TRAP';
  let survivalScore = 28;
  let advertisedRent = 6500;

  // Extract rent numbers if present (e.g. 6500, 5000, 8000)
  const rentMatch = text.match(/(\d{4,5})\s*(?:টাকা|bdt|tk|taka)?/i);
  if (rentMatch) {
    const parsed = parseInt(rentMatch[1], 10);
    if (parsed >= 2000 && parsed <= 50000) {
      advertisedRent = parsed;
    }
  }

  // Detect Area & Verdict
  if (t.includes('bosila') || t.includes('বসিলা') || t.includes('mohammadpur') || t.includes('মোহাম্মদপুর') || area.includes('mohammadpur') || area.includes('bosila')) {
    detectedArea = 'Mohammadpur / Bosila, Dhaka';
    roast = 'The water contains enough iron to manufacture spoons, and you will need a paddle boat during monsoon.';
    verdict = '🚩 BARIWALA RED ALERT';
    survivalScore = 34;
  } else if (t.includes('farmgate') || t.includes('ফার্মগেট') || t.includes('indira') || t.includes('ইন্দিরা') || area.includes('farmgate')) {
    detectedArea = 'Farmgate Indira Road, Dhaka';
    roast = 'Coaching student hub where 3 bachelors share 1 bed and the Darowan locks the gate at 10:01 PM.';
    verdict = '💀 CHADER NICHE TANDOORI TRAP';
    survivalScore = 22;
  } else if (t.includes('bashundhara') || t.includes('বসুন্ধরা') || t.includes('bkash') || t.includes('বিকাশ') || t.includes('টোকেন') || t.includes('advance')) {
    detectedArea = 'Bashundhara R/A, Dhaka';
    roast = 'Too good to be true studio flat designed to extract 5,000 BDT Bkash advance token money before vanishing.';
    verdict = '🕵️ BKASH ADVANCE SCAM';
    survivalScore = 12;
  } else if (t.includes('badda') || t.includes('বাড্ডা') || t.includes('rampura') || t.includes('রামপুরা') || area.includes('badda')) {
    detectedArea = 'Badda / Notun Bazar, Dhaka';
    roast = 'Seasonal drainage aroma mixed with WASA supply line, and Titas gas only wakes up at 3:15 AM.';
    verdict = '🚩 BARIWALA RED ALERT';
    survivalScore = 31;
  } else if (t.includes('uttara') || t.includes('উত্তরা') || area.includes('uttara')) {
    detectedArea = 'Uttara Sector, Dhaka';
    roast = 'Direct Metro connection, but the service charge is mysteriously equal to your bedroom rent.';
    verdict = '💎 RARE DHAKA GEM';
    survivalScore = 72;
  }

  // Claims vs Reality
  const claimsVsReality = [
    {
      claim: t.includes('৫ মিনিট') || t.includes('5 min') ? 'মেট্রোরেল থেকে মাত্র ৫ মিনিট এর পথ' : 'খুব কাছেই প্রধান সড়ক ও যোগাযোগ ব্যবস্থা',
      reality: 'Landlord physics measured by a supersonic jet. In reality, it is 2.5 km of broken pavement, rickshaw gridlock, and open drain puddles.',
    },
    {
      claim: t.includes('মনোরম') || t.includes('খোলামেলা') ? 'মনোরম খোলামেলা নির্মল পরিবেশ' : 'পারিবারিক শান্ত পরিবেশ',
      reality: 'Top floor concrete roof with zero ceiling insulation. In May at 2:00 PM, the ceiling radiates enough heat to bake naan bread.',
    },
    {
      claim: 'সার্বক্ষণিক ওয়াসা ও বিদ্যুৎ সুবিধা',
      reality: 'WASA water flows with a rusty reddish iron aroma. Titas gas disappears every morning between 7:00 AM and 11:30 AM.',
    },
    {
      claim: 'ধুমপান ও বহিরাগত সম্পূর্ণ নিষেধ (গেটে দারোয়ান পাহারা)',
      reality: 'Darowan locks the collapsible gate at 10:15 PM sharp and demands 50 BDT "night cha" bribe to open it if you arrive at 10:16 PM.',
    },
  ];

  // Hidden Taxes
  const hiddenTaxBreakdown = [
    {
      title: 'Metro Distance Rickshaw Surcharge',
      cost: 1400,
      description: 'Because "5 mins to Metro" is actually 2.4 km through waterlogged alleyways.',
    },
    {
      title: '7th-Floor Heat Fan & Cooler Bill',
      cost: 950,
      description: 'Extra electricity cost running 2 ceiling fans continuously to survive tandoori roof heat.',
    },
    {
      title: 'Khala Sudden Mood-Swing Bonus',
      cost: 500,
      description: 'Monthly sweetener so Khala does not put raw turmeric in your dinner daal.',
    },
    {
      title: 'Darowan Late-Gate Cha Bribes',
      cost: 450,
      description: '9 gate-openings after 10:15 PM at standard Dhaka rate of 50 BDT per entry.',
    },
  ];

  const hiddenTaxTotal = hiddenTaxBreakdown.reduce((sum, item) => sum + item.cost, 0);
  const realMonthlyDamage = advertisedRent + hiddenTaxTotal;

  const phoneAlibiScript =
    'Assalamu Alaikum Uncle! Ami 46th BCS Administration Cadre candidate. Dhakay amar kono bondhu-bandhob nai, gaan-bajona kori na. Rat 9:30 tay ghumai, namaz pori ar 3 masher advance rent kal shokalei cash e dite raji achi!';

  const viewingTip =
    'Wear a clean white Punjabi, carry a thick 46th BCS MP3 Guide in your hand, touch Uncle\'s feet respectfully, and never look directly at the Darowan\'s tea stall.';

  const bossFight = {
    bossName: 'Alhajj Abdul Kader',
    bossTitle: 'Retired Grade-9 Govt Section Officer (Mirpur 10)',
    initialApproval: 20,
    openingLine: 'হ্যালো?! সাইনবোর্ডে বাংলা ভাষায় স্পষ্ট লেখা দেখেন নাই? ব্যাচেলর হয়ে এই নম্বরে ফোন দিছেন কোন সাহসে? এখনই রাখি ফোন!',
    bossQuirks: [
      'Watches CCTV monitor in his drawing room 14 hours a day',
      'Locks the collapsible main gate at 10:15 PM sharp and keeps the key under his pillow',
      'Thinks any laptop user is an illegal dark web hacker',
    ],
    suggestedReplies: [
      'Assalamu Alaikum Uncle! Ami 46th BCS candidate, rat 9:30 tay ghumai!',
      'Uncle ami shudhu namaz pori ar pori, kono bondhu-bandhob nai Dhakay!',
      'Uncle 2 masher advance cash e dite raji achi, building er shanti nosto hobena!',
    ],
  };

  const rawMarkdown = `🚨 BASA KHUJI: DHAKA REALITY REPORT
📊 Bachelor Survival Score: ${survivalScore}/100
Survival Meter: ${getEmojiBar(survivalScore)}
Official Verdict: ${verdict}
Detected Area Vibe: ${detectedArea} — ${roast}

🤥 What They Wrote vs. Brutal Dhaka Reality
| 🪧 What the To-Let Claims | 💀 What It Actually Means in Dhaka |
|---|---|
| "${claimsVsReality[0].claim}" | "${claimsVsReality[0].reality}" |
| "${claimsVsReality[1].claim}" | "${claimsVsReality[1].reality}" |
| "${claimsVsReality[2].claim}" | "${claimsVsReality[2].reality}" |
| "${claimsVsReality[3].claim}" | "${claimsVsReality[3].reality}" |

💸 The "Actual" Monthly Damage Calculator
Advertised Rent: ${advertisedRent.toLocaleString()} BDT
Hidden Dhaka Bachelor Tax: +${hiddenTaxTotal.toLocaleString()} BDT
Breakdown:
- +1,400 BDT Rickshaw fare because "5 mins from Metro" is actually 2.4 km
- +950 BDT Extra fan bill for 7th-floor summer tandoori heat
- +500 BDT Khala's sudden mood-swing bonus
- +450 BDT Darowan 10:15 PM gate-opening cha bribes
🔥 REAL MONTHLY DAMAGE: ${realMonthlyDamage.toLocaleString()} BDT / month

📞 The "Uncle-Approved" Phone Alibi Script
🗣️ Read this exact script before Uncle hangs up in 3 seconds:
"${phoneAlibiScript}"

🧠 Street-Smart Viewing Tip: ${viewingTip}

🥊 LEVEL 2 UNLOCKED: LIVE "BARIWALA BOSS FIGHT"
Target Boss: ${bossFight.bossName} (${bossFight.bossTitle})
Uncle's Current Approval: [${bossFight.initialApproval}/100] ${getEmojiBar(bossFight.initialApproval)}
👴🏾 Bariwala Uncle (On the Phone): "${bossFight.openingLine}"
(👉 Your Turn: Reply in Banglish below to convince Uncle to rent you the room before Approval hits 0!)`;

  return {
    rawMarkdown,
    survivalScore,
    survivalMeter: getEmojiBar(survivalScore),
    officialVerdict: verdict,
    detectedArea,
    areaVibeRoast: roast,
    claimsVsReality,
    advertisedRent,
    hiddenTaxTotal,
    hiddenTaxBreakdown,
    realMonthlyDamage,
    phoneAlibiScript,
    viewingTip,
    bossFight,
  };
}

/**
 * Intelligent Dhaka Bariwala Boss Fight Response Generator
 */
export function generateBossFightTurn(
  bossName: string,
  currentApproval: number,
  userReply: string
): BossFightTurnResult {
  const replyLower = (userReply || '').toLowerCase();
  let scoreChange = 0;
  let uncleDialogue = '';
  let moodEmoji = '😠';

  // Check user reply triggers
  if (
    replyLower.includes('assalamu') ||
    replyLower.includes('সালাম') ||
    replyLower.includes('bcs') ||
    replyLower.includes('বিসিএস') ||
    replyLower.includes('advance') ||
    replyLower.includes('অগ্রিম') ||
    replyLower.includes('cash') ||
    replyLower.includes('porashona') ||
    replyLower.includes('namaz') ||
    replyLower.includes('মুরুব্বি')
  ) {
    scoreChange = 35;
    moodEmoji = '🤔';
    uncleDialogue =
      'হুমমম... ওয়ালাইকুম আসসালাম। বিসিএস দিচ্ছেন? আমার বড় জামাতাও অ্যাডমিন ক্যাডারে আছে। তবে রাত ১০টার পর কিন্তু গেটে তালা দেওয়া হয়, কোনো আড্ডা চলবে না! অ্যাডভান্স কত দিতে পারবেন বললেন?';
  } else if (
    replyLower.includes('guitar') ||
    replyLower.includes('coding') ||
    replyLower.includes('freelance') ||
    replyLower.includes('রাত') ||
    replyLower.includes('বন্ধু') ||
    replyLower.includes('friend') ||
    replyLower.includes('girl') ||
    replyLower.includes('key') ||
    replyLower.includes('চাবি')
  ) {
    scoreChange = -25;
    moodEmoji = '😤';
    uncleDialogue =
      'কি বললেন?! রাতবিরাতে জেগে থাকবেন আর বন্ধু-বান্ধব আসবে?! এই বিল্ডিংয়ে কোনো মিউজিক্যাল ছেলে বা রাতকানা ফ্রিল্যান্সার ঢুকবে না! গেটের চাবি কার কাছে থাকে জানেন?! রাখি ফোন!';
  } else if (replyLower.includes('maf') || replyLower.includes('মাফ') || replyLower.includes('পা') || replyLower.includes('ভুল')) {
    scoreChange = 30;
    moodEmoji = '🧐';
    uncleDialogue =
      'আচ্ছা ঠিক আছে... ভুলের জন্য অনুতপ্ত হওয়া ভালো লক্ষণ। তবে আবার বলছি, ৩ কপি পাসপোর্ট ছবি আর বাবার ভোটার আইডির কপি লাগবে। কোনো ফাঁকিবাজি চলবে না!';
  } else {
    scoreChange = 15;
    moodEmoji = '🤨';
    uncleDialogue =
      'এ্যাই শোনেন... কথা তো ভালোই বলতেছেন, কিন্তু ঢাকায় তো কোনো ব্যাচেলরকেই বিশ্বাস করা যায় না। আপনার গ্রামের বাড়ি কোথায়? মেসের বাকি ছেলেরা কি করে?';
  }

  const newScore = Math.max(0, Math.min(100, currentApproval + scoreChange));

  let status = '😠 Suspicious';
  if (newScore <= 0) {
    status = '🚪 KICKED OUT: Line kete dilo!';
    moodEmoji = '🚪';
  } else if (newScore >= 80) {
    status = '🎉 CONVINCED! Come with NID photo & Character Certificate';
    moodEmoji = '🎉';
    uncleDialogue =
      'মাশাআল্লাহ! আপনি খাঁটি দ্বীনদার ও ভদ্র পরিবারের ছেলে। কাল সকালেই বাবার ভোটার আইডির কপি আর অ্যাডভান্স নিয়ে আসেন। ফ্ল্যাটের চাবি আপনার জন্য রেডি!';
  } else if (newScore >= 50) {
    status = '🤔 Warming Up';
  }

  return {
    uncleDialogue,
    scoreChange,
    newScore,
    status,
    approvalMeter: getEmojiBar(newScore),
    uncleMoodEmoji: moodEmoji,
    survivalCommentary:
      newScore >= 80
        ? 'Bariwala is completely melted! Uncle accepted your BCS alibi.'
        : scoreChange > 0
        ? 'Great tactic! Mentioning BCS and advance cash boosted Uncle approval.'
        : 'Warning! Uncle hates late-night talk. Pivot to early sleep and govt job prep.',
    suggestedReplies: [
      'Uncle ami shob somoy namaz pori, rat 9:30 tay ghumai!',
      'Uncle 3 masher advance kal cash e dite raji achi!',
      'Amar baba Union Parishad er Chairman, building er shob rule manbo!',
    ],
  };
}
