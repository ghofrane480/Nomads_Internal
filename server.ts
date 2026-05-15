import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Interface pour les données du prêt envoyées par le client.
 */
interface LoanData {
  amount: number;
  rate: number;
  durationMonths: number;
  monthlyPayment: number;
  totalInterest: number;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Gemini API Proxy pour analyser les performances de l'auberge
  app.post("/api/analyze-performance", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Clé API Gemini non configurée" });
      }

      const { stats, hostelName } = req.body;
      
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
        En tant qu'expert en gestion hôtelière (Hostel Management), analyse les statistiques suivantes pour l'auberge "${hostelName}" :
        - Taux d'occupation : ${stats.occupancyRate}%
        - Revenus totaux : ${stats.totalRevenue} €
        - Dépenses totales : ${stats.totalExpenses} €
        - Profit net : ${stats.netProfit} €
        
        Fournis un rapport court et stratégique en français :
        1. Diagnostic : Est-ce une bonne performance ?
        2. Alerte : Si le taux d'occupation est bas ou les dépenses trop hautes, suggère une action.
        3. Opportunité : Comment augmenter le revenu moyen par client (RevPAR) ?
        
        Utilise un ton professionnel et encourageant. Format Markdown.
      `;

      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Erreur lors de l'analyse AI" });
    }
  });

  // Configuration Vite pour le développement
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Mode Production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
