import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface QuoteDisplayProps {
  text: string;
  author: string;
  isLoading: boolean;
  onCopy?: () => void;
  copied?: boolean;
}

export function QuoteDisplay({ text, author, isLoading, onCopy, copied }: QuoteDisplayProps) {
  // Split characters for "floating in one by one" animation instead of words to better suit Chinese text typography
  const chars = text ? text.split('') : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(10px)",
      transition: { duration: 0.3 }
    }
  };

  const charVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(5px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[50vh] w-full max-w-4xl mx-auto px-12 md:px-24">
      <AnimatePresence mode="wait">
        {!isLoading && text && (
          <motion.div
            key={text}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col items-center gap-8 relative z-10 w-full"
          >
            <div className="relative text-center w-full">
              {/* Brackets */}
              <span className="absolute -left-6 md:-left-20 -top-12 text-6xl md:text-8xl text-black/5 dark:text-white/10 font-sans pointer-events-none select-none font-light">
                『
              </span>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl leading-[1.8] md:leading-[2] font-light tracking-wide max-w-4xl mx-auto flex flex-wrap justify-center font-serif text-zinc-900 dark:text-zinc-100">
                {chars.map((char, i) => (
                  <motion.span key={i} variants={charVariants} className="inline-block relative px-[1px] md:px-[3px]">
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h1>

              <span className="absolute -right-6 md:-right-20 -bottom-12 text-6xl md:text-8xl text-black/5 dark:text-white/10 font-sans pointer-events-none select-none font-light">
                』
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chars.length * 0.05 + 0.5, duration: 1 }}
              className="mt-16 md:mt-24 flex flex-col items-center gap-2 w-full"
            >
              <div className="h-[1px] w-12 bg-black/10 dark:bg-white/20 mb-8 max-w-full"></div>
              <p className="text-xs font-sans uppercase tracking-[0.6em] text-black/50 dark:text-white/40 mt-1 opacity-80 hover:opacity-100 transition-opacity ml-[0.6em]">
                {author || 'Anonymous'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-6 h-6 border-2 border-inherit border-t-transparent rounded-full opacity-60"
          />
        </div>
      )}
    </div>
  );
}
