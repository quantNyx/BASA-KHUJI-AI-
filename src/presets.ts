import { PresetListing, BossPersona } from './types';

export const DHAKA_PRESETS: PresetListing[] = [
  {
    id: 'mirpur-10-chader-niche',
    title: 'Mirpur-10 Chader Niche VIP Bachelor Room',
    area: 'Mirpur-10 (Golchokkor)',
    badge: '💀 Tandoori Special',
    rent: '6,500 BDT',
    description: 'Tin shade top floor, "5 min walk to Metro", lift working occasionally.',
    text: `টু-লেট / TO-LET
মিরপুর-১০ গোলচত্বর এর সন্নিকটে (মেট্রোরেল স্টেশন থেকে মাত্র ৫ মিনিট এর হাঁটা পথ)।
৭ম তলার ছাদে মনোরম খোলামেলা ১ রুমের ব্যাচেলর মেস/সাবলেট।
চমৎকার নির্মল বাতাস, আলো-বাতাস পূর্ণ। সার্বক্ষণিক ওয়াসা ও বিদ্যুৎ।
শান্তিপূর্ণ পারিবারিক পরিবেশ। ধুমপান ও উচ্চ আওয়াজ সম্পূর্ণ নিষেধ।
ভাড়া: ৬৫০০ টাকা (বিল আলাদা)।
যোগাযোগ: ০১৭xxxxxxxx`,
  },
  {
    id: 'mohammadpur-bosila-flat',
    title: 'Mohammadpur Bosila VIP Riverside Bachelor Sublet',
    area: 'Mohammadpur Bosila',
    badge: '🚩 Red Alert',
    rent: '5,000 BDT',
    description: 'Water turns red after 6 PM, riverside breeze (Buriganga aroma), boat needed in July.',
    text: `TO-LET: মোহাম্মদপুর বসিলা ব্রিজ পার হয়ে নিরিবিলি মনোরম পরিবেশে ব্যাচেলর ১ সিট/সাবলেট আবশ্যক।
নতুন বিল্ডিং, টাইলস করা রুম। নদীর মিষ্টি হাওয়া। ২৪ ঘণ্টা নিজস্ব ডিপ টিউবওয়েলের পানি ও গ্যাস সিলিন্ডার সুবিধা।
দারোয়ান পাহারা ও সিসিটিভি ক্যামেরা নিয়ন্ত্রিত। রাত ১০টায় গেট তালাবদ্ধ হয়।
ভাড়া: ৫০০০ টাকা।
বিঃদ্রঃ শুধুমাত্র চাকরিজীবী অথবা শান্ত স্বভাবের বিশ্ববিদ্যালয় ছাত্র।`,
  },
  {
    id: 'farmgate-coaching-room',
    title: 'Farmgate Coaching Hub Sublet (3 Seats in 1 Room)',
    area: 'Farmgate (Indira Road)',
    badge: '💀 Chader Niche',
    rent: '4,200 BDT/seat',
    description: 'Strict 10:00 PM gate lock, 2 AM Titas gas hunting, non-stop coaching student crowd.',
    text: `ফার্মগেট ইন্দিরা রোড: বিসিএস ও ভার্সিটি ভর্তি কোচিং শিক্ষার্থীদের জন্য ১ রুমে ৩ জনের সিট খালি।
পড়ার শান্ত পরিবেশ। রাত ১০টার পর মেইন গেট বন্ধ। কোনো বন্ধু বা বহিরাগত প্রবেশ নিষিদ্ধ।
খালা দিনে ২ বেলা রান্না করে। গ্যাস সিলিন্ডার ও ওয়াইফাই বিল আলাদা।
সিট প্রতি ভাড়া: ৪২০০ টাকা।
ফোন: ০১৭১xxxxxxx`,
  },
  {
    id: 'bashundhara-scam',
    title: 'Bashundhara R/A Luxury Studio (Token Scam Alert)',
    area: 'Bashundhara R/A Block-D',
    badge: '🕵️ Bkash Advance Scam',
    rent: '9,000 BDT',
    description: 'Too good to be true studio flat. Demands 5,000 BDT Bkash advance before viewing.',
    text: `Luxury Bachelor Studio Flat in Bashundhara R/A Block D!
Fully furnished, AC attached, high-speed WiFi, geyser, microwave, private balcony with green view.
Bachelor friendly, zero restrictions, lift 24/7.
Rent: 9,000 BDT all inclusive.
Due to high demand, please send 5,000 BDT Bkash token advance to confirm your viewing schedule today! Number: 019xxxxxxxx`,
  },
  {
    id: 'badda-notun-bazar',
    title: 'Badda Notun Bazar Bachelor Mess (WASA Iron Water)',
    area: 'Badda / Notun Bazar',
    badge: '🚩 Bariwala Red Alert',
    rent: '5,500 BDT',
    description: 'WASA water iron leaves yellow hair, boat required during 20 minutes rain.',
    text: `বাড্ডা নতুন বাজার: ১ রুম ব্যাচেলর মেস।
গ্যাস সিলিন্ডার, ওয়াসা পানি ২৪ ঘণ্টা (মাঝে মাঝে একটু আয়রন আসে কিন্তু ফিল্টার আছে)।
ছাদে কাপড় শুকানোর সুবিধা। কোনো রাজনৈতিক ছেলে বা গিটারিস্ট চলবে না।
ভাড়া: ৫৫০০ টাকা। বিদ্যুৎ প্রিপেইড কার্ড।`,
  },
];

