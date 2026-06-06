#!/usr/bin/env python3
"""
ml/predict.py
FastAPI-Endpunkt für Immobilien-Preisvorhersagen.

Aufruf:
  pip install -r requirements-ml.txt
  python3 ml/train.py          # Modell zuerst trainieren
  uvicorn ml.predict:app --reload --port 8000

Endpunkte:
  POST /predict   → Preisprognose
  GET  /health    → Modell-Status und Metriken
"""
import json
import pathlib
import sys

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib

BASE = pathlib.Path(__file__).parent
sys.path.insert(0, str(BASE))
from features import FEATURE_COLS

MODEL_PATH   = BASE / 'models' / 'model.pkl'
METRICS_PATH = BASE / 'models' / 'metrics.json'

app = FastAPI(title='Proplytic Prediction API', version='0.1.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['POST', 'GET'],
    allow_headers=['*'],
)

_pipe    = None
_metrics: dict = {}


def _load():
    global _pipe, _metrics
    if not MODEL_PATH.exists():
        return
    _pipe = joblib.load(MODEL_PATH)
    if METRICS_PATH.exists():
        _metrics = json.loads(METRICS_PATH.read_text())


@app.on_event('startup')
def startup():
    _load()


class PredictRequest(BaseModel):
    typ:          str   = Field(..., examples=['Eigentumswohnung'])
    wohnflaeche:  float = Field(..., ge=10, le=2000, description='m²')
    zimmer:       float = Field(..., ge=1, le=20)
    baujahr:      int   = Field(..., ge=1850, le=2030)
    zustand:      str   = Field(..., examples=['Gepflegt'])
    stadt:        str   = Field(..., examples=['München'])
    balkon:       bool  = False
    aufzug:       bool  = False
    tiefgarage:   bool  = False
    keller:       bool  = False
    einbaukueche: bool  = False
    parkett:      bool  = False
    garten:       bool  = False


class PredictResponse(BaseModel):
    predicted_price: int
    range_low:       int
    range_high:      int
    confidence:      float
    model_mae:       int
    n_training:      int


@app.post('/predict', response_model=PredictResponse)
def predict(req: PredictRequest):
    global _pipe
    if _pipe is None:
        _load()
    if _pipe is None:
        raise HTTPException(503, 'Modell nicht gefunden — bitte zuerst python3 ml/train.py ausführen.')

    df    = pd.DataFrame([req.model_dump()])
    price = float(_pipe.predict(df[FEATURE_COLS])[0])
    price = max(10_000.0, price)

    mae  = _metrics.get('mae', 45_000)
    mape = _metrics.get('mape', 9.0)

    confidence = round(max(0.55, min(0.99, 1 - mape / 100)), 2)

    return PredictResponse(
        predicted_price=round(price / 1000) * 1000,
        range_low=round((price - mae) / 1000) * 1000,
        range_high=round((price + mae) / 1000) * 1000,
        confidence=confidence,
        model_mae=int(mae),
        n_training=_metrics.get('n_train', 0),
    )


@app.get('/health')
def health():
    return {
        'status':       'ok',
        'model_loaded': _pipe is not None,
        'metrics':      _metrics,
    }
