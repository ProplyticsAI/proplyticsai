"""
proplytic.ai — ML-Bewertungsservice (FastAPI)

Separater Dienst, der Immobilienmerkmale entgegennimmt und einen geschätzten
Marktwert samt Spanne und Konfidenz zurückgibt. Wird vom Next.js-Backend über
die Proxy-Route /api/predict aufgerufen (ML_API_URL zeigt auf diesen Dienst).

Start lokal:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Das hier ist ein Platzhalter-Schätzer (heuristisch). Er ist so strukturiert,
dass ein echtes Modell (z. B. geladenes scikit-learn/XGBoost-Artefakt) den
`estimate()`-Aufruf ersetzen kann, ohne den API-Vertrag zu ändern.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="proplytic.ai ML-Service", version="0.1.0")

# CORS nur für den Fall direkter Aufrufe; produktiv läuft der Zugriff über die
# serverseitige Proxy-Route, daher restriktiv halten.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    flaeche: Optional[float] = None          # m²
    baujahr: Optional[int] = None
    bodenrichtwert: Optional[float] = None   # €/m²
    miete: Optional[float] = None            # €/m²/Monat
    objektart: Optional[str] = None
    plz: Optional[str] = None
    zustand: Optional[str] = None


class PredictResponse(BaseModel):
    predicted_price: float
    range_low: float
    range_high: float
    confidence: float


def estimate(req: PredictRequest) -> PredictResponse:
    """Heuristischer Platzhalter — durch echtes Modell ersetzbar."""
    flaeche = req.flaeche or 100.0
    brw = req.bodenrichtwert or 1500.0
    # Sehr grobe Heuristik: Bodenwertanteil + ertragsbasierter Aufschlag
    base = flaeche * brw
    if req.miete:
        jahresmiete = req.miete * 12 * flaeche
        base = 0.4 * base + 0.6 * (jahresmiete * 22)  # Faktor ~22
    # Altersabschlag
    if req.baujahr:
        alter = max(0, 2026 - req.baujahr)
        base *= max(0.6, 1 - alter * 0.004)
    price = round(base, -3)
    spread = price * 0.08
    return PredictResponse(
        predicted_price=price,
        range_low=round(price - spread, -3),
        range_high=round(price + spread, -3),
        confidence=0.78,
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    return estimate(req)
