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
      return `Crea un **array JSON puro** contenente solo gli elementi principali del testo. 
Il primo elemento deve essere l'elemento centrale, seguito dagli altri elementi collegati ad esso. 
Rispondi **solo** con l'array, senza oggetti, chiavi o spiegazioni. 
Non inserire prefissi tipo "javascript\\n" o json. ogni elemento deve contenere 2-3 parole che riassumano i concetti principali
,massimo 13 elementi, se il testo è in inglese rispondi in inglese
Testo: ${text}`;

    case "lineare":
      return `Crea un **array JSON puro** contenente solo gli elementi principali del testo, collegati in sequenza. 
Rispondi **solo** con l'array, senza oggetti, chiavi o spiegazioni. 
Non inserire prefissi tipo "javascript\\n" o json. ogni elemento deve contenere 2-3 parole che riassumano i concetti principali
,massimo 13 elementi, se il testo è in inglese rispondi in inglese
Testo: ${text}`;
    default:
      return text;
  }
}

// Funzione per ripulire output da ```json ... ``` o ``` ... ```

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

    // Rimuove prefisso tipo "javascript\n" o ```json ... ```
    outputText = outputText.replace(/^javascript\n|```json|```/g, "").trim();

    // Rimuove eventuali virgolette esterne che racchiudono tutto l'array
    if (outputText.startsWith('"') && outputText.endsWith('"')) {
      outputText = outputText.slice(1, -1).replace(/\\"/g, '"');
    }

    let arrayResult;
    try {
      arrayResult = JSON.parse(outputText);
    } catch {
      // fallback: metti tutto in un array singolo se il parsing fallisce
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
