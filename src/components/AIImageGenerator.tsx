import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, RefreshCw, CheckCircle, Loader2, Lightbulb, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';

interface AIImageGeneratorProps {
  onClose: () => void;
  onUseImage: (base64: string) => void;
  language?: 'ar' | 'en';
  propertyType?: string;
}

const PROMPT_SUGGESTIONS = {
  ar: [
    { label: 'فيلا فاخرة', prompt: 'Luxurious modern villa with swimming pool, landscaped garden, elegant architecture, Saudi Arabia, sunny day, photorealistic' },
    { label: 'شقة عصرية', prompt: 'Modern luxury apartment interior with floor-to-ceiling windows, elegant furniture, city view, warm lighting, photorealistic' },
    { label: 'مكتب تجاري', prompt: 'Modern corporate office space, open plan, glass walls, contemporary furniture, professional, bright lighting, photorealistic' },
    { label: 'واجهة عقار', prompt: 'Elegant residential building facade, modern architecture, clean exterior, landscaping, Saudi Arabia, blue sky, photorealistic' },
    { label: 'صالون معيشة', prompt: 'Luxurious living room, high ceiling, modern Arabic interior design, warm colors, elegant furniture, natural light, photorealistic' },
    { label: 'مطبخ مودرن', prompt: 'Modern gourmet kitchen, marble countertops, high-end appliances, clean design, warm lighting, photorealistic' },
    { label: 'غرفة نوم', prompt: 'Elegant master bedroom, minimalist design, neutral tones, soft lighting, luxury bedding, walk-in closet view, photorealistic' },
    { label: 'حوش خارجي', prompt: 'Beautiful Saudi home courtyard, traditional Arabic architecture, fountain, palm trees, marble floors, sunset lighting, photorealistic' },
  ],
  en: [
    { label: 'Luxury Villa', prompt: 'Luxurious modern villa with swimming pool, landscaped garden, elegant architecture, Saudi Arabia, sunny day, photorealistic' },
    { label: 'Modern Apartment', prompt: 'Modern luxury apartment interior with floor-to-ceiling windows, elegant furniture, city view, warm lighting, photorealistic' },
    { label: 'Office Space', prompt: 'Modern corporate office space, open plan, glass walls, contemporary furniture, professional, bright lighting, photorealistic' },
    { label: 'Building Exterior', prompt: 'Elegant residential building facade, modern architecture, clean exterior, landscaping, Saudi Arabia, blue sky, photorealistic' },
    { label: 'Living Room', prompt: 'Luxurious living room, high ceiling, modern Arabic interior design, warm colors, elegant furniture, natural light, photorealistic' },
    { label: 'Modern Kitchen', prompt: 'Modern gourmet kitchen, marble countertops, high-end appliances, clean design, warm lighting, photorealistic' },
    { label: 'Master Bedroom', prompt: 'Elegant master bedroom, minimalist design, neutral tones, soft lighting, luxury bedding, walk-in closet view, photorealistic' },
    { label: 'Outdoor Courtyard', prompt: 'Beautiful Saudi home courtyard, traditional Arabic architecture, fountain, palm trees, marble floors, sunset lighting, photorealistic' },
  ]
};

export default function AIImageGenerator({ onClose, onUseImage, language = 'en', propertyType }: AIImageGeneratorProps) {
  const isAr = language === 'ar';
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [usedImage, setUsedImage] = useState(false);

  const suggestions = PROMPT_SUGGESTIONS[isAr ? 'ar' : 'en'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setUsedImage(false);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      setError(err.message || (isAr ? 'حدث خطأ أثناء توليد الصورة' : 'An error occurred while generating the image'));
    } finally {
      setLoading(false);
    }
  };

  const handleUse = () => {
    if (generatedImage) {
      onUseImage(generatedImage);
      setUsedImage(true);
      setTimeout(onClose, 800);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="relative flex items-center justify-between px-6 py-5 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                <Wand2 className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isAr ? 'توليد صورة بالذكاء الاصطناعي' : 'AI Image Generator'}
                </h2>
                <p className="text-xs text-gray-400">
                  {isAr ? 'أنشئ صور احترافية لعقاراتك' : 'Generate professional property images'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {isAr ? 'وصف الصورة المطلوبة' : 'Describe your image'}
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate(); }}
                  placeholder={isAr
                    ? 'مثال: فيلا فاخرة بمسبح وحديقة، معمار عصري، إضاءة طبيعية دافئة...'
                    : 'e.g. Luxurious villa with pool and garden, modern architecture, warm natural lighting...'}
                  className="w-full rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none px-4 py-3 text-gray-800 placeholder-gray-400 resize-none transition-colors"
                  rows={3}
                  disabled={loading}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 select-none">
                  {isAr ? 'Ctrl+Enter للتوليد' : 'Ctrl+Enter to generate'}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <button
                type="button"
                onClick={() => setShowSuggestions(v => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-yellow-600 transition-colors mb-3"
              >
                <Lightbulb className="w-4 h-4" />
                {isAr ? 'اقتراحات سريعة' : 'Quick Suggestions'}
                {showSuggestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPrompt(s.prompt)}
                          disabled={loading}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 hover:text-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image Preview */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl overflow-hidden border-2 border-dashed border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 flex flex-col items-center justify-center gap-4 py-16"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-yellow-200 border-t-yellow-500 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-700">
                      {isAr ? 'جاري توليد الصورة...' : 'Generating your image...'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {isAr ? 'قد يستغرق ذلك بضع ثوانٍ' : 'This may take a few seconds'}
                    </p>
                  </div>
                </motion.div>
              )}

              {generatedImage && !loading && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative rounded-2xl overflow-hidden border-2 border-gray-200 group shadow-lg"
                >
                  <img
                    src={generatedImage}
                    alt="AI Generated"
                    className="w-full object-cover"
                    style={{ maxHeight: '340px', objectFit: 'cover' }}
                  />
                  {usedImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-green-500/80 flex items-center justify-center"
                    >
                      <CheckCircle className="w-16 h-16 text-white" />
                    </motion.div>
                  )}
                  {/* Image overlay tag */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5" style={{ background: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)' }}>
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    {isAr ? 'توليد ذكاء اصطناعي' : 'AI Generated'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: loading || !prompt.trim() ? '#6b7280' : 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isAr ? 'جاري التوليد...' : 'Generating...'}
                </>
              ) : generatedImage ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  {isAr ? 'توليد مرة أخرى' : 'Regenerate'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {isAr ? 'توليد الصورة' : 'Generate Image'}
                </>
              )}
            </button>

            <AnimatePresence>
              {generatedImage && !loading && !usedImage && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  type="button"
                  onClick={handleUse}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                  style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isAr ? 'استخدام هذه الصورة' : 'Use this image'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
