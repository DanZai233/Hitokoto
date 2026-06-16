import React, { useState, useEffect, useCallback } from 'react';
import { QuoteDisplay } from '../components/QuoteDisplay';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from '../types';

const CATEGORIES = [
  { id: 'all', label: '全部 / All' },
  { id: 'anime', label: '二次元 / Anime' },
  { id: 'literature', label: '文学 / Literature' },
  { id: 'philosophy', label: '哲思 / Philosophy' },
  { id: 'movie', label: '影视 / Movie' },
  { id: 'game', label: '游戏 / Game' },
  { id: 'music', label: '音乐 / Music' },
  { id: 'internet', label: '网生 / Internet' },
];

export function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState('all');
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchQuote = useCallback(async (cat: string = category) => {
    setLoading(true);
    try {
      // First try our own API endpoint designed for developers
      const res = await fetch(`/api/random?category=${cat}`);
      if (res.ok) {
        const data = await res.json();
        setQuote(data);
      } else {
        // Fallback for empty state or error
        setQuote({
          id: '1',
          text: '纵使日薄西山，也要活得灿烂',
          author: '末日时在做什么？有没有空？可以来拯救吗？',
          category: 'anime',
          status: 'approved',
          submitterId: 'system',
          createdAt: Date.now()
        });
      }
    } catch (e) {
      console.error(e);
      // Hardcoded fallback on error
      setQuote({
        id: 'error',
        text: '万物皆有裂痕，那是光照进来的地方。',
        author: '莱昂纳德·科恩',
        category: 'music',
        status: 'approved',
        submitterId: 'system',
        createdAt: Date.now()
      });
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchQuote(category);
  }, [fetchQuote, category]);

  const handleCopy = useCallback(() => {
    if (!quote) return;
    navigator.clipboard.writeText(`${quote.text} —— ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [quote]);

  // Determine label for current category
  const currentCategoryLabel = CATEGORIES.find(c => c.id === category)?.label.split(' / ')[0] || '全部';

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative min-h-screen">
      <div className="w-full flex-1 flex flex-col items-center justify-center px-12 md:px-24">
        <QuoteDisplay 
          text={quote?.text || ''} 
          author={quote?.author || ''} 
          isLoading={loading}
          onCopy={handleCopy}
          copied={copied}
        />
      </div>

      {/* Footer Controls */}
      <footer className="p-12 mb-8 flex flex-col items-center gap-8 z-10 w-full relative">
        {/* Category Menu & Refresh Button Container */}
        <div 
          className="relative flex flex-col items-center justify-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <AnimatePresence>
            {(isHovering || isMenuOpen) && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-6 w-48 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-2xl rounded-2xl p-2 z-50 flex flex-col gap-1"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCategory(c.id);
                      setIsMenuOpen(false);
                      setIsHovering(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-xs tracking-widest text-left transition-all ${category === c.id ? 'bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Category Badge (Visual Cue) */}
          <div className="absolute -top-8 text-[10px] tracking-widest uppercase font-sans text-black/30 dark:text-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {currentCategoryLabel}
          </div>

          <button 
            className="group relative flex items-center justify-center w-16 h-16 rounded-full border border-black/10 dark:border-white/10 hover:border-black/40 dark:hover:border-white/40 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fetchQuote(category)}
            disabled={loading}
            aria-label="换一句"
          >
            <div className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 group-hover:scale-110 transition-transform pointer-events-none"></div>
            <svg 
              className={`w-6 h-6 opacity-60 group-hover:rotate-180 transition-transform duration-700 pointer-events-none ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span className="absolute -bottom-6 text-[10px] tracking-[0.3em] font-sans opacity-0 group-hover:opacity-50 transition-opacity">
              {currentCategoryLabel}
            </span>
          </button>
        </div>

        {/* Quick Stats & Switcher */}
        <div className="hidden md:flex gap-12 text-xs font-sans tracking-widest text-black/40 dark:text-white/30">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            系统运转良好
          </div>
        </div>
      </footer>
    </div>
  );
}
