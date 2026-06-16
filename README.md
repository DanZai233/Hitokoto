# 一言 PRO

一个部署在 Vercel 上的极简随机句子站点。生产环境只依赖静态句库 `src/data/corpus.json` 和 Vercel Function `GET /api/random`。

## 本地运行

```bash
npm install
npm run dev
```

## 部署到 Vercel

Vercel 会执行 `npm run build`，并把 `api/random.ts` 作为 Serverless Function 部署。无需 Firebase、Firestore、Google Auth、Gemini、Neon 或其他外部数据库环境变量。

## 从旧 Firestore 导出句子

旧 Google Cloud Project:

- Project ID: `gen-lang-client-0316053254`
- Firestore Database ID: `ai-studio-9fc55d78-e9bf-4f21-8b10-2101255971e3`
- Region: `us-west1`

拿到短期 Google token 后运行：

```bash
export GOOGLE_OAUTH_TOKEN="..."
npm run data:export-google
```

脚本会读取 Firestore 的 `quotes` 集合，把 `approved` 或未标记状态的句子合并进 `src/data/corpus.json`，之后 Vercel 上直接使用这份静态句库。

## API

- `GET /api/random`
- `GET /api/random?category=literature`
