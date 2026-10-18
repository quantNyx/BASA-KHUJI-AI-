import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, FileText, X, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { DHAKA_PRESETS } from '../presets';
import { PresetListing } from '../types';
import { playRickshawBell, playPhoneRing } from '../utils/audio';

interface ToLetDecoderProps {
  onAnalyze: (text: string, imageBase64: string | null, areaHint?: string) => void;
  isLoading: boolean;
}

export const ToLetDecoder: React.FC<ToLetDecoderProps> = ({ onAnalyze, isLoading }) => {
  const [listingText, setListingText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [areaHint, setAreaHint] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Loading joke rotator
  const loadingJokes = [
    'Measuring WASA water iron content with virtual litmus paper...',
    'Exposing "5 minutes to Metro" (actually 2.8 km in waterlogged rickshaw)...',
    'Calculating Khala\'s sudden mood-swing fish head bonus...',
    'Testing if 7th-floor Chader Niche ceiling can fry an egg at 2 PM...',
    'Checking Darowan 10:15 PM gate lock penalty tariff...',
    'Detecting Bkash 5,000 tk advance token scam frequency...',
  ];
  const [jokeIndex, setJokeIndex] = useState(0);

  React.useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % loadingJokes.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Could not access camera. Please upload an image or paste listing text.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
    }
    stopCamera();
    playRickshawBell();
  };

  const handleLoadPreset = (preset: PresetListing) => {
    setListingText(preset.text);
    setAreaHint(preset.area);
    setImagePreview(null);
    playRickshawBell();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingText.trim() && !imagePreview) {
      alert('Please enter a To-Let listing description or upload a photo of the sign!');
      return;
    }
    playPhoneRing();
    onAnalyze(listingText, imagePreview, areaHint);
  };

  return (
    <div className="space-y-6">
      {/* Dhaka To-Let Noticeboard Frame */}
      <div className="relative bg-amber-50 rounded-2xl border-4 border-amber-500 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Tape strips on corners for authentic Dhaka wall poster look */}
        <div className="absolute -top-3 -left-3 w-16 h-8 bg-zinc-300/80 rotate-[-25deg] shadow-sm border border-zinc-400 pointer-events-none" />
        <div className="absolute -top-3 -right-3 w-16 h-8 bg-zinc-300/80 rotate-[25deg] shadow-sm border border-zinc-400 pointer-events-none" />

        {/* Noticeboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b-2 border-dashed border-amber-300 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-extrabold text-sm sm:text-base px-3 py-1 rounded shadow">
                টু-লেট / TO-LET
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Dhaka Reality Decoder
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              Upload a sign photo or paste any flat/mess ad to uncover the hidden traps before giving advance!
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              100% Honest Dhaka Translation
            </span>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Or Try a Classic Dhaka Bachelor Nightmare Preset:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {DHAKA_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleLoadPreset(p)}
                className="text-left p-2.5 rounded-xl border border-amber-200 bg-white/90 hover:bg-amber-100 hover:border-amber-400 transition group shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="text-xs font-bold text-zinc-900 group-hover:text-amber-900 line-clamp-1">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 shrink-0">
                    {p.badge}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1.5">
                  <span className="text-emerald-700 font-semibold">{p.rent}</span>
                  <span className="text-zinc-400 group-hover:text-amber-700 flex items-center gap-0.5 font-medium">
                    Load <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Media Capture / Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-red-600" />
                To-Let Sign Photo (Optional but Recommended)
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> Remove Image
                </button>
              )}
            </div>

            {/* Camera Viewfinder */}
            {isCameraActive ? (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-72 flex flex-col items-center justify-center border-2 border-amber-400">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 border-2 border-white"
                  >
                    <Camera className="w-4 h-4" /> Snap Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-200 text-sm font-semibold hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              /* Image Preview Box */
              <div className="relative rounded-xl overflow-hidden border-2 border-amber-400 bg-zinc-900 max-h-60 flex items-center justify-center shadow-inner group">
                <img src={imagePreview} alt="To-Let Sign" className="max-h-60 object-contain w-auto mx-auto" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="bg-red-600 text-white p-1.5 rounded-lg shadow hover:bg-red-700"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition ${
                  dragOver
                    ? 'border-red-500 bg-red-50/50'
                    : 'border-amber-300 bg-amber-100/40 hover:bg-amber-100/80 hover:border-amber-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-white border border-amber-300 text-zinc-800 font-bold text-xs hover:bg-amber-50 hover:border-amber-400 transition shadow-sm flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-amber-700" />
                      Upload Sign Photo
                    </button>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Take Live Photo
                    </button>
                  </div>
                  <span className="text-xs text-zinc-500">or drag & drop paper notice photo here</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                To-Let Ad Text / Facebook Post / Bikroy Description
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">Bangla, Banglish, or English</span>
            </div>
            <textarea
              rows={4}
              value={listingText}
              onChange={(e) => setListingText(e.target.value)}
              placeholder="Paste listing text e.g.: 'মিরপুর ১০ এ মনোরম পরিবেশে ছাদের উপর ১ রুম সাবলেট। মেট্রো স্টেশন থেকে ৫ মিনিট। ভাড়া ৬৫০০ টাকা...'"
              className="w-full p-3.5 rounded-xl border-2 border-amber-300 bg-white text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-sans shadow-inner"
            />
          </div>

          {/* Area Hint (Optional) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                Dhaka Neighborhood (Optional Hint)
              </label>
              <input
                type="text"
                value={areaHint}
                onChange={(e) => setAreaHint(e.target.value)}
                placeholder="e.g. Mirpur-10, Mohammadpur Bosila, Farmgate, Badda, Uttara..."
                className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Submit Button */}
            <div className="sm:self-end">
              <button
                type="submit"
                disabled={isLoading || (!listingText.trim() && !imagePreview)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95 transition"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Decoding Dhaka Reality...</span>
                  </>
                ) : (
                  <>
                    <span>🚨 Decode Dhaka Reality Report</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Loading Spinner with Cycling Jokes */}
        {isLoading && (
          <div className="mt-6 p-4 rounded-xl bg-amber-100 border border-amber-300 flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              🕵️
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">Basa Khuji AI Street Veteran at Work:</p>
              <p className="text-xs text-zinc-700 font-medium italic mt-0.5">
                "{loadingJokes[jokeIndex]}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
