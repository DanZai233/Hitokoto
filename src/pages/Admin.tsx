import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../db/firebase';
import { Quote } from '../types';

export function Admin() {
  const [pendingQuotes, setPendingQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const currentUser = auth.currentUser;

  // Function to setup admin for the first time
  const handleMakeAdmin = async () => {
    if (!currentUser) return;
    try {
      const { setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'admins', currentUser.uid), {
        email: currentUser.email,
        role: 'admin'
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPending = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'quotes'),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      const quotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
      // order locally by createdAt since we don't have composite index set up
      quotes.sort((a,b) => {
        const valA = (a.createdAt as any)?.toMillis?.() || a.createdAt || 0;
        const valB = (b.createdAt as any)?.toMillis?.() || b.createdAt || 0;
        return valB - valA;
      });
      setPendingQuotes(quotes);
      setIsAdmin(true); // If we could fetch, we are admin
    } catch (e: any) {
      console.error(e);
      if (e.message.includes('Missing or insufficient permissions')) {
        setIsAdmin(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) {
        fetchPending();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      setMsg('');
      await updateDoc(doc(db, 'quotes', id), {
        status: action
      });
      setPendingQuotes(prev => prev.filter(q => q.id !== id));
      setMsg(`已${action === 'approved' ? '通过' : '驳回'}该词条`);
    } catch (e: any) {
      console.error(e);
      setMsg('操作失败: ' + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要永久删除此词条吗？操作不可恢复。')) return;
    try {
      await deleteDoc(doc(db, 'quotes', id));
      setPendingQuotes(prev => prev.filter(q => q.id !== id));
      setMsg('词条已从数据库彻底移除');
    } catch (e: any) {
      console.error(e);
      setMsg('删除失败: ' + e.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm tracking-widest text-zinc-500">加载中...</div>;

  if (!currentUser) {
    return <div className="p-8 text-center text-zinc-500 tracking-widest">请先在投稿页面完成身份验证。</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-600 dark:text-zinc-400">
        <p className="mb-6 tracking-widest leading-loose">当前账号无审核权限。</p>
        <button onClick={handleMakeAdmin} className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors tracking-widest text-sm font-medium">
          将关联邮箱 ({currentUser.email}) 设为系统管理账号
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-serif text-zinc-800 dark:text-zinc-100 mb-6 tracking-widest">「 审核队列 」</h2>
        
        {msg && <div className="mb-4 p-3 bg-zinc-50 text-zinc-700 rounded dark:bg-zinc-800/50 dark:text-zinc-300">{msg}</div>}

        {pendingQuotes.length === 0 ? (
          <p className="text-zinc-500 text-center py-8 tracking-widest">暂无待审核的词条。</p>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingQuotes.map(q => (
              <div key={q.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1">
                  <p className="text-lg font-serif text-zinc-900 dark:text-zinc-100 mb-1">「 {q.text} 」</p>
                  <p className="text-sm text-zinc-500 font-sans tracking-widest">— {q.author}</p>
                  <p className="text-xs text-zinc-400 mt-2 font-mono">UID: {q.submitterId}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleAction(q.id, 'approved')} className="px-4 py-2 text-sm bg-zinc-800 text-white rounded hover:bg-zinc-900 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-white transition-colors tracking-widest">通过</button>
                  <button onClick={() => handleAction(q.id, 'rejected')} className="px-4 py-2 text-sm bg-zinc-200 text-zinc-800 rounded hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors tracking-widest">驳回</button>
                  <button onClick={() => handleDelete(q.id)} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors tracking-widest">删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