export const FAMOUS_DHAKA_BOSSES: BossPersona[] = [
  {
    bossName: 'Alhajj Abdul Kader',
    bossTitle: 'Retired Grade-9 Govt Section Officer (Mirpur 10)',
    initialApproval: 20,
    openingLine: 'হ্যালো?! সাইনবোর্ডে বাংলা ভাষায় স্পষ্ট লেখা দেখেন নাই? ব্যাচেলর হয়ে এই নম্বরে ফোন দিছেন কোন সাহসে? এখনই রাখি ফোন!',
    bossQuirks: [
      'Watches CCTV monitor in his drawing room 14 hours a day',
      'Locks the collapsible main gate at 10:15 PM sharp and keeps the key under his pillow',
      'Thinks any laptop user is an "illegal dark web hacker"',
    ],
    suggestedReplies: [
      'Assalamu Alaikum Uncle! Ami 46th BCS candidate, rat 9:30 tay ghumai!',
      'Uncle ami shudhu namaz pori ar pori, kono bondhu-bandhob nai Dhakay!',
      'Uncle 2 masher advance cash e dite raji achi, building er shanti nosto hobena!',
    ],
  },
  {
    bossName: 'Engr. Mofizur Rahman',
    bossTitle: 'Ex-PWD Engineer & Mohammadpur Building Owner',
    initialApproval: 15,
    openingLine: 'কে? ব্যাচেলর? শোনেন, আমার এই ৭ তলা বিল্ডিংয়ে কোনো সাউন্ড সিস্টেম, গিটার বা রাতবিরাতে ফুডপান্ডা ডেলিভারি ঢুকবে না! কি করেন আপনি?',
    bossQuirks: [
      'Charges extra 500 tk if you use a table lamp with more than 9 Watts',
      'Measures water tank height twice a day with a wooden stick',
      'Will call your father in village within 5 minutes if you laugh loud',
    ],
    suggestedReplies: [
      'Uncle ami BUET theke pass kore Govt Job er viva dicchi, acoustic sound bujhi!',
      'Assalamu Alaikum! Ami shob somoy Punjabi pori, headphone chara kichu shuni na!',
      'Uncle apnar building er shob rule ami stamp paper e sign kore dibo!',
    ],
  },
  {
    bossName: 'Haji Nurul Islam',
    bossTitle: 'Dhaka City Corporation Ex-Commissioner Cousin (Badda)',
    initialApproval: 25,
    openingLine: 'হ্যাঁ বলেন। সাইনবোর্ডে তো লেখা পরিবার। আপনি ব্যাচেলর? কয়জন থাকবেন? কোনো মেয়েমানুষ বা আত্মীয়ের আনাগোনা কিন্তু বরদাশত করা হবে না!',
    bossQuirks: [
      'Takes 3 passport size photos and police verification form before giving gate key',
      'Checks electricity meter with a magnifying glass on 1st of every month',
      'Asks if you can recite Surah Yaseen during flat interview',
    ],
    suggestedReplies: [
      'Uncle ami eka thakbo, shudhu office ar masjid, kono meye toh durer kotha machi-o dhukbe na!',
      'Assalamu Alaikum Haji Shaheb! Ami purno poribashito hobar jonnoi eka thaki!',
      'Uncle advance rent shathe shathe nite paren, amar chakorir ID card niye ashbo!',
    ],
  },
];

export const DHAKA_AREAS_SURVIVAL = [
  {
    area: 'Mirpur (1, 2, 10, 11, 14)',
    riskLevel: 'HIGH',
    metroFactor: 'Metro available, but landlords raised rent 40% claiming "Metro view"',
    wasaStatus: 'Water smells like rusty pipe in summer; muddy in monsoon',
    gateLockTime: '10:30 PM sharp',
    titasGasStatus: 'Low pressure 7 AM - 11 AM; egg fry requires meditation',
  },
  {
    area: 'Mohammadpur & Bosila',
    riskLevel: 'EXTREME',
    metroFactor: 'Far from Metro; Rickshaw jam at Town Hall is 45 mins',
    wasaStatus: 'Deep tube-well water contains enough iron to manufacture spoons',
    gateLockTime: '10:00 PM',
    titasGasStatus: 'Gas goes away on Tuesdays and rainy days for spiritual contemplation',
  },
  {
    area: 'Farmgate & Indira Road',
    riskLevel: 'LEGENDARY HAZARD',
    metroFactor: 'Metro Farmgate station walking distance, but pedestrian bridge jam',
    wasaStatus: 'Yellowish water; filter replacement needed every 2 weeks',
    gateLockTime: '10:00 PM (Darowan demands 50 tk cha money after 10:01 PM)',
    titasGasStatus: 'LPG Cylinder mafia reigns supreme',
  },
  {
    area: 'Badda & Rampura',
    riskLevel: 'HIGH',
    metroFactor: 'No Metro; Pragati Sarani jam tests patience and lung capacity',
    wasaStatus: 'Seasonal drainage aroma mixed with WASA line',
    gateLockTime: '11:00 PM',
    titasGasStatus: 'Cylinder gas only; 3rd floor carrying fee +100 tk',
  },
  {
    area: 'Uttara (Sectors 1-14)',
    riskLevel: 'MODERATE',
    metroFactor: 'Direct Metro connection; but Darowan checks bachelor bags',
    wasaStatus: 'Cleanest in Dhaka, but service charge is equal to apartment rent',
    gateLockTime: '11:30 PM',
    titasGasStatus: 'Reasonable, but prepaid meter drains like a sports car',
  },
  {
    area: 'Bashundhara R/A',
    riskLevel: 'SCAM CAPITAL',
    metroFactor: 'No Metro; 300 Feet traffic; Rickshaw fare inside gate is 80 tk minimum',
    wasaStatus: 'Good water, but 85% of bachelor To-Let posts on Facebook are Bkash scams',
    gateLockTime: '12:00 AM (Pocket gate open if guard is bribed)',
    titasGasStatus: 'Mostly LPG, central kitchen',
  },
];
