#!/usr/bin/env python3
"""
ml/export_feedback.py
Konvertiert einen localStorage-Export aus dem Training-Dashboard
in eine trainierbare CSV-Datei.

Workflow:
  1. Im Training-Dashboard auf "CSV exportieren" klicken → feedback.json wird heruntergeladen
  2. python3 ml/export_feedback.py --input feedback.json
  3. python3 ml/train.py --merge      (demo.csv + training.csv kombinieren)

Optionen:
  --input   JSON-Datei (Pflicht)
  --output  Ziel-CSV (Standard: ml/data/training.csv)
  --append  An bestehende CSV anhängen statt überschreiben
"""
import argparse
import csv
import json
import pathlib
import sys

COLS = [
    'typ', 'wohnflaeche', 'zimmer', 'baujahr', 'zustand', 'stadt', 'plz',
    'balkon', 'aufzug', 'tiefgarage', 'keller', 'einbaukueche', 'parkett', 'garten',
    'kaufpreis',
]

# Keys in localStorage entry.inputs that map to feature columns
BOOL_KEYS = {'balkon', 'aufzug', 'tiefgarage', 'keller', 'einbaukueche', 'parkett', 'garten'}


def _to_bool(val) -> int:
    return 1 if str(val).lower() in ('true', '1', 'yes', 'ja') else 0


def _parse_price(raw) -> float | None:
    if not raw:
        return None
    cleaned = str(raw).replace('.', '').replace(',', '.').replace('€', '').replace(' ', '')
    try:
        price = float(cleaned)
        return price if 10_000 <= price <= 10_000_000 else None
    except ValueError:
        return None


def parse_entry(entry: dict) -> dict | None:
    actual = entry.get('actualPrice') or entry.get('actual_price')
    kaufpreis = _parse_price(actual)
    if kaufpreis is None:
        return None

    inputs = entry.get('inputs', {})
    row = {}
    for col in COLS[:-1]:
        # support both underscore and hyphen key names
        val = inputs.get(col) or inputs.get(col.replace('_', '-')) or ''
        row[col] = _to_bool(val) if col in BOOL_KEYS else val
    row['kaufpreis'] = int(kaufpreis)
    return row


def main():
    parser = argparse.ArgumentParser(description='localStorage-Feedback → Trainings-CSV')
    parser.add_argument('--input',  required=True,                    help='JSON-Exportdatei')
    parser.add_argument('--output', default='ml/data/training.csv',   help='Ziel-CSV')
    parser.add_argument('--append', action='store_true',              help='An bestehende CSV anhängen')
    args = parser.parse_args()

    raw = pathlib.Path(args.input).read_text(encoding='utf-8')
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        sys.exit(f'JSON-Fehler: {e}')

    if isinstance(data, str):
        data = json.loads(data)

    rows = [r for entry in (data if isinstance(data, list) else [data])
            if (r := parse_entry(entry))]

    if not rows:
        sys.exit('Keine verwertbaren Einträge gefunden (actualPrice fehlt oder ist ungültig).')

    out  = pathlib.Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    mode = 'a' if args.append and out.exists() else 'w'

    with open(out, mode, newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=COLS)
        if mode == 'w':
            writer.writeheader()
        writer.writerows(rows)

    print(f'✓  {len(rows)} Einträge → {out}')
    if args.append:
        total = sum(1 for _ in open(out)) - 1
        print(f'   Gesamt in Datei: {total} Zeilen')
    print(f'\nNächster Schritt:')
    print(f'  python3 ml/train.py --merge')


if __name__ == '__main__':
    main()
