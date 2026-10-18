import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { generateDhakaRealityReport, generateBossFightTurn } from './src/utils/dhakaVeteranEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI server-side with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

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

// POST /api/decode-tolet
app.post('/api/decode-tolet', async (req: Request, res: Response) => {
  try {
    const { text, image, areaHint } = req.body;

    if (!text && !image) {
      return res.status(400).json({ error: 'Please provide To-Let text or an image of the sign.' });
    }

    const systemPrompt = `You are "Basa Khuji AI" 🏠🇧🇩 — the ultimate street-smart, brutally honest, and hilarious Dhaka bachelor mess veteran. You have survived 10 years of house hunting across Mirpur, Mohammadpur, Bosila, Farmgate, Badda, and Uttara. You know every Bariwala (landlord) trick, Darowan bribe (50 tk cha-paan money), WASA water smell (rust/iron/drain), and "Chader Niche" (top-floor tin/concrete) summer oven trap in Dhaka city.

Analyze the uploaded To-Let sign image and/or text listing.
Return a comprehensive, hilarious, yet painfully accurate breakdown following Dhaka reality.

You must categorize the Official Verdict into exactly one of these 4:
- "💀 CHADER NICHE TANDOORI TRAP"
- "🚩 BARIWALA RED ALERT"
- "🕵️ BKASH ADVANCE SCAM"
- "💎 RARE DHAKA GEM"

Format the markdown output exactly adhering to:
🚨 BASA KHUJI: DHAKA REALITY REPORT
📊 Bachelor Survival Score: [0-100]/100
Survival Meter: [Draw a 10-block bar using 🟩, 🟨, or 🟥, e.g., 🟩🟩🟩🟥🟥🟥🟥🟥🟥🟥]
Official Verdict: [One of the 4 above]
Detected Area Vibe: [Identify Dhaka neighborhood or guess based on absurdity with a 1-line roast]

🤥 What They Wrote vs. Brutal Dhaka Reality
| 🪧 What the To-Let Claims | 💀 What It Actually Means in Dhaka |
|---|---|
| "[Quote 1]" | "[Hilarious translation mentioning Metro distance lies, rickshaws, WASA iron water, load shedding, or 2 AM Titas gas]" |
| "[Quote 2]" | "[Translation 2]" |
| "[Quote 3]" | "[Translation 3]" |
| "[Implied Red Flag]" | "[Expose what they conveniently left out]" |

💸 The "Actual" Monthly Damage Calculator
Advertised Rent: [X] BDT
Hidden Dhaka Bachelor Tax: +[Y] BDT
Breakdown:
- [Item 1 with funny Dhaka note and cost]
- [Item 2 with funny Dhaka note and cost]
- [Item 3 with funny Dhaka note and cost]
🔥 REAL MONTHLY DAMAGE: [Total] BDT / month

📞 The "Uncle-Approved" Phone Alibi Script
🗣️ Read this exact script before Uncle hangs up in 3 seconds:
"[Super polite, pious, heart-melting Bangla/Banglish phone script tailored for a university student. Claim preparing for BCS, pray 5 times a day at local mosque, sleep at 9:45 PM sharp, hate loud music/smoking, don't even have any friends in Dhaka.]"

🧠 Street-Smart Viewing Tip: [1 hilarious tip on how to dress/behave when visiting this specific flat, e.g. wear Punjabi, carry a thick BCS MP3 guide, touch Uncle's feet, don't look at the Darowan's eyes]

🥊 LEVEL 2 UNLOCKED: LIVE "BARIWALA BOSS FIGHT"
Target Boss: [Funny name & persona, e.g. Alhajj Abdul Kader (Retired Govt Officer from Mirpur who watches CCTV 14 hours a day)]
Uncle's Current Approval: [Score between 15-25]/100 [10-block emoji bar]
👴🏾 Bariwala Uncle (On the Phone): "[Angry, suspicious opening line in authentic Bangla/Banglish reacting to a bachelor calling his number, e.g., 'হ্যালো?! সাইনবোর্ডে বাংলা ভাষায় ফ্যামিলি লেখা দেখেন নাই? ব্যাচেলর হয়ে ফোন দিছেন কোন সাহসে? রাখি ফোন!']"
(👉 Your Turn: Reply in Banglish below to convince Uncle to rent you the room before Approval hits 0!)`;

    let parts: any[] = [];

    if (image) {
      // image can be data:image/jpeg;base64,... or pure base64
      let mimeType = 'image/jpeg';
      let data = image;
      if (image.startsWith('data:')) {
        const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          data = matches[2];
        }
      }
      parts.push({
        inlineData: {
          mimeType,
          data,
        },
      });
    }

    const userPrompt = `Here is the To-Let post or details to analyze:
${text ? `Listing text: "${text}"` : 'Please read the text from the attached To-Let image.'}
${areaHint ? `Area hint: ${areaHint}` : ''}

Please decode this and generate both the exact rawMarkdown report as specified AND structured JSON fields so the frontend dashboard can render interactive sliders, tables, and the Level 2 Boss Fight roleplay.`;

    parts.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rawMarkdown: {
              type: Type.STRING,
              description: 'The complete verbatim markdown report matching the format prompt.',
            },
            survivalScore: {
              type: Type.INTEGER,
              description: 'Survival score between 0 and 100',
            },
            survivalMeter: {
              type: Type.STRING,
              description: '10-block emoji string e.g. 🟩🟩🟩🟥🟥🟥🟥🟥🟥🟥',
            },
            officialVerdict: {
              type: Type.STRING,
              description: 'One of the 4 exact official verdicts',
            },
            detectedArea: {
              type: Type.STRING,
              description: 'Dhaka neighborhood name',
            },
            areaVibeRoast: {
              type: Type.STRING,
              description: '1-line brutal roast of the area vibe',
            },
            claimsVsReality: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  claim: { type: Type.STRING },
                  reality: { type: Type.STRING },
                },
                required: ['claim', 'reality'],
              },
            },
            advertisedRent: {
              type: Type.INTEGER,
              description: 'Advertised rent in BDT',
            },
            hiddenTaxTotal: {
              type: Type.INTEGER,
              description: 'Total hidden Dhaka bachelor tax in BDT',
            },
            hiddenTaxBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  cost: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                },
                required: ['title', 'cost', 'description'],
              },
            },
            realMonthlyDamage: {
              type: Type.INTEGER,
              description: 'Advertised Rent + Hidden Tax Total in BDT',
            },
            phoneAlibiScript: {
              type: Type.STRING,
              description: 'The heart-melting pious BCS student phone script in Bangla/Banglish',
            },
            viewingTip: {
              type: Type.STRING,
              description: 'Hilarious street-smart viewing tip',
            },
            bossFight: {
              type: Type.OBJECT,
              properties: {
                bossName: { type: Type.STRING },
                bossTitle: { type: Type.STRING },
                initialApproval: { type: Type.INTEGER },
                openingLine: { type: Type.STRING },
                bossQuirks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                suggestedReplies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['bossName', 'bossTitle', 'initialApproval', 'openingLine', 'suggestedReplies'],
            },
          },
          required: [
            'rawMarkdown',
            'survivalScore',
            'survivalMeter',
            'officialVerdict',
            'detectedArea',
            'areaVibeRoast',
            'claimsVsReality',
            'advertisedRent',
            'hiddenTaxTotal',
            'hiddenTaxBreakdown',
            'realMonthlyDamage',
            'phoneAlibiScript',
            'viewingTip',
            'bossFight',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, report: parsed });
  } catch (error: any) {
    console.error('Error in /api/decode-tolet, using veteran fallback:', error?.message);
    const fallbackReport = generateDhakaRealityReport(req.body?.text || '', req.body?.areaHint);
    return res.json({ success: true, report: fallbackReport, isFallback: true });
  }
});

