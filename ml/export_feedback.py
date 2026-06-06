#!/usr/bin/env python3
"""
ml/export_feedback.py
Konvertiert einen localStorage-Export aus dem Training-Dashboard
in eine trainierbare CSV-Datei.

Unterstützt zwei Formate:
  A) Flaches Format (Widget ab v1.1):
       {id, ts, address, type, size, year, city, predicted, actual, ...}
  B) Inputs-Format (ältere Versionen):
       {inputs: {typ, wohnflaeche, ...}, actualPrice: ...}

Workflow:
  1. Training-Dashboard → "CSV exportieren" → feedback.json heruntergeladen
  2. python3 ml/export_feedback.py --input feedback.json
  3. python3 ml/train.py --merge

Optionen:
  --input   JSON-Datei (Pflicht)
  --output  Ziel-CSV (Standard: ml/data/training.csv)
  --append  An bestehende CSV anhängen statt überschreiben
"""
import argparse
import csv
import json
import pathlib
import re
import sys

COLS = [
    'typ', 'wohnflaeche', 'zimmer', 'baujahr', 'zustand', 'stadt', 'plz',
    'balkon', 'aufzug', 'tiefgarage', 'keller', 'einbaukueche', 'parkett', 'garten',
    'kaufpreis',
]

BOOL_KEYS    = {'balkon', 'aufzug', 'tiefgarage', 'keller', 'einbaukueche', 'parkett', 'garten'}
VALID_CITIES = {'München', 'Hamburg', 'Frankfurt', 'Berlin', 'Düsseldorf', 'Köln', 'Stuttgart'}


def _to_bool(val) -> int:
    return 1 if str(val).lower() in ('true', '1', 'yes', 'ja') else 0


def _parse_price(raw) -> float | None:
    if raw is None or raw == '':
        return None
    cleaned = str(raw).replace('.', '').replace(',', '.').replace('€', '').replace(' ', '')
    try:
        price = float(cleaned)
        return price if 10_000 <= price <= 10_000_000 else None
    except ValueError:
        return None


def _extract_plz(address: str) -> str:
    m = re.search(r'\b(\d{5})\b', str(address))
    return m.group(1) if m else ''


def _parse_flat(entry: dict) -> dict | None:
    """Format A: flaches Objekt (aktuelles Widget-Format)."""
    kaufpreis = _parse_price(entry.get('actual'))
    if kaufpreis is None:
        return None

    size   = float(entry.get('size') or 80)
    zimmer = max(1, round(size / 28))
    city   = entry.get('city') or ''
    if city not in VALID_CITIES:
        city = 'München'

    return {
        'typ':          entry.get('type') or 'Eigentumswohnung',
        'wohnflaeche':  size,
        'zimmer':       zimmer,
        'baujahr':      int(entry.get('year') or 2000),
        'zustand':      'Gepflegt',
        'stadt':        city,
        'plz':          _extract_plz(entry.get('address', '')),
        'balkon':       0,
        'aufzug':       0,
        'tiefgarage':   0,
        'keller':       0,
        'einbaukueche': 0,
        'parkett':      0,
        'garten':       0,
        'kaufpreis':    int(kaufpreis),
    }


def _parse_inputs(entry: dict) -> dict | None:
    """Format B: inputs-Sub-Objekt (älteres Widget-Format)."""
    kaufpreis = _parse_price(entry.get('actualPrice') or entry.get('actual_price'))
    if kaufpreis is None:
        return None

    inputs = entry.get('inputs', {})
    row = {}
    for col in COLS[:-1]:
        val = inputs.get(col) or inputs.get(col.replace('_', '-')) or ''
        row[col] = _to_bool(val) if col in BOOL_KEYS else val
    row['kaufpreis'] = int(kaufpreis)
    return row


def parse_entry(entry: dict) -> dict | None:
    if 'inputs' in entry:
        return _parse_inputs(entry)
    return _parse_flat(entry)


def main():
    parser = argparse.ArgumentParser(description='localStorage-Feedback → Trainings-CSV')
    parser.add_argument('--input',  required=True,                  help='JSON-Exportdatei')
    parser.add_argument('--output', default='ml/data/training.csv', help='Ziel-CSV')
    parser.add_argument('--append', action='store_true',            help='An bestehende CSV anhängen')
    args = parser.parse_args()

    raw = pathlib.Path(args.input).read_text(encoding='utf-8')
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        sys.exit(f'JSON-Fehler: {e}')

    if isinstance(data, str):
        data = json.loads(data)
    if not isinstance(data, list):
        data = [data]

    total   = len(data)
    rows    = [r for entry in data if (r := parse_entry(entry))]
    skipped = total - len(rows)

    if not rows:
        print(f'Keine verwertbaren Einträge — actual-Preis fehlt in allen {total} Einträgen.')
        print('Tipp: Im Feedback-Widget unten rechts den tatsächlichen Verkaufspreis eingeben.')
        sys.exit(0)

    out  = pathlib.Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    mode = 'a' if args.append and out.exists() else 'w'

    with open(out, mode, newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=COLS)
        if mode == 'w':
            writer.writeheader()
        writer.writerows(rows)

    print(f'✓  {len(rows)} Einträge → {out}  ({skipped} übersprungen, kein Ist-Preis)')
    if args.append and out.exists():
        total_lines = sum(1 for _ in open(out)) - 1
        print(f'   Gesamt in Datei: {total_lines} Zeilen')
    print(f'\nNächster Schritt:')
    print(f'  python3 ml/train.py --merge')


if __name__ == '__main__':
    main()
