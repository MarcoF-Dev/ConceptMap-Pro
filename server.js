import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Inizializza Gemini con API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Funzione per costruire il prompt dinamico
function buildPrompt(text, mapType) {
  switch (mapType) {
    case "radiale":
      return `Crea un array semplice contenente solo gli elementi principali del testo. 
Il primo elemento deve essere l'elemento centrale, seguito dagli altri elementi collegati. 
Rispondi **solo** con un array JavaScript valido, senza oggetti o chiavi, senza spiegazioni aggiuntive:
Testo: ${text}`;
    case "lineare":
      return `Crea un array semplice contenente solo gli elementi principali del testo, collegati in sequenza. 
Rispondi **solo** con un array JavaScript valido, senza oggetti o chiavi, senza spiegazioni aggiuntive:
Testo: ${text}`;
    default:
      return text;
  }
}

// Funzione per ripulire output da ```json ... ``` o ``` ... ```
function cleanOutput(text) {
  return text.replace(/```(json)?/g, "").trim();
}

// Endpoint per generare la mappa
app.post("/generateMap", async (req, res) => {
  const { text, mapType } = req.body;

  if (!text || !mapType) {
    return res.status(400).json({ error: "text e mapType sono obbligatori" });
  }

  try {
    const prompt = buildPrompt(text, mapType);

    // Chiamata a Gemini
    const result = await model.generateContent(prompt);
    let outputText = result.response.text();

    // Pulisce l'output da ```json ... ``` o ```
    outputText = cleanOutput(outputText);

    let arrayResult;
    try {
      // Forza il parsing come array
      arrayResult = JSON.parse(outputText);
      if (!Array.isArray(arrayResult)) throw new Error("Non è un array");
    } catch {
      // Se fallisce il parsing, restituisce un array con rawOutput
      arrayResult = [outputText];
    }

    res.json(arrayResult);
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({
      error: "Errore durante la generazione della mappa",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[INFO] Server attivo su porta ${PORT}`));
