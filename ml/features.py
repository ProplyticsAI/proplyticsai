"""
ml/features.py
Feature-Definitionen und Preprocessing-Pipeline.
Geteilt zwischen train.py und predict.py.
"""
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OrdinalEncoder, StandardScaler
from sklearn.pipeline import Pipeline

TARGET_COL = 'kaufpreis'

NUMERIC_COLS = ['wohnflaeche', 'zimmer', 'baujahr']
BOOL_COLS    = ['balkon', 'aufzug', 'tiefgarage', 'keller', 'einbaukueche', 'parkett', 'garten']
CAT_COLS     = ['typ', 'zustand', 'stadt']

FEATURE_COLS = NUMERIC_COLS + BOOL_COLS + CAT_COLS

# Ordered so OrdinalEncoder encodes by rough value order
TYP_CATS     = ['Erdgeschosswohnung', 'Eigentumswohnung', 'Dachgeschosswohnung', 'Reihenhaus', 'Haus']
ZUSTAND_CATS = ['Renovierungsbedarf', 'Gepflegt', 'Saniert', 'Erstbezug']
STADT_CATS   = ['Köln', 'Düsseldorf', 'Berlin', 'Stuttgart', 'Hamburg', 'Frankfurt', 'München']


def build_preprocessor() -> ColumnTransformer:
    return ColumnTransformer([
        ('num',  Pipeline([('scaler', StandardScaler())]),   NUMERIC_COLS),
        ('bool', 'passthrough',                              BOOL_COLS),
        ('cat',  Pipeline([('enc', OrdinalEncoder(
            categories=[TYP_CATS, ZUSTAND_CATS, STADT_CATS],
            handle_unknown='use_encoded_value',
            unknown_value=-1,
        ))]),                                                CAT_COLS),
    ])
