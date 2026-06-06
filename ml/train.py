#!/usr/bin/env python3
"""
ml/train.py
Trainiert ein Gradient-Boosting-Modell auf Immobiliendaten.

Liest ml/data/training.csv (Nutzer-Feedback) oder demo.csv als Fallback
und speichert das Modell in ml/models/model.pkl.

Aufruf:
  python3 ml/train.py                        # auto: training.csv oder demo.csv
  python3 ml/train.py --data pfad/zur/datei  # explizite Datei
  python3 ml/train.py --merge                # demo.csv + training.csv kombinieren
"""
import argparse
import json
import pathlib
import sys

import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
import joblib

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from features import FEATURE_COLS, TARGET_COL, build_preprocessor

BASE = pathlib.Path(__file__).parent


def load_data(path: pathlib.Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    missing = [c for c in FEATURE_COLS + [TARGET_COL] if c not in df.columns]
    if missing:
        sys.exit(f"Fehlende Spalten in {path.name}: {missing}")
    df = df.dropna(subset=FEATURE_COLS + [TARGET_COL])
    df = df[(df[TARGET_COL] >= 10_000) & (df[TARGET_COL] <= 10_000_000)]
    return df


def train_model(df: pd.DataFrame):
    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    pipe = Pipeline([
        ('prep',  build_preprocessor()),
        ('model', GradientBoostingRegressor(
            n_estimators=400,
            max_depth=4,
            learning_rate=0.04,
            subsample=0.8,
            min_samples_leaf=3,
            random_state=42,
        )),
    ])

    pipe.fit(X_train, y_train)

    y_pred = pipe.predict(X_test)
    mae  = mean_absolute_error(y_test, y_pred)
    mape = mean_absolute_percentage_error(y_test, y_pred) * 100

    cv_scores = cross_val_score(pipe, X, y, cv=min(5, len(df) // 20 + 1),
                                scoring='neg_mean_absolute_error')
    cv_mae = float(-cv_scores.mean())

    metrics = {
        'mae':     round(mae),
        'mape':    round(mape, 2),
        'cv_mae':  round(cv_mae),
        'n_train': len(X_train),
        'n_test':  len(X_test),
        'n_total': len(df),
    }
    return pipe, metrics


def save(pipe, metrics: dict):
    model_dir = BASE / 'models'
    model_dir.mkdir(exist_ok=True)
    joblib.dump(pipe, model_dir / 'model.pkl')
    (model_dir / 'metrics.json').write_text(json.dumps(metrics, indent=2, ensure_ascii=False))

    print(f"✓  ml/models/model.pkl gespeichert")
    print(f"   MAE     {metrics['mae']:>10,.0f} €")
    print(f"   MAPE    {metrics['mape']:>9.1f} %")
    print(f"   CV-MAE  {metrics['cv_mae']:>10,.0f} € (5-fold)")
    print(f"   Train / Test: {metrics['n_train']} / {metrics['n_test']}")


def main():
    parser = argparse.ArgumentParser(description='Proplytic ML Training')
    parser.add_argument('--data',  default=None, help='Pfad zur CSV-Datei')
    parser.add_argument('--merge', action='store_true',
                        help='demo.csv + training.csv zusammenführen')
    args = parser.parse_args()

    demo_path     = BASE / 'data' / 'demo.csv'
    training_path = BASE / 'data' / 'training.csv'

    if args.data:
        data_path = pathlib.Path(args.data)
        print(f"Lade {data_path} ...")
        df = load_data(data_path)

    elif args.merge:
        frames = []
        for p in [demo_path, training_path]:
            if p.exists():
                frames.append(load_data(p))
                print(f"  + {p.name}  ({len(frames[-1])} Zeilen)")
        if not frames:
            sys.exit("Keine Datendateien gefunden.")
        df = pd.concat(frames, ignore_index=True)

    else:
        data_path = training_path if training_path.exists() else demo_path
        print(f"Lade {data_path.name} ...")
        df = load_data(data_path)

    print(f"   {len(df)} Datenpunkte · {len(df.columns)} Spalten")
    print("Trainiere Modell ...")
    pipe, metrics = train_model(df)
    save(pipe, metrics)


if __name__ == '__main__':
    main()
