import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Heart, Share2, Grid, RotateCcw, LayoutTemplate, Clipboard, Check, Type, Play, Pause, Clock } from 'lucide-react';

interface QuoteDisplayProps {
  text: string;
  author: string;
  category?: string;
  isLoading: boolean;
  onCopy: () => void;
  copied: boolean;
  layoutMode: 'horizontal' | 'vertical';
  onChangeLayout: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isPlayingSpeech: boolean;
  onToggleSpeech: () => void;
  onOpenPoster: () => void;
  serifFont: 'serif' | 'sans';
  onChangeFont: () => void;
  isZenPlayActive: boolean;
  onToggleZen: () => void;
  showClock: boolean;
  onToggleClock: () => void;
}

export function QuoteDisplay({
  text,
  author,
  category,
  isLoading,
  onCopy,
  copied,
  layoutMode,
  onChangeLayout,
  isFavorite,
  onToggleFavorite,
  isPlayingSpeech,
  onToggleSpeech,
  onOpenPoster,
  serifFont,
  onChangeFont,
  isZenPlayActive,
  onToggleZen,
  showClock,
  onToggleClock,
}: QuoteDisplayProps) {
  const chars = text ? text.split('') : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: 0.3 }
    }
  };

  const charVariants = {
    hidden: { opacity: 0, y: layoutMode === 'vertical' ? -12 : 12, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[55vh] w-full max-w-4xl mx-auto py-6">
      <AnimatePresence mode="wait">
        {!isLoading && text && (
          <motion.div
            key={`${text}-${layoutMode}-${serifFont}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col items-center gap-10 relative z-10 w-full"
          >
            {/* Main Interactive Aesthetic Canvas Card */}
            <div className="relative w-full flex items-center justify-center">
              
              {layoutMode === 'horizontal' ? (
                /* HORIZONTAL LAYOUT */
                <div className="relative text-center w-full px-12 md:px-24">
                  {/* Classical Chinese Quote Brackets */}
                  <span className="absolute -left-2 md:-left-12 -top-14 text-7xl md:text-8xl text-black/5 dark:text-white/10 font-sans pointer-events-none select-none font-light">
                    『
                  </span>
                  
                  <h1 className={`text-3xl md:text-4xl lg:text-4xl leading-[2] md:leading-[2.2] font-light tracking-widest max-w-3xl mx-auto flex flex-wrap justify-center text-zinc-900 dark:text-zinc-100 ${serifFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
                    {chars.map((char, i) => (
                      <motion.span key={i} variants={charVariants} className="inline-block relative px-[1px] md:px-[2px]">
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}
                  </h1>

                  <span className="absolute -right-2 md:-right-12 -bottom-14 text-7xl md:text-8xl text-black/5 dark:text-white/10 font-sans pointer-events-none select-none font-light">
                    』
                  </span>

                  {/* Horizontal Author and Divider */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.max(0.4, chars.length * 0.03 + 0.2), duration: 0.8 }}
                    className="mt-16 flex flex-col items-center gap-2 w-full"
                  >
                    <div className="h-[1px] w-12 bg-black/10 dark:bg-white/20 mb-6 max-w-full"></div>
                    <p className={`text-xs uppercase tracking-[0.5em] text-black/40 dark:text-white/40 mt-1 opacity-80 hover:opacity-100 transition-opacity ml-[0.5em] ${serifFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
                      {author || 'Anonymous'}
                    </p>
                  </motion.div>
                </div>
              ) : (
                /* VERTICAL CALLIGRAPHY LAYOUT */
                <div className="relative flex flex-col items-center justify-center w-full min-h-[46vh]">
                  <div className="flex flex-row-reverse items-center justify-center gap-8 md:gap-14 h-full max-h-[50vh] relative">
                    
                    {/* Vertically Scrolling Characters Block with inline Brackets to preserve traditional layout orientation */}
                    <div className={`relative [writing-mode:vertical-rl] [text-orientation:upright] text-2xl md:text-3.5xl leading-[2.6] md:leading-[2.8] font-light tracking-[0.3em] text-zinc-900 dark:text-zinc-50 max-h-[42vh] overflow-visible text-left py-4 px-6 md:px-8 ${serifFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
                      {/* Opening Bracket inside flow */}
                      <span className="text-black/10 dark:text-white/20 text-3xl mb-4 pointer-events-none select-none inline-block font-sans">『</span>
                      
                      {chars.map((char, i) => (
                        <motion.span key={i} variants={charVariants} className="inline-block relative py-[1px] md:py-[2px]">
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}

                      {/* Closing Bracket inside flow */}
                      <span className="text-black/10 dark:text-white/20 text-3xl mt-4 pointer-events-none select-none inline-block font-sans">』</span>
                    </div>

                    {/* Vertical Divider */}
                    <motion.div 
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="w-[1px] h-32 bg-black/10 dark:bg-white/20 origin-top self-center"
                    ></motion.div>

                    {/* Vertical Author Column */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.max(0.4, chars.length * 0.03 + 0.2), duration: 0.8 }}
                      className={`[writing-mode:vertical-rl] [text-orientation:upright] text-xs uppercase tracking-[0.5em] text-black/40 dark:text-white/40 self-center leading-none mt-4 opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap ${serifFont === 'serif' ? 'font-serif' : 'font-sans'}`}
                    >
                      {author || 'Anonymous'}
                    </motion.div>

                  </div>
                </div>
              )}
            </div>

            {/* Float Menu Core Actions */}
            {!isZenPlayActive && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.max(0.6, chars.length * 0.02), duration: 0.6 }}
                className="flex items-center justify-center gap-3 backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 py-2 px-4 rounded-full shadow-lg z-20"
              >
                {/* Zen Auto Play companion toggle */}
                <button
                  onClick={onToggleZen}
                  className="p-2.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 relative"
                  title="开启禅意半眠流转"
                >
                  <Play className="w-4 h-4" />
                </button>

                {/* Clock Toggle */}
                <button
                  onClick={onToggleClock}
                  className={`p-2.5 rounded-full transition-all duration-300 relative ${showClock ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title={showClock ? "隐藏雅致时钟" : "显示雅致时钟"}
                >
                  <Clock className="w-4 h-4" />
                </button>

                {/* TTS Sound player action */}
                <button
                  onClick={onToggleSpeech}
                  className={`p-2.5 rounded-full transition-all duration-300 relative ${isPlayingSpeech ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title="声临其境 - 朗读"
                >
                  {isPlayingSpeech ? (
                    <div className="flex items-center gap-1 px-1">
                      <span className="w-[3px] h-4 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '600ms' }}></span>
                      <span className="w-[3px] h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '600ms' }}></span>
                      <span className="w-[3px] h-5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '600ms' }}></span>
                    </div>
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Layout Switcher (Vertical / Horizontal) */}
                <button
                  onClick={onChangeLayout}
                  className={`p-2.5 rounded-full transition-all duration-300 ${layoutMode === 'vertical' ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title={layoutMode === 'vertical' ? "横排排版" : "古风竖排"}
                >
                  <LayoutTemplate className="w-4 h-4" />
                </button>

                {/* Typography Font Switcher */}
                <button
                  onClick={onChangeFont}
                  className={`p-2.5 rounded-full transition-all duration-300 ${serifFont === 'sans' ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title={serifFont === 'serif' ? "极简黑体 (Sans-serif)" : "古风宋体 (Serif)"}
                >
                  <Type className="w-4 h-4" />
                </button>

                {/* Heart Favorite button */}
                <button
                  onClick={onToggleFavorite}
                  className={`p-2.5 rounded-full transition-all duration-300 ${isFavorite ? 'text-red-500 bg-red-500/10 scale-110' : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title="收藏此作"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Poster generation share icon */}
                <button
                  onClick={onOpenPoster}
                  className="p-2.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                  title="生成诗签卡片"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Custom copy icon */}
                <button
                  onClick={onCopy}
                  className={`p-2.5 rounded-full transition-all duration-300 ${copied ? 'text-green-500 bg-green-500/10' : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                  title="复制整段"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 min-h-[300px]">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-400 rounded-full"
          />
        </div>
      )}
    </div>
  );
}
