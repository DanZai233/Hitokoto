import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuoteDisplay } from '../components/QuoteDisplay';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from '../types';
import { 
  Heart, 
  BookOpen, 
  Trash2, 
  X, 
  Sparkles, 
  Share2, 
  Clipboard, 
  Check, 
  Bookmark, 
  Sliders, 
  Palette, 
  VolumeX, 
  Volume2, 
  Download,
  BookMarked
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'anime', label: '二次元' },
  { id: 'literature', label: '文学' },
  { id: 'philosophy', label: '哲思' },
  { id: 'movie', label: '影视' },
  { id: 'game', label: '游戏' },
  { id: 'music', label: '音乐' },
  { id: 'internet', label: '网生' },
];

const POSTER_THEMES = [
  { 
    id: 'minimal', 
    name: '素帛云纱', 
    bg: 'bg-zinc-50 border-zinc-200 text-zinc-800', 
    text: 'text-zinc-800',
    subtext: 'text-zinc-500',
    accent: 'bg-zinc-400',
    cardBg: '#fafafa',
    gradient: 'linear-gradient(135deg, #f5f5f7 0%, #e5e5ea 100%)',
    textColor: '#1c1c1e',
    subColor: '#8e8e93',
    borderColor: '#e5e5ea',
    isDark: false
  },
  { 
    id: 'ink', 
    name: '墨竹黛山', 
    bg: 'bg-zinc-900 border-zinc-800 text-zinc-100', 
    text: 'text-zinc-100',
    subtext: 'text-zinc-400',
    accent: 'bg-amber-500',
    cardBg: '#121212',
    gradient: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
    textColor: '#f4f4f5',
    subColor: '#a1a1aa',
    borderColor: '#27272a',
    isDark: true
  },
  { 
    id: 'sunset', 
    name: '秋池照落', 
    bg: 'bg-amber-50/90 border-amber-200/50 text-amber-950', 
    text: 'text-amber-955',
    subtext: 'text-amber-700/80',
    accent: 'bg-orange-400',
    cardBg: '#fef3c7',
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
    textColor: '#451a03',
    subColor: '#b45309',
    borderColor: '#fde68a',
    isDark: false
  },
  { 
    id: 'abyss', 
    name: '幽月星潭', 
    bg: 'bg-slate-900 border-slate-800 text-slate-100', 
    text: 'text-slate-100',
    subtext: 'text-slate-400',
    accent: 'bg-teal-400',
    cardBg: '#0f172a',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    textColor: '#f8fafc',
    subColor: '#38bdf8',
    borderColor: '#334155',
    isDark: true
  }
];

