// testGemini.js
require("dotenv").config();
const { PredictionServiceClient } = require("@google-cloud/aiplatform");

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
