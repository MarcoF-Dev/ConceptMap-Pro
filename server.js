// testGemini.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PredictionServiceClient } = require("@google-cloud/aiplatform");

const app = express();
app.use(cors());
app.use(express.json());

// Controlla se il percorso al JSON è impostato
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const client = new PredictionServiceClient({
  projectId: "conceptmap-pro",
  keyFilename: keyPath,
  apiEndpoint: "europe-west4-aiplatform.googleapis.com",
});

function buildPrompt(text, mapType) {
  if (mapType == "radiale") {
    return `Crea una mappa concettuale radiale. Nodo centrale principale e nodi secondari collegati. Restituisci JSON con nodes e links. Basati su questo testo ${text}`;
  }
  if (mapType == "lineare") {
    return `Crea una mappa concettuale lineare, collegando i concetti in sequenza. Restituisci JSON con nodes e links. Basati su questo testo ${text}`;
  }
  if (mapType == "gerarchica") {
    return `Crea una mappa concettuale gerarchica. Organizza i concetti per livelli: principale, secondario, terziario. Restituisci JSON con nodes, links e level. Basati su questo testo ${text}`;
  }
}

app.post("/generateMap", async (req, res) => {
  try {
    const { text, mapType } = req.body;

    if (!text || !mapType) {
      return res.status(400).json({ error: "text e mapType sono obbligatori" });
    }

    const prompt = buildPrompt(text, mapType);

    // Configurazione richiesta a Vertex
    const request = {
      endpoint: `projects/conceptmap-pro/locations/europe-west4/publishers/google/models/gemini-1.5-flash`,
      instances: [{ content: prompt }],
      parameters: {
        temperature: 0.2,
        maxOutputTokens: 800,
      },
    };

    // Chiamata al modello
    const [response] = await client.predict(request);

    // Estrazione output
    let outputText = response.predictions[0].content || "";

    // Pulizia e parsing del JSON
    let jsonResult;
    try {
      jsonResult = JSON.parse(outputText);
    } catch (err) {
      return res.status(500).json({
        error: "Il modello non ha restituito un JSON valido",
        rawOutput: outputText,
      });
    }

    res.json(jsonResult);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Errore nel server", details: error.message });
  }
});

// Porta dinamica per Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server attivo su porta ${PORT}`);
});
