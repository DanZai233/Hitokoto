import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Firebase Client in Node
  const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
  let db: any = null;
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const fbApp = initializeApp(config);
    db = getFirestore(fbApp, config.firestoreDatabaseId);
  }

  // Load local corpus
  let localCorpus: any[] = [];
  try {
    const corpusPath = path.resolve(process.cwd(), "src/data/corpus.json");
    if (fs.existsSync(corpusPath)) {
      localCorpus = JSON.parse(fs.readFileSync(corpusPath, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load local corpus", err);
  }

  // API Route for developers: Get a random approved quote
  app.get("/api/random", async (req, res) => {
    const requestedCategory = req.query.category as string;
    let combinedQuotes: any[] = [...localCorpus.map((q, i) => ({ id: `local-${i}`, status: 'approved', createdAt: Date.now(), ...q }))];
    
    if (db) {
      try {
        const quotesRef = collection(db, "quotes");
        let q = query(quotesRef, where("status", "==", "approved"));
        if (requestedCategory && requestedCategory !== 'all') {
             q = query(quotesRef, where("status", "==", "approved"), where("category", "==", requestedCategory));
        }
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const dbQuotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          combinedQuotes = [...combinedQuotes, ...dbQuotes];
        }
      } catch (err: any) {
        console.error("Failed to fetch DB quotes, falling back to local corpus", err);
      }
    }

    if (requestedCategory && requestedCategory !== 'all') {
        combinedQuotes = combinedQuotes.filter(q => q.category === requestedCategory);
    }

    if (combinedQuotes.length === 0) {
      return res.status(404).json({ error: "No quotes found for this category" });
    }

    const randomIndex = Math.floor(Math.random() * combinedQuotes.length);
    const randomQuote: any = combinedQuotes[randomIndex];

    // Remove sensitive info if any
    const { submitterId, originalOwnerId, ...publicQuote } = randomQuote;
    
    // format response
    res.json({
      id: publicQuote.id,
      text: publicQuote.text,
      author: publicQuote.author || "Anonymous",
      category: publicQuote.category,
      createdAt: publicQuote.createdAt || Date.now(),
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
