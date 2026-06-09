# proplytic.ai — ML-Bewertungsservice

Separater Python/FastAPI-Dienst, der vom Next.js-Backend über die Proxy-Route
`/api/predict` aufgerufen wird (`ML_API_URL` zeigt auf diesen Dienst).

## Lokal starten
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Vertrag
`POST /predict` → `{ predicted_price, range_low, range_high, confidence }`
`GET /health` → `{ status: "ok" }`

## Deployment
Nicht in Netlify Functions (Modellgröße/Laufzeit), sondern als eigener Container
(z. B. Cloud Run, Render, Fly.io). Anschließend `ML_API_URL` als Netlify-Env-Var
auf die öffentliche URL setzen. Fehlt die Variable oder ist der Dienst nicht
erreichbar, fällt das Frontend automatisch auf die JS-Engine zurück.

## Echtes Modell einsetzen
`estimate()` in `main.py` durch das Laden/Inferieren eines trainierten Modells
(scikit-learn/XGBoost-Artefakt) ersetzen — der API-Vertrag bleibt gleich.
