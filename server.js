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
      return `Crea un array contenente gli elementi principali del testo. 
Il primo elemento deve essere l'elemento cardine, seguito da tutti gli altri elementi collegati a esso. 
Restituisci un JSON basato su questo testo: ${text}`;
    case "lineare":
      return `Crea un array contenente gli elementi principali del testo, collegati in sequenza. 
Restituisci un JSON basato su questo testo: ${text}`;
    default:
      return text;
  }
}

// Funzione per ripulire output da ```json ... ```
function cleanOutput(text) {
  return text.replace(/```json|```/g, "").trim();
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

    // Pulisce l'output da ```json ... ```
    outputText = cleanOutput(outputText);

    let jsonResult;
    try {
      jsonResult = JSON.parse(outputText);
    } catch {
      // Se ancora non è JSON valido, restituisce un array con rawOutput
      jsonResult = {
        warning: "Output non JSON, uso raw",
        rawOutput: outputText,
      };
    }

    res.json(jsonResult);
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
