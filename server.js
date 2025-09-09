require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { PredictionServiceClient } = require("@google-cloud/aiplatform");

const app = express();
app.use(cors());
app.use(express.json());

// Scrive la chiave in un file temporaneo
const keyJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
const tempPath = path.join(__dirname, "temp-key.json");
fs.writeFileSync(tempPath, keyJson);

// Configura il client Vertex AI
const client = new PredictionServiceClient({
  projectId: "conceptmap-pro",
  keyFilename: tempPath,
  apiEndpoint: "europe-west4-aiplatform.googleapis.com",
});

function buildPrompt(text, mapType) {
  switch (mapType) {
    case "radiale":
      return `Crea una mappa concettuale radiale. Nodo centrale principale e nodi secondari collegati. Restituisci JSON con nodes e links. Basati su questo testo ${text}`;
    case "lineare":
      return `Crea una mappa concettuale lineare, collegando i concetti in sequenza. Restituisci JSON con nodes e links. Basati su questo testo ${text}`;
    case "gerarchica":
      return `Crea una mappa concettuale gerarchica. Organizza i concetti per livelli: principale, secondario, terziario. Restituisci JSON con nodes, links e level. Basati su questo testo ${text}`;
    default:
      return "";
  }
}

app.post("/generateMap", async (req, res) => {
  try {
    const { text, mapType } = req.body;

    if (!text || !mapType) {
      return res.status(400).json({ error: "text e mapType sono obbligatori" });
    }

    const prompt = buildPrompt(text, mapType);

    const request = {
      endpoint: `projects/conceptmap-pro/locations/europe-west4/publishers/google/models/gemini-1.5-flash`,
      instances: [{ content: prompt }],
      parameters: {
        temperature: 0.2,
        maxOutputTokens: 800,
      },
    };

    const [response] = await client.predict(request);
    const outputText = response.predictions[0]?.content || "";

    // Log per debug
    console.log("=== Output grezzo dal modello ===");
    console.log(outputText);
    console.log("=== Fine output ===");

    let jsonResult;
    try {
      jsonResult = JSON.parse(outputText);
    } catch {
      // Se non è JSON valido, restituisci comunque il raw output
      return res.status(200).json({
        warning: "Il modello non ha restituito un JSON valido",
        rawOutput: outputText,
      });
    }

    res.json(jsonResult);
  } catch (error) {
    console.error("Errore interno server:", error);
    res
      .status(500)
      .json({ error: "Errore nel server", details: error.message });
  } finally {
    // Rimuove il file temporaneo della chiave
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
});

// Porta dinamica per Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server attivo su porta ${PORT}`);
});
