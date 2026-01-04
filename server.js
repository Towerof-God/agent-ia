import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Tu es un assistant IA professionnel pour un site de vente en ligne.
Réponds poliment aux clients en français.
Livraison: 24-72h
Paiement: Mobile Money, carte bancaire
Retours: sous 7 jours
Support: 8h-18h
`;

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ reply: "Erreur serveur, veuillez réessayer." });
  }
});

app.get("/", (req, res) => {
  res.send("Agent IA en ligne ✅");
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
