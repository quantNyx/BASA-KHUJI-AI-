import React, { useState } from 'react';
import { DHAKA_AREAS_SURVIVAL } from '../presets';
import { Calculator, Flame, MapPin, ShieldAlert, Award, Compass, DollarSign, Droplets, Clock } from 'lucide-react';
import { playRickshawBell } from '../utils/audio';

export const DhakaSurvivalGuide: React.FC = () => {
  // Interactive Calculator State
  const [baseRent, setBaseRent] = useState<number>(6500);
  const [floorType, setFloorType] = useState<'chader_niche' | 'mid_floor' | 'ground_water'>(
    'chader_niche'
  );
  const [metroDistanceKm, setMetroDistanceKm] = useState<number>(2.5);
  const [khalaMoodBonus, setKhalaMoodBonus] = useState<number>(600);
  const [darowanBribeLateCount, setDarowanBribeLateCount] = useState<number>(8);
  const [wasaFilterReplacements, setWasaFilterReplacements] = useState<number>(2);

  // Calculate Extra Hidden Taxes
  const rickshawMetroCost = Math.round(metroDistanceKm * 35 * 30); // 35 tk rickshaw each way, 30 days
  const heatCoolerTax =
    floorType === 'chader_niche' ? 1200 : floorType === 'ground_water' ? 300 : 600;
  const darowanBribeTotal = darowanBribeLateCount * 50; // 50 tk cha-paan bribe per late gate open
  const wasaFilterTotal = wasaFilterReplacements * 450; // 450 tk per candle cartridge

  const totalHiddenTax =
    rickshawMetroCost + heatCoolerTax + khalaMoodBonus + darowanBribeTotal + wasaFilterTotal;
  const totalMonthlyBurn = baseRent + totalHiddenTax;

  const commandments = [
    {
      num: '১',
      title: 'The Pillow Key Test',
      bangla: 'মেইন গেটের চাবি কার কাছে থাকে?',
      desc: 'Always ask Uncle where the main gate key is kept at night. If Uncle looks at his drawing room bed and taps his pillow, RUN. You will never see Dhaka nightlife again.',
    },
    {
      num: '২',
      title: 'The Hypersonic Metro Lie',
      bangla: 'মেট্রো স্টেশন থেকে মাত্র ৫ মিনিট!',
      desc: 'In Dhaka landlord physics, "5 minutes from Metro" is measured by a supersonic jet flying in a straight line. In reality, it is 2.8 km of broken pavement, rickshaw gridlock, and open drain puddles.',
    },
    {
      num: '৩',
      title: 'The 2 PM Ceiling Thermometer',
      bangla: 'ছাদের নিচের মনোরম হাওয়া',
      desc: 'Never view a top-floor flat at 6 PM. Visit at 2:15 PM in May. If you can boil an egg on the bed sheet, understand that your summer fan will blow air straight from a tandoori oven.',
    },
    {
      num: '৪',
      title: 'The BCS Punjabi Disguise',
      bangla: 'বিসিএস পরীক্ষার্থী ছাড়া বাসা দেওয়া হয় না!',
      desc: 'Wear a crisp white Punjabi, oil your hair neatly, and hold a thick 46th BCS MP3 General Knowledge guide in your left hand. Uncle will melt faster than butter on warm naan.',
    },
    {
      num: '৫',
      title: 'The WASA Rust Water Litmus Test',
      bangla: 'আমাদের নিজস্ব ডিপের পরিষ্কার পানি!',
      desc: 'Turn on the bathroom tap during viewing. If the water has the rich aroma of old railway tracks and turns your fingernails orange, add 1,500 BDT for water filter candles.',
    },
    {
      num: '৬',
      title: 'The Bkash Token Advance Scam',
      bangla: 'আগে ৫০০০ টাকা বিকাশ করে সিরিয়াল বুক করুন!',
      desc: 'If any Facebook post offers an AC studio flat in Bashundhara or Dhanmondi for 8,000 BDT and asks for a Bkash token advance before viewing, that flat does not exist on planet Earth.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Interactive Bachelor Tax Calculator */}
      <div className="bg-white rounded-2xl border-4 border-amber-500 shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-dashed border-amber-300 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-2xl shadow">
              🧮
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Dhaka Bachelor Tax Simulator
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600">
                Adjust the sliders to see what your "cheap" flat will ACTUALLY cost per month!
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 text-amber-300 px-4 py-2 rounded-xl text-right">
            <div className="text-[10px] uppercase font-bold text-zinc-400">Total Real Damage</div>
            <div className="text-2xl font-black">{totalMonthlyBurn.toLocaleString()} BDT</div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Base Rent */}
          <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Advertised Rent:
              </span>
              <span className="text-sm font-black text-emerald-700">
                {baseRent.toLocaleString()} BDT
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="25000"
              step="500"
              value={baseRent}
              onChange={(e) => setBaseRent(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500">What Uncle wrote on the yellow sign</span>
          </div>

          {/* Floor Level */}
          <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                Floor & Heat Level:
              </span>
              <span className="text-xs font-black text-red-600">+{heatCoolerTax} BDT Bill</span>
            </div>
            <select
              value={floorType}
              onChange={(e) => setFloorType(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-zinc-300 text-xs font-semibold bg-white"
            >
              <option value="chader_niche">💀 7th Floor "Chader Niche" Tandoori Oven (+1,200)</option>
              <option value="mid_floor">🏢 3rd-4th Floor Standard Concrete (+600)</option>
              <option value="ground_water">🐸 Ground Floor Monsoon Lake / Mosquito Hub (+300)</option>
            </select>
            <span className="text-[10px] text-zinc-500">Extra fan / cooling / mosquito repellent bill</span>
          </div>

          {/* Metro Distance Lie */}
          <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Real Metro Distance:
              </span>
              <span className="text-xs font-black text-blue-700">
                +{rickshawMetroCost.toLocaleString()} BDT / mo
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.2"
              value={metroDistanceKm}
              onChange={(e) => setMetroDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500">
              {metroDistanceKm} km = ~{Math.round(metroDistanceKm * 35)} tk daily rickshaw fare
            </span>
          </div>

          {/* Khala's Mood Swing Bonus */}
          <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5">
                🍲 Khala's Mood Bonus:
              </span>
              <span className="text-xs font-black text-amber-700">+{khalaMoodBonus} BDT</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={khalaMoodBonus}
              onChange={(e) => setKhalaMoodBonus(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500">So Khala doesn't put raw turmeric in daal</span>
          </div>

          {/* Darowan Late Gate Night Bribes */}
          <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-700" />
                Late Gate Openings:
              </span>
              <span className="text-xs font-black text-zinc-900">+{darowanBribeTotal} BDT</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={darowanBribeLateCount}
              onChange={(e) => setDarowanBribeLateCount(parseInt(e.target.value, 10))}
              className="w-full accent-zinc-700 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500">
              {darowanBribeLateCount} times entering after 10:15 PM (50 tk cha money each)
            </span>
          </div>

          {/* WASA Iron Filter Replacements */}
          <div className="space-y-2 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                WASA Filter Cartridges:
              </span>
              <span className="text-xs font-black text-cyan-700">+{wasaFilterTotal} BDT</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={wasaFilterReplacements}
              onChange={(e) => setWasaFilterReplacements(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500">
              {wasaFilterReplacements} filter candles required for red/iron tap water
            </span>
          </div>
        </div>

        {/* Comparison Result Box */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-500 via-amber-500 to-red-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Advertised vs. Reality Gap:
            </div>
            <div className="text-lg sm:text-xl font-black mt-0.5">
              You thought you'd pay {baseRent.toLocaleString()} BDT, but you will bleed{' '}
              {totalMonthlyBurn.toLocaleString()} BDT!
            </div>
          </div>
          <div className="text-sm font-extrabold bg-black/40 px-4 py-2 rounded-xl border border-white/20 self-start sm:self-auto shrink-0">
            Hidden Tax: +{totalHiddenTax.toLocaleString()} BDT / month
          </div>
        </div>
      </div>

      {/* Dhaka Neighborhood Danger Index */}
      <div className="bg-zinc-950 text-white rounded-2xl border-4 border-zinc-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 pb-6 border-b border-zinc-800">
          <span className="text-3xl">🗺️</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
              Dhaka Neighborhood Bachelor Danger Index
            </h2>
            <p className="text-xs text-zinc-400">
              Field reports collected from 10 years of suffering across major Dhaka hubs.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DHAKA_AREAS_SURVIVAL.map((area, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 p-4 rounded-xl flex flex-col justify-between space-y-3 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-white text-base">{area.area}</h3>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      area.riskLevel.includes('LEGENDARY') || area.riskLevel.includes('SCAM')
                        ? 'bg-purple-950 text-purple-300 border border-purple-500'
                        : area.riskLevel.includes('EXTREME')
                        ? 'bg-red-950 text-red-300 border border-red-500'
                        : 'bg-amber-950 text-amber-300 border border-amber-500'
                    }`}
                  >
                    {area.riskLevel}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-500 font-bold block uppercase text-[10px]">
                      🚇 Metro Factor:
                    </span>
                    <span className="text-zinc-300 font-medium">{area.metroFactor}</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 font-bold block uppercase text-[10px]">
                      💧 WASA Water:
                    </span>
                    <span className="text-zinc-300 font-medium">{area.wasaStatus}</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 font-bold block uppercase text-[10px]">
                      🔥 Titas Gas Reality:
                    </span>
                    <span className="text-zinc-300 font-medium">{area.titasGasStatus}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-[11px] font-bold text-amber-400 flex items-center justify-between">
                <span>Gate Lock Time:</span>
                <span>{area.gateLockTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Commandments of Dhaka Bachelor Mess Survival */}
      <div className="bg-gradient-to-br from-emerald-950 via-zinc-900 to-amber-950 text-white rounded-2xl border-4 border-emerald-500 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 pb-6 border-b border-emerald-800">
          <span className="text-3xl">📜</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-300 tracking-tight">
              The 6 Commandments of Dhaka House Hunting
            </h2>
            <p className="text-xs text-zinc-300">
              Sacred rules every student and job holder must memorize before calling any Bariwala.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commandments.map((c) => (
            <div
              key={c.num}
              className="bg-black/50 border border-emerald-500/40 p-4 rounded-xl space-y-2 relative"
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-400 text-zinc-950 font-black text-sm flex items-center justify-center">
                  {c.num}
                </span>
                <div>
                  <h4 className="font-extrabold text-white text-sm">{c.title}</h4>
                  <span className="text-[11px] text-amber-300 font-bold block">{c.bangla}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