// POST /api/boss-fight
app.post('/api/boss-fight', async (req: Request, res: Response) => {
  try {
    const { bossName, bossTitle, currentApproval, chatHistory, userReply } = req.body;

    if (!userReply) {
      return res.status(400).json({ error: 'User reply is required.' });
    }

    const currentScore = typeof currentApproval === 'number' ? currentApproval : 20;

    const systemPrompt = `You are the grumpy, hyper-suspicious Dhaka Bariwala Uncle (${bossName}, ${bossTitle}) in the "Bariwala Boss Fight Roleplay" (Mode 2) of Basa Khuji AI.
You hate careless bachelors, late-night gate knocking, guitars, loud YouTube watching, and female visitors.
However, you have a soft spot for pious, ultra-polite, BCS-preparing or Govt Job aspiring students who sleep at 9:30 PM, pray in the front row of the mosque, respect elders, pay advance rent readily, and speak in respectful Banglish/Bangla.

SCORING RULES (Strictly enforce based on user's reply):
+25 to +40 Approval: If the student uses polite greetings (Assalamu Alaikum Uncle), mentions BCS/Govt job prep, promises to sleep by 10 PM, offers advance rent, or flatters Uncle (e.g. praising Uncle's building discipline).
-15 to -30 Approval: If the student mentions late-night coding/freelancing, having friends visit, playing guitar/music, complaining about the lift/heat/water, or asking about gate keys.
Neutral / modest adjustments (+5 to +15, or -5 to -10) for ordinary excuses.

Calculate the score change and the new score (clamped between 0 and 100).

STATUS CATEGORIES (Choose exact status):
- If new score <= 0: "🚪 KICKED OUT: Line kete dilo!"
- If new score < 50: "😠 Suspicious"
- If new score >= 50 and < 80: "🤔 Warming Up"
- If new score >= 80: "🎉 CONVINCED! Come with NID photo & Character Certificate"

Format the uncle's dialogue in authentic, colorful Dhaka Uncle Bangla/Banglish (2-3 sentences max). Include Uncle's signature coughing, clearing throat ("হুমমম...", "এ্যাই শোনেন..."), or checking CCTV threats.`;

    const contents = [
      {
        text: `Boss Persona: ${bossName} (${bossTitle})
Current Approval: ${currentScore}/100
Conversation History:
${(chatHistory || []).map((m: any) => `${m.role === 'user' ? 'Student' : 'Uncle'}: "${m.text}"`).join('\n')}

Latest reply from Student: "${userReply}"

Respond in character as Bariwala Uncle and provide the updated approval calculation and 3 street-smart suggested next replies.`,
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            uncleDialogue: {
              type: Type.STRING,
              description: '2-3 sentences of hilarious, authentic Dhaka Uncle Bangla/Banglish dialogue',
            },
            scoreChange: {
              type: Type.INTEGER,
              description: 'Score delta, e.g. +30 or -20',
            },
            newScore: {
              type: Type.INTEGER,
              description: 'Calculated new score 0-100',
            },
            status: {
              type: Type.STRING,
              description: 'Exact status string',
            },
            uncleMoodEmoji: {
              type: Type.STRING,
              description: 'Single emoji representing Uncle reaction e.g. 😠, 🤔, 🧐, 😤, ☕, 🎉',
            },
            survivalCommentary: {
              type: Type.STRING,
              description: '1 line street-smart veteran tip from Basa Khuji AI analyzing Uncle reaction',
            },
            suggestedReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 tactical Banglish reply chips for the user',
            },
          },
          required: [
            'uncleDialogue',
            'scoreChange',
            'newScore',
            'status',
            'uncleMoodEmoji',
            'survivalCommentary',
            'suggestedReplies',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const clampedScore = Math.max(0, Math.min(100, parsed.newScore ?? currentScore));
    parsed.newScore = clampedScore;
    parsed.approvalMeter = getEmojiBar(clampedScore);

    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error in /api/boss-fight, using veteran fallback:', error?.message);
    const fallbackResult = generateBossFightTurn(
      req.body?.bossName || 'Alhajj Abdul Kader',
      req.body?.currentApproval || 20,
      req.body?.userReply || ''
    );
    return res.json({ success: true, result: fallbackResult, isFallback: true });
  }
});

// POST /api/chat - Multi-turn Chatbot with Google Search and Google Maps Grounding
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, mode = 'chat', location } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const lat = location?.latitude || 23.8103;
    const lng = location?.longitude || 90.4125;

    const baseSystemPrompt = `You are "Basa Khuji Advisor" 🏠🇧🇩 — the ultimate street-smart, brutally honest, yet deeply helpful 10-year Dhaka bachelor mess veteran.
You know all of Dhaka city: Mirpur (1, 2, 10, 11, 14), Mohammadpur, Bosila, Farmgate, Indira Road, Badda, Rampura, Uttara, Bashundhara, Dhanmondi, and Old Dhaka.
You provide hyper-accurate practical advice about bachelor house hunting, rent negotiations, WASA water remedies, rickshaw fare benchmarks, Dhaka Metro routes, mess meal management, Darowan diplomacy, and avoiding landlord scams.
Respond with street-smart Dhaka humor, authentic Banglish/Bangla phrases ("খালা", "দারোয়ান", "পানি লাল", "মেট্রো ৫ মিনিট", "বাড়িওয়ালা আংকেল"), and actionable advice.`;

    // Construct conversation contents
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const item of history) {
        contents.push({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: item.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let config: any = {
      systemInstruction: baseSystemPrompt,
    };

    // Mode-specific Grounding configuration
    if (mode === 'maps') {
      config = {
        systemInstruction: `${baseSystemPrompt}
Ground your answer in real geographic data using Google Maps for Dhaka. Provide specific landmark directions, walking distances, nearest Metro Rail stations, and place names in Dhaka.`,
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
      };
    } else if (mode === 'search') {
      config = {
        systemInstruction: `${baseSystemPrompt}
Use Google Search grounding to retrieve up-to-date Dhaka house rent rates, Dhaka Metro rail schedules, recent WASA water issues, government bachelor housing notices, and current Dhaka living costs.`,
        tools: [{ googleSearch: {} }],
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config,
    });

    const replyText = response.text || 'কোনো উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।';

    // Extract Grounding metadata
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = rawChunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => ({
        title: c.web.title || c.web.uri,
        url: c.web.uri,
        type: 'web' as const,
      }));

    const mapSources = rawChunks
      .filter((c: any) => c.maps?.uri || c.maps?.title)
      .map((c: any) => ({
        title: c.maps.title || 'Dhaka Location',
        url:
          c.maps.uri ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            c.maps.title || 'Dhaka'
          )}`,
        type: 'map' as const,
      }));

    const sources = [...webSources, ...mapSources];

    return res.json({
      success: true,
      reply: replyText,
      sources,
      mode,
    });
  } catch (error: any) {
    console.error('Error in /api/chat, providing veteran fallback:', error?.message);

    // Dynamic Dhaka Mess Veteran Fallback
    const msgLower = (req.body?.message || '').toLowerCase();
    let fallbackReply =
      'আরে ভাই! ঢাকায় মেস খোঁজা মানেই রণক্ষেত্র। বাড়িওয়ালার সঙ্গে কথা বলার সময় ৩টি জিনিস মাথায় রাখবেন: ১. কখনো বলবেন না রাতে ফ্রিল্যান্সিং বা কোডিং করেন। ২. সবসময় সালাম দিয়ে বিসিএস বা সরকারি চাকরির প্রস্তুতি নেওয়ার কথা বলবেন। ৩. মেইন গেটের চাবি কার বালিশের নিচে থাকে তা আগেই যাচাই করুন!';
    let fallbackSources: any[] = [];

    if (msgLower.includes('metro') || msgLower.includes('দূরত্ব') || msgLower.includes('মেট্রো') || msgLower.includes('মিরপুর')) {
      fallbackReply =
        'মিরপুর-১০ গোলচত্বর ও মেট্রোরেল স্টেশন: আসল দূরত্ব মাত্র ১৫০ মিটার (২ মিনিটের হাঁটা পথ)। তবে বিজ্ঞাপনদাতারা যখন অলিগলির ভেতরের বাসার জন্য "মেট্রো থেকে ৫ মিনিট" বলে, তখন রিকশা জ্যাম ও বর্ষায় জলাবদ্ধ ড্রেনের কারণে তা আসলে ২ কিমি হয়ে যায়!\n\nগুগল ম্যাপসে মিরপুর ১০ স্টেশনটি গোলচত্বরের ঠিক কেন্দ্রেই অবস্থিত।';
      fallbackSources = [
        {
          title: 'Mirpur 10 Metro Station (MRT Line 6)',
          url: 'https://www.google.com/maps/search/?api=1&query=Mirpur+10+Metro+Rail+Station+Dhaka',
          type: 'map',
        },
        {
          title: 'Dhaka Mass Transit Company Limited (DMTCL)',
          url: 'https://dmtcl.gov.bd/',
          type: 'web',
        },
      ];
    } else if (msgLower.includes('খাবার') || msgLower.includes('হোটেল') || msgLower.includes('farmgate') || msgLower.includes('ফার্মগেট')) {
      fallbackReply =
        'ফার্মগেট ইন্দিরা রোড ও গ্রিন রোডে ব্যাচেলরদের জন্য প্রচুর "ভাতের হোটেল" রয়েছে। তবে সাবধান—দুপুরের ডাল ও সবজিতে অতিরিক্ত হলুদ থাকে। ভালো খাবারের জন্য আনন্দ সিনেমা হলের পাশের গলির হোটেল অথবা ফার্মভিউ সুপার মার্কেটের পেছনের মেস খাবার প্রসিদ্ধ।';
      fallbackSources = [
        {
          title: 'Farmgate Indira Road, Dhaka',
          url: 'https://www.google.com/maps/search/?api=1&query=Indira+Road+Farmgate+Dhaka',
          type: 'map',
        },
        {
          title: 'Dhaka Bachelor Mess Food Guide',
          url: 'https://www.google.com/search?q=Dhaka+bachelor+mess+food+guide',
          type: 'web',
        },
      ];
    } else if (msgLower.includes('পানি') || msgLower.includes('wasa') || msgLower.includes('ওয়াসা')) {
      fallbackReply =
        'মোহাম্মদপুর ও বসিলা এলাকার ওয়াসা পানিতে প্রচুর আয়রন ও কালচে কাদা থাকে। ৩ স্তরের সিরামিক ক্যান্ডেল ফিল্টার (Ceramic Filter) ও অ্যাক্টিভেটেড কার্বন ফিল্টার ব্যবহার করলে গন্ধ দূর হয়। মেসের পানির জার নেওয়ার আগে সিল দেখে নিবেন!';
      fallbackSources = [
        {
          title: 'Dhaka WASA Modonpur/Mohammadpur Zonal Office',
          url: 'https://www.google.com/maps/search/?api=1&query=Dhaka+WASA+Office',
          type: 'map',
        },
        {
          title: 'Dhaka WASA Official Portal',
          url: 'https://dwasa.org.bd/',
          type: 'web',
        },
      ];
    } else {
      fallbackSources = [
        {
          title: 'Dhaka City Map (Google Maps)',
          url: 'https://www.google.com/maps/search/?api=1&query=Dhaka+Bangladesh',
          type: 'map',
        },
        {
          title: 'Dhaka Bachelor Housing News',
          url: 'https://www.google.com/search?q=Dhaka+bachelor+flat+renting+tips',
          type: 'web',
        },
      ];
    }

    return res.json({
      success: true,
      reply: fallbackReply,
      sources: fallbackSources,
      mode: req.body?.mode || 'chat',
    });
  }
});

// Setup Vite or Static Serving
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏠 Basa Khuji AI server running on http://0.0.0.0:${PORT}`);
  });
}

start();