const getAmbientStyles = (cat: string, darkMode: boolean) => {
  if (darkMode) {
    switch (cat) {
      case 'philosophy':
        return {
          bg1: 'rgba(6, 182, 212, 0.12)', // cyan
          bg2: 'rgba(16, 185, 129, 0.08)', // emerald
          gradient: 'from-[#020617] via-[#022c22]/10 to-[#0b1329]'
        };
      case 'literature':
        return {
          bg1: 'rgba(245, 158, 11, 0.08)', // amber
          bg2: 'rgba(113, 113, 122, 0.12)', // zinc
          gradient: 'from-[#0c0a09] via-[#1c1917]/10 to-[#09090b]'
        };
      case 'anime':
        return {
          bg1: 'rgba(236, 72, 153, 0.08)', // pink
          bg2: 'rgba(139, 92, 246, 0.1)', // violet
          gradient: 'from-[#0e041c] via-[#130718]/12 to-[#04091a]'
        };
      case 'music':
        return {
          bg1: 'rgba(139, 92, 246, 0.08)',
          bg2: 'rgba(59, 130, 246, 0.1)',
          gradient: 'from-[#080214] via-[#051124]/10 to-[#020512]'
        };
      case 'movie':
        return {
          bg1: 'rgba(13, 148, 136, 0.1)',
          bg2: 'rgba(217, 119, 6, 0.08)',
          gradient: 'from-[#030f0c] via-[#100b02]/10 to-[#040b10]'
        };
      default:
        return {
          bg1: 'rgba(63, 63, 70, 0.1)',
          bg2: 'rgba(39, 39, 42, 0.1)',
          gradient: 'from-[#050505] via-[#0c0c0e]/80 to-[#040405]'
        };
    }
  } else {
    switch (cat) {
      case 'philosophy':
        return {
          bg1: 'rgba(14, 165, 233, 0.08)',
          bg2: 'rgba(16, 185, 129, 0.06)',
          gradient: 'from-[#f0f9ff] via-[#ecfdf5]/40 to-[#f0fffa]'
        };
      case 'literature':
        return {
          bg1: 'rgba(245, 158, 11, 0.07)',
          bg2: 'rgba(161, 161, 170, 0.2)',
          gradient: 'from-[#fffbeb] via-[#fafaf9]/60 to-[#fcfaf2]'
        };
      case 'anime':
        return {
          bg1: 'rgba(244, 114, 182, 0.07)',
          bg2: 'rgba(196, 181, 253, 0.1)',
          gradient: 'from-[#fff1f2] via-[#faf5ff]/45 to-[#edf5ff]'
        };
      case 'music':
        return {
          bg1: 'rgba(167, 139, 250, 0.08)',
          bg2: 'rgba(14, 165, 233, 0.08)',
          gradient: 'from-[#faf5ff] via-[#eff6ff]/50 to-[#f5f3ff]'
        };
      case 'movie':
        return {
          bg1: 'rgba(204, 251, 241, 0.3)',
          bg2: 'rgba(254, 243, 199, 0.3)',
          gradient: 'from-[#f0fdfa] via-[#fffbeb]/40 to-[#fafaf9]'
        };
      default:
        return {
          bg1: 'rgba(244, 244, 245, 0.4)',
          bg2: 'rgba(244, 244, 245, 0.2)',
          gradient: 'from-[#fafafa] via-[#f7f7f8]/40 to-[#fafafa]'
        };
    }
  }
};



