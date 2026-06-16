import React from 'react';

export function ApiDocs() {
  const codeString = `
fetch('https://your-app-url.com/api/random')
  .then(response => response.json())
  .then(data => console.log(data));
  `;

  const responseString = `
{
  "id": "e8A7xj...",
  "text": "万物皆有裂痕，那是光照进来的地方。",
  "author": "莱昂纳德·科恩",
  "createdAt": 1718222938183
}
  `;

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col justify-center">
      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl p-6 md:p-10 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-3xl font-serif text-zinc-900 dark:text-zinc-100 mb-6 tracking-widest">开放接口</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed tracking-wider">
          本站为开发者提供稳健的 RESTful API 服务，用于获取随机句子。公开接口无需鉴权认证，欢迎接入。
        </p>

        <h3 className="text-sm font-medium tracking-widest text-zinc-800 dark:text-zinc-200 mb-3">GET /api/random</h3>
        <div className="bg-zinc-50 dark:bg-black/50 rounded-lg p-4 mb-6 overflow-x-auto text-xs font-mono text-zinc-800 dark:text-zinc-300 border border-zinc-100 dark:border-white/5">
          <pre>{codeString.trim()}</pre>
        </div>

        <h3 className="text-sm font-medium tracking-widest text-zinc-800 dark:text-zinc-200 mb-3">响应数据结构</h3>
        <div className="bg-zinc-50 dark:bg-black/50 rounded-lg p-4 overflow-x-auto text-xs font-mono text-zinc-800 dark:text-zinc-300 border border-zinc-100 dark:border-white/5">
          <pre>{responseString.trim()}</pre>
        </div>
      </div>
    </div>
  );
}
