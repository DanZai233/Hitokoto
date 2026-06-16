import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../db/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Quote } from '../types';

const CATEGORIES = [
  { id: 'anime', label: '二次元 / Anime' },
  { id: 'literature', label: '文学 / Literature' },
  { id: 'philosophy', label: '哲思 / Philosophy' },
  { id: 'movie', label: '影视 / Movie' },
  { id: 'game', label: '游戏 / Game' },
  { id: 'music', label: '音乐 / Music' },
  { id: 'internet', label: '网生 / Internet' },
];

export function Submit() {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('literature');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [user, setUser] = useState(auth.currentUser);

  // Monitor auth state
  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return unsub;
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      console.error(e);
      setMsg({ text: '登录服务异常', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    if (!user) {
      setMsg({ text: '请先完成身份验证', type: 'error' });
      return;
    }

    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const docRef = collection(db, 'quotes');
      await addDoc(docRef, {
        text,
        author: author || '佚名',
        category,
        status: 'pending',
        submitterId: user.uid,
        createdAt: serverTimestamp()
      });
      setMsg({ text: '投稿成功，请等待管理员审核。', type: 'success' });
      setText('');
      setAuthor('');
      setCategory('literature');
    } catch (e: any) {
      console.error(e);
      setMsg({ text: '网络异常，提交失败。', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800 relative z-10">
        <h2 className="text-2xl font-serif mb-6 text-center tracking-widest text-zinc-800 dark:text-zinc-100">
          「 社区投稿 」
        </h2>
        
        {!user ? (
          <div className="text-center">
            <p className="text-zinc-500 text-sm mb-6 tracking-wider">需验证身份以保证投稿质量。</p>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium tracking-widest transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              一键登录与验证
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block tracking-wider text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                句子正文
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="在此输入这句动人心弦的话..."
                rows={4}
                required
              />
            </div>
            
            <div>
              <label className="block tracking-wider text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                出处或作者 (选填)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="例如: 鲁迅"
              />
            </div>

            <div>
              <label className="block tracking-wider text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                分类偏好
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 appearance-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {msg.text && (
              <div className={`p-3 rounded-lg text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full py-3 mt-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '提交中...' : '提 交'}
            </button>
            <p className="text-xs text-zinc-400 text-center mt-2">
              目前以 {user.email} 身份登录
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
