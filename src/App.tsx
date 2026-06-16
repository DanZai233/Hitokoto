/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Submit } from './pages/Submit';
import { Admin } from './pages/Admin';
import { ApiDocs } from './pages/ApiDocs';
import { Moon, Sun, Feather, Code, Shield, Quote, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-[#E0E0E0] font-serif flex flex-col overflow-hidden relative select-none transition-colors duration-500">
        {/* Subtle Noise Texture for Matte Paper Feel */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none mix-blend-overlay z-0" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }}
        ></div>

        {/* Background Decorative Elements */}
        {darkMode && (
          <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden z-0">
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }} 
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/50 rounded-full blur-[120px]"
            ></motion.div>
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }} 
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/40 rounded-full blur-[150px]"
            ></motion.div>
          </div>
        )}

        <header className="absolute top-0 w-full z-50 px-12 py-8 flex justify-between items-center bg-transparent">
          <Link to="/" className="text-xl tracking-[0.3em] font-light hover:opacity-80 transition-opacity">
            一言 <span className="text-[10px] align-top opacity-50 font-sans">PRO</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest font-sans opacity-60">
            <Link to="/submit" className="hover:opacity-100 transition-opacity flex items-center gap-2">
               投稿发现
            </Link>
            <Link to="/api-docs" className="hover:opacity-100 transition-opacity flex items-center gap-2">
               开放接口
            </Link>
            <Link to="/admin" className="hover:opacity-100 transition-opacity flex items-center gap-2">
               审核管理
            </Link>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="hover:opacity-100 transition-opacity ml-2"
            >
              {darkMode ? '日间模式' : '夜间模式'}
            </button>
          </div>

          <button className="md:hidden p-2 opacity-60 hover:opacity-100 transition-opacity" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-4 right-4 z-40 bg-zinc-100 dark:bg-zinc-900/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 flex flex-col gap-4 border border-zinc-200 dark:border-white/10 md:hidden font-sans tracking-widest text-sm"
            >
              <Link onClick={() => setMenuOpen(false)} to="/submit" className="p-3 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 transition-colors">
                 投稿发现
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/api-docs" className="p-3 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 transition-colors">
                 开放接口
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/admin" className="p-3 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 transition-colors">
                 审核管理
              </Link>
              <button 
                onClick={() => { setDarkMode(!darkMode); setMenuOpen(false); }}
                className="p-3 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 transition-colors text-left"
              >
                {darkMode ? '日间模式' : '夜间模式'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side Elements */}
        <div className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 flex-col gap-4 opacity-30 pointer-events-none text-zinc-900 dark:text-[#E0E0E0] z-0">
          <div className="w-[1px] h-32 bg-current mx-auto pt-2 opacity-30"></div>
          <div className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.5em] font-sans py-2">Fragment of Time</div>
        </div>
        
        <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-4 opacity-30 items-end pointer-events-none text-zinc-900 dark:text-[#E0E0E0] z-0">
          <div className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.5em] font-sans">Design & Aesthetic</div>
          <div className="w-[1px] h-32 bg-current mx-auto mr-[0px] ml-0 opacity-30"></div>
        </div>

        <main className="flex-1 flex flex-col relative w-full h-full pt-20 z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/api-docs" element={<ApiDocs />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