export function Home() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState('all');
  
  // Custom states added for beautiful functional expansions
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [serifFont, setSerifFont] = useState<'serif' | 'sans'>('serif');
  const [isZenPlayActive, setIsZenPlayActive] = useState(false);
  const [nextQuote, setNextQuote] = useState<Quote | null>(null);
  const [zenProgress, setZenProgress] = useState(0);
  const [isZenPaused, setIsZenPaused] = useState(false);
  
  // Poster Generator Modals
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [posterTheme, setPosterTheme] = useState('minimal');
  const [posterFontSize, setPosterFontSize] = useState<number>(36);
  const [copiedPoster, setCopiedPoster] = useState(false);
  
  // Interactive UI helpers
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Clock display states with local storage config persistence
  const [showClock, setShowClock] = useState(() => {
    const saved = localStorage.getItem('hitokoto_show_clock');
    return saved !== 'false';
  });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('hitokoto_show_clock', String(showClock));
  }, [showClock]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync mode through MutationObserver
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Sync saved font
  useEffect(() => {
    const savedFont = localStorage.getItem('hitokoto_font');
    if (savedFont === 'serif' || savedFont === 'sans') {
      setSerifFont(savedFont as 'serif' | 'sans');
    }
  }, []);

  // Zen Mode fullscreen automatic toggle hook and html class config
  useEffect(() => {
    if (isZenPlayActive) {
      document.documentElement.classList.add('zen-mode-active');
      setZenProgress(0);
      setIsZenPaused(false);
    } else {
      document.documentElement.classList.remove('zen-mode-active');
    }

    const triggerFullscreen = async () => {
      try {
        if (isZenPlayActive) {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen && !document.fullscreenElement) {
            await docEl.requestFullscreen();
          }
        } else {
          if (document.fullscreenElement && document.exitFullscreen) {
            await document.exitFullscreen();
          }
        }
      } catch (err) {
        console.warn("自动全屏请求未被完全允许（可能是因为预览运行在 iframe 中），已在当前页面视口内以极简模式渲染。", err);
      }
    };

    triggerFullscreen();

    const handleFullscreenChange = () => {
      // Sync state if manually exiting fullscreen (e.g. hitting Esc)
      if (!document.fullscreenElement && isZenPlayActive) {
        // Keep active as fallback, handling safety if iframe block occurs
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.documentElement.classList.remove('zen-mode-active');
    };
  }, [isZenPlayActive]);

  const handleToggleFont = useCallback(() => {
    const nextFont = serifFont === 'serif' ? 'sans' : 'serif';
    setSerifFont(nextFont);
    localStorage.setItem('hitokoto_font', nextFont);
  }, [serifFont]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hitokoto_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    
    // Load preferred layout if any
    const savedLayout = localStorage.getItem('hitokoto_layout');
    if (savedLayout === 'vertical' || savedLayout === 'horizontal') {
      setLayoutMode(savedLayout);
    }
  }, []);

  // Cleanup TTS on unmount or quote change
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [quote]);

  const preloadNextQuote = useCallback(async (cat: string) => {
    try {
      const res = await fetch(`/api/random?category=${cat}`);
      if (res.ok) {
        const data = await res.json();
        setNextQuote(data);
      }
    } catch (e) {
      console.error("Failed to preload quote", e);
    }
  }, []);

  const fetchQuote = useCallback(async (cat: string = category) => {
    setLoading(true);
    // Stop speaking if load gets triggered
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    }

    try {
      const res = await fetch(`/api/random?category=${cat}`);
      if (res.ok) {
        const data = await res.json();
        setQuote(data);
        preloadNextQuote(cat);
      } else {
        const defaultFallback = {
          id: '1',
          text: '纵使日薄西山，也要活得灿烂',
          author: '末日时在做什么？有没有空？可以来拯救吗？',
          category: 'anime',
          status: 'approved',
          submitterId: 'system',
          createdAt: Date.now()
        };
        setQuote(defaultFallback);
        preloadNextQuote(cat);
      }
    } catch (e) {
      console.error(e);
      const errFallback = {
        id: 'error',
        text: '万物皆有裂痕，那是光照进来的地方。',
        author: '莱昂纳德·科恩',
        category: 'music',
        status: 'approved',
        submitterId: 'system',
        createdAt: Date.now()
      };
      setQuote(errFallback);
      preloadNextQuote(cat);
    } finally {
      setLoading(false);
    }
  }, [category, preloadNextQuote]);

  const switchToNextPreloaded = useCallback(() => {
    if (nextQuote) {
      setQuote(nextQuote);
      setNextQuote(null);
      setZenProgress(0);
      preloadNextQuote(category);
    } else {
      fetchQuote(category);
      setZenProgress(0);
    }
  }, [nextQuote, preloadNextQuote, category, fetchQuote]);

  useEffect(() => {
    fetchQuote(category);
    setZenProgress(0);
  }, [fetchQuote, category]);

  // Zen Mode Progress Bar Timer
  useEffect(() => {
    if (!isZenPlayActive || isZenPaused) return;

    const totalDuration = 18000; // 18 seconds
    const tickRate = 100; // 100ms
    const increment = (tickRate / totalDuration) * 100;

    const timer = setInterval(() => {
      setZenProgress((prev) => {
        if (prev >= 100) {
          switchToNextPreloaded();
          return 0;
        }
        return prev + increment;
      });
    }, tickRate);

    return () => clearInterval(timer);
  }, [isZenPlayActive, isZenPaused, switchToNextPreloaded]);

  const handleCopy = useCallback(() => {
    if (!quote) return;
    navigator.clipboard.writeText(`${quote.text} —— ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [quote]);

  // Layout mode switcher
  const handleToggleLayout = () => {
    const newLayout = layoutMode === 'horizontal' ? 'vertical' : 'horizontal';
    setLayoutMode(newLayout);
    localStorage.setItem('hitokoto_layout', newLayout);
  };

  // Heart Favorite Logic
  const isCurrentQuoteFavorite = quote ? favorites.some(f => f.text === quote.text) : false;
  
  const handleToggleFavorite = () => {
    if (!quote) return;
    let updated: Quote[];
    if (isCurrentQuoteFavorite) {
      updated = favorites.filter(f => f.text !== quote.text);
    } else {
      updated = [quote, ...favorites];
    }
    setFavorites(updated);
    localStorage.setItem('hitokoto_favorites', JSON.stringify(updated));
  };

  const handleDeleteFavorite = (txt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter(f => f.text !== txt);
    setFavorites(updated);
    localStorage.setItem('hitokoto_favorites', JSON.stringify(updated));
  };

  const handleSelectFavorite = (fav: Quote) => {
    setQuote(fav);
    setIsFavoritesOpen(false);
  };

  const handleDoubleClickBg = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('input') || 
      target.closest('select') || 
      target.closest('textarea') ||
      target.closest('#poetry-poster-card') ||
      target.closest('.fav-drawer-item') ||
      target.closest('.hud-control-panel') ||
      target.closest('.modal-content-panel') ||
      target.closest('.favorites-drawer-panel')
    ) {
      return;
    }
    
    handleToggleFavorite();
    try {
      window.getSelection()?.removeAllRanges();
    } catch (_) {}
  };

  // Text-To-Speech Play Narrator
  const handleToggleSpeech = () => {
    if (!quote) return;
    
    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${quote.text}。出自 ${quote.author}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.82; // Classical reading tempo: peaceful and slow
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      // Try to find natural sounding Chinese voice
      const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('ZH'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }
      
      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);
      
      setIsPlayingSpeech(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // SVG Poster Builder for copying elegant vector images
  const generatePosterSVGCode = () => {
    if (!quote) return '';
    const selectedTheme = POSTER_THEMES.find(t => t.id === posterTheme) || POSTER_THEMES[0];
    
    // Splitting lines for clean SVG text positioning
    const maxCharsPerLine = 12;
    const lines: string[] = [];
    for (let i = 0; i < quote.text.length; i += maxCharsPerLine) {
      lines.push(quote.text.slice(i, i + maxCharsPerLine));
    }
    
    // Calculate vertical coordinates
    const startY = 220 - (lines.length * 32) / 2;
    
    const strokeColor = selectedTheme.isDark ? '#f59e0b' : '#27272a';
    const stopColor1 = selectedTheme.isDark ? '#09090b' : '#fafafa';
    const stopColor2 = selectedTheme.isDark ? '#1f1f2e' : '#e4e4e7';
    
    const svgParts = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">',
      '  <defs>',
      '    <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">',
      "      <stop offset='0%' stop-color='" + stopColor1 + "' />",
      "      <stop offset='100%' stop-color='" + stopColor2 + "' />",
      '    </linearGradient>',
      '  </defs>',
      '  <rect width="100%" height="100%" fill="url(#gradient-bg)" />',
      "  <rect x='30' y='30' width='740' height='540' fill='none' stroke='" + selectedTheme.borderColor + "' stroke-width='1' stroke-dasharray='1 3' />",
      "  <rect x='45' y='45' width='710' height='510' fill='none' stroke='" + selectedTheme.borderColor + "' stroke-width='1.5' stroke-opacity='0.5' />",
      "  <circle cx='400' cy='300' r='160' fill='none' stroke='" + selectedTheme.borderColor + "' stroke-width='0.5' stroke-dasharray='4 8' stroke-opacity='0.3' />",
      "  <text x='140' y='160' font-family='sans-serif' font-size='80' fill='" + selectedTheme.borderColor + "' fill-opacity='0.4' font-weight='100'>『</text>",
      "  <text x='620' y='440' font-family='sans-serif' font-size='80' fill='" + selectedTheme.borderColor + "' fill-opacity='0.4' font-weight='100'>』</text>"
    ];
    
    lines.forEach((ln, idx) => {
      svgParts.push("  <text x='400' y='" + (startY + (idx * 42)) + "' font-family='serif' font-size='28' fill='" + selectedTheme.textColor + "' text-anchor='middle' letter-spacing='4' font-weight='300'>" + ln + "</text>");
    });
    
    svgParts.push("  <line x1='360' y1='" + (startY + (lines.length * 42) + 20) + "' x2='440' y2='" + (startY + (lines.length * 42) + 20) + "' stroke='" + strokeColor + "' stroke-width='1.5' stroke-opacity='0.3' />");
    svgParts.push("  <text x='400' y='" + (startY + (lines.length * 42) + 55) + "' font-family='serif' font-size='14' fill='" + selectedTheme.subColor + "' text-anchor='middle' letter-spacing='6' font-weight='300'>—— " + (quote.author || 'Anonymous') + "</text>");
    svgParts.push("  <text x='400' y='530' font-family='sans-serif' font-size='10' fill='" + selectedTheme.subColor + "' fill-opacity='0.4' text-anchor='middle' letter-spacing='3'>一言 PRO · DESIGNED BY HITOKOTO</text>");
    svgParts.push('</svg>');
    
    return svgParts.join('\n');
  };

  const handleCopyPosterSVG = () => {
    const code = generatePosterSVGCode();
    navigator.clipboard.writeText(code);
    setCopiedPoster(true);
    setTimeout(() => setCopiedPoster(false), 2000);
  };

  // Determine label for current category
  const currentCategoryLabel = CATEGORIES.find(c => c.id === category)?.label || '全部';

  const ambient = getAmbientStyles(category, isDark);

  return (
    <div 
      onDoubleClick={handleDoubleClickBg}
      className="flex-1 flex flex-col items-center justify-center relative min-h-screen"
    >
      {/* Aesthetic dynamic backgrounds with smoke gradient glow transitions - extends upwards to cover header */}
      <div className="absolute -top-32 inset-x-0 bottom-0 pointer-events-none overflow-hidden z-0 transition-all duration-1000 ease-in-out">
        {/* Ambient base layer gradient */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${ambient.gradient} transition-all duration-1000 ease-in-out`} />
        
        {/* Soft floating gradient blob 1 */}
        <motion.div
          animate={{
            x: [0, 45, -30, 0],
            y: [0, -40, 50, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ backgroundColor: ambient.bg1 }}
          className="absolute -top-[15%] left-[10%] w-[65vw] h-[65vw] rounded-full blur-[140px] transition-colors duration-1000"
        />

        {/* Soft floating gradient blob 2 */}
        <motion.div
          animate={{
            x: [0, -40, 45, 0],
            y: [0, 55, -40, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          style={{ backgroundColor: ambient.bg2 }}
          className="absolute -bottom-[15%] right-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px] transition-colors duration-1000"
        />
      </div>

      {/* Floating Header Cabinet Drawer Button for Favorites */}
      <div className={`absolute top-8 right-12 z-40 flex items-center gap-3 transition-opacity duration-1000 ${isZenPlayActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => setIsFavoritesOpen(true)}
          className="group flex items-center justify-center gap-2 border border-zinc-200 dark:border-white/5 bg-white/70 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-white/10 text-xs px-4 py-2 rounded-full cursor-pointer transition-all duration-300 shadow-sm"
          title="时光之匣 - 我的收藏"
        >
          <BookMarked className="w-3.5 h-3.5 text-zinc-500 dark:text-[#E0E0E0] group-hover:scale-110 transition-transform" />
          <span className="tracking-widest font-sans opacity-70 group-hover:opacity-100">时光之匣</span>
          {favorites.length > 0 && (
            <span className="bg-amber-500 dark:bg-amber-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono flex items-center justify-center min-w-[16px] leading-none animate-pulse">
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center px-12 md:px-24 z-10">
        {/* Floating Artistic Clock */}
        <AnimatePresence>
          {showClock && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -15 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -15 }}
              className="absolute top-20 md:top-28 left-6 md:left-12 z-30 w-28 md:w-32 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col font-sans select-none backdrop-blur-md"
            >
              {/* Upper part (Less transparent, denser frosting) */}
              <div className="bg-white/85 dark:bg-zinc-950/85 py-3 px-3 flex flex-col items-center justify-center border-b border-zinc-200/30 dark:border-white/5">
                <div className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 font-mono flex items-center justify-center">
                  {String(time.getHours()).padStart(2, '0')}
                  <span className="mx-0.5 text-zinc-400 dark:text-zinc-600 animate-pulse">:</span>
                  {String(time.getMinutes()).padStart(2, '0')}
                </div>
              </div>

              {/* Bottom part (Translucent gradient backdrop) */}
              <div className="bg-gradient-to-b from-white/40 to-white/5 dark:from-zinc-900/40 dark:to-zinc-900/5 py-2.5 px-2 flex flex-col items-center justify-center text-[10px] tracking-widest text-zinc-500/90 dark:text-zinc-400/90 gap-0.5">
                <div className="font-mono font-semibold scale-90">{time.getFullYear()}/{String(time.getMonth() + 1).padStart(2, '0')}/{String(time.getDate()).padStart(2, '0')}</div>
                <div className="text-[9px] opacity-80 mt-0.5 uppercase tracking-widest">
                  {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][time.getDay()]} {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][time.getDay()]}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <QuoteDisplay 
          text={quote?.text || ''} 
          author={quote?.author || ''} 
          category={quote?.category}
          isLoading={loading}
          onCopy={handleCopy}
          copied={copied}
          layoutMode={layoutMode}
          onChangeLayout={handleToggleLayout}
          isFavorite={isCurrentQuoteFavorite}
          onToggleFavorite={handleToggleFavorite}
          isPlayingSpeech={isPlayingSpeech}
          onToggleSpeech={handleToggleSpeech}
          onOpenPoster={() => setIsPosterOpen(true)}
          serifFont={serifFont}
          onChangeFont={handleToggleFont}
          isZenPlayActive={isZenPlayActive}
          onToggleZen={() => setIsZenPlayActive(!isZenPlayActive)}
          showClock={showClock}
          onToggleClock={() => setShowClock(!showClock)}
        />
      </div>

      {/* Zen Mode Progress Bar + Hover Control Overlay */}
      {isZenPlayActive && (
        <div className="hud-control-panel absolute bottom-28 left-1/2 -translate-x-1/2 z-40 w-[380px] md:w-[480px] flex flex-col items-center group cursor-pointer py-3 px-4">
          {/* Semi-transparent interactive HUD revealing on hovering the progress bar container */}
          <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 flex flex-col items-center gap-2.5 mb-3.5 w-full">
            
            {/* Category Selector inside hover HUD */}
            <div className="flex items-center justify-center flex-wrap gap-1 px-4 py-1.5 rounded-full backdrop-blur-2xl border border-black/5 dark:border-white/5 bg-white/30 dark:bg-zinc-900/30 text-[10px] tracking-wider text-zinc-500 font-sans shadow-sm">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-all duration-300 ${category === c.id ? 'text-amber-500 dark:text-amber-400 font-medium bg-black/5 dark:bg-white/15' : 'hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Action controls inside hover HUD */}
            <div className="flex items-center justify-center gap-1.5 backdrop-blur-2xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 py-1.5 px-4 rounded-full shadow-lg">
              {/* Pause/Resume button */}
              <button 
                onClick={() => setIsZenPaused(!isZenPaused)}
                className="text-[10px] tracking-[0.2em] text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all font-sans"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isZenPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                {isZenPaused ? '继续流转' : '暂缓瞬息'}
              </button>

              <span className="text-black/5 dark:text-white/10 select-none">|</span>

              {/* Clock Toggle button */}
              <button 
                onClick={() => setShowClock(!showClock)}
                className="text-[10px] tracking-[0.2em] text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all font-sans"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${showClock ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                {showClock ? '隐藏时钟' : '显示时钟'}
              </button>

              <span className="text-black/5 dark:text-white/10 select-none">|</span>

              {/* Skip to preloaded next line */}
              <button 
                onClick={switchToNextPreloaded}
                className="text-[10px] tracking-[0.2em] text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer flex items-center py-1 px-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all font-sans"
              >
                直接跃迁
              </button>

              <span className="text-black/5 dark:text-white/10 select-none">|</span>

              {/* Exit Zen Play Mode */}
              <button 
                onClick={() => setIsZenPlayActive(false)}
                className="text-[10px] tracking-[0.2em] text-red-500/70 hover:text-red-500 dark:text-red-400/70 dark:hover:text-red-400 cursor-pointer flex items-center py-1 px-3 rounded-full hover:bg-red-500/10 transition-all font-sans"
              >
                退出禅境
              </button>
            </div>
          </div>

          {/* Elegant Slim Progress Bar with smooth transitions */}
          <div className="w-72 md:w-80 h-[3px] bg-black/5 dark:bg-white/10 rounded-full overflow-hidden backdrop-blur-md relative">
            <div 
              style={{ width: `${zenProgress}%`, transition: 'width 100ms linear' }}
              className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <footer className={`p-12 mb-8 flex flex-col items-center gap-8 z-10 w-full relative transition-all duration-1000 ${isZenPlayActive ? 'opacity-0 pointer-events-none h-0 p-0 m-0 overflow-hidden' : 'opacity-100'}`}>
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
                    className={`px-4 py-3 rounded-xl text-xs tracking-widest text-left transition-all cursor-pointer ${category === c.id ? 'bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
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
            className="group relative flex items-center justify-center w-16 h-16 rounded-full border border-black/10 dark:border-white/10 hover:border-black/40 dark:hover:border-white/40 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            <span className="absolute -bottom-6 text-[10px] tracking-[0.3em] font-sans opacity-0 group-hover:opacity-50 transition-opacity whitespace-nowrap">
              换一句 ({currentCategoryLabel})
            </span>
          </button>
        </div>

        {/* Quick Stats & Indicator */}
        <div className="hidden md:flex gap-12 text-xs font-sans tracking-widest text-black/40 dark:text-white/30">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            一言 · 浮光掠影
          </div>
        </div>
      </footer>

      {/* PERSISTENT FAVORITES DRAWER ("时光之匣") */}
      <AnimatePresence>
        {isFavoritesOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFavoritesOpen(false)}
              className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Slideout Cabinet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="favorites-drawer-panel fixed top-0 right-0 h-screen w-full max-w-md bg-zinc-50 border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-2xl overflow-hidden"
              style={{ contentVisibility: 'auto' }}
            >
              {/* Header Box */}
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <h3 className="text-base font-serif tracking-widest font-medium text-zinc-950 dark:text-zinc-50">时光之匣 Favorite</h3>
                </div>
                <button
                  onClick={() => setIsFavoritesOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>

              {/* Shelf Items List */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {favorites.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-40">
                    <Heart className="w-10 h-10 stroke-1 mb-3 text-zinc-400 dark:text-zinc-600" />
                    <p className="text-sm font-serif tracking-widest leading-relaxed">红尘多遗忘，匣中空虚无</p>
                    <p className="text-[11px] font-sans mt-2 tracking-widest uppercase">收藏的字句将长存此时光中</p>
                  </div>
                ) : (
                  favorites.map((fav, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => handleSelectFavorite(fav)}
                      className="fav-drawer-item group cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-5 rounded-2xl flex flex-col gap-3 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 relative"
                    >
                      <button
                        onClick={(e) => handleDeleteFavorite(fav.text, e)}
                        className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                        title="删除此藏"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <p className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed max-w-[90%] font-serif">
                        {fav.text}
                      </p>
                      
                      <div className="flex justify-between items-center text-[10px] text-zinc-400">
                        <span className="font-sans uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[9px] uppercase border border-zinc-200/50 dark:border-zinc-800">
                          {fav.category || 'all'}
                        </span>
                        <span className="font-serif italic">— {fav.author}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Drawer summary footer */}
              {favorites.length > 0 && (
                <div className="p-4 bg-zinc-100/50 dark:bg-zinc-900/50 border-t border-zinc-200/80 dark:border-zinc-800 text-center text-[10px] text-zinc-400 tracking-wider">
                  阁下赏阅共 {favorites.length} 个时光残片印记
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* EXQUISITE INTERACTIVE SHARING POSTER CARD CREATOR MODAL */}
      <AnimatePresence>
        {isPosterOpen && (
          <>
            {/* Blur backdrop mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosterOpen(false)}
              className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Modal Wrapper dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="modal-content-panel fixed inset-4 md:inset-auto md:w-full md:max-w-3xl z-50 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row overflow-hidden shadow-black/80"
              style={{ contentVisibility: 'auto' }}
            >
              {/* Left Column: Real-time Aesthetic poster render frame */}
              <div className="flex-1 p-6 md:p-8 flex items-center justify-center bg-zinc-100 dark:bg-black/40 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
                <div 
                  id="poetry-poster-card"
                  className="w-full max-w-sm aspect-[4/5] rounded-2.5xl p-8 border shadow-xl flex flex-col justify-between relative overflow-hidden select-none transition-all duration-500"
                  style={{ 
                    backgroundImage: POSTER_THEMES.find(t => t.id === posterTheme)?.gradient,
                    fontFamily: "'Noto Serif SC', 'Songti SC', serif",
                    borderColor: POSTER_THEMES.find(t => t.id === posterTheme)?.borderColor
                  }}
                >
                  <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none mix-blend-overlay z-0" 
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'%2F%3E%3C%2Ffilter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'repeat' }}
                  ></div>

                  {/* Decorative circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-zinc-500/10 dark:border-zinc-400/5 border-dashed pointer-events-none"></div>

                  <span className={`text-4xl pointer-events-none font-light opacity-30 ${POSTER_THEMES.find(t => t.id === posterTheme)?.subtext}`}>『</span>
                  
                  <div className="my-auto py-4 text-center z-10 px-4">
                    <p 
                      className={`font-serif tracking-widest leading-loose ${POSTER_THEMES.find(t => t.id === posterTheme)?.text}`}
                      style={{ fontSize: `${posterFontSize}px` }}
                    >
                      {quote?.text}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3 z-10">
                    <span className={`text-4xl pointer-events-none font-light opacity-30 self-end mt-[-30px] ${POSTER_THEMES.find(t => t.id === posterTheme)?.subtext}`}>』</span>
                    <div className="h-[1px] w-8 bg-current opacity-25"></div>
                    <p className={`text-xs tracking-[0.4em] font-serif ${POSTER_THEMES.find(t => t.id === posterTheme)?.subtext}`}>
                      {quote?.author}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Customizer parameters & export actions */}
              <div className="w-full md:w-[320px] p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-zinc-950">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-md font-serif tracking-widest font-medium text-zinc-900 dark:text-zinc-50">诗签分享定制</h3>
                    <button
                      onClick={() => setIsPosterOpen(false)}
                      className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                  </div>

                  {/* Themes preset select panel */}
                  <div className="mb-6">
                    <label className="text-[11px] font-sans text-zinc-400 tracking-widest uppercase block mb-3">
                      <Palette className="w-3 h-3 text-amber-500 inline mr-1" />
                      卡片配色 Preset Theme
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {POSTER_THEMES.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setPosterTheme(theme.id)}
                          className={`px-3 py-2.5 rounded-xl text-[10px] tracking-wider text-left border cursor-pointer transition-all ${
                            posterTheme === theme.id 
                              ? "border-zinc-800 dark:border-zinc-200 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-medium" 
                              : "border-zinc-200 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full border border-black/10`} style={{ background: theme.gradient }} />
                            {theme.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size adjustments sliders */}
                  <div className="mb-8 flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between text-[11px] font-sans text-zinc-400 tracking-widest uppercase mb-1.5">
                        <span className="flex items-center gap-1">
                          <Sliders className="w-3 h-3 text-zinc-400" />
                          字体大小
                        </span>
                        <span>{posterFontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="48"
                        value={posterFontSize}
                        onChange={(e) => setPosterFontSize(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Poster sharing buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  <header className="text-[10px] font-mono opacity-50 tracking-widest uppercase mb-1">
                    Export Output
                  </header>
                  <button
                    onClick={handleCopyPosterSVG}
                    className={`w-full py-3 px-4 rounded-xl text-xs tracking-widest text-center cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${copiedPoster ? 'bg-green-500 text-white' : 'bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 hover:opacity-90'}`}
                  >
                    {copiedPoster ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        已复制矢量SVG代码
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        复制矢量卡片 SVG
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-zinc-400 mt-1 leading-relaxed text-center font-sans tracking-tight">
                    * 采用矢量 SVG 格式复制，可无损粘贴于 Figma, Canva 或生成纯矢量美图
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
