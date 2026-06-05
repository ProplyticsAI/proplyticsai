# Logo SVG Export

_Started 2026-06-05 15:07 UTC_

---

## User

kannst du das logo alleine als svg export

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

I need to see the `BuildingTile` and `Mark` components, plus the theme tokens (colors, fonts).

_[tool: write_file]_

Got it — the logo glyph (the "Mark") is pure vector, but the inline lockup actually uses a PNG building tile. The clean SVG-exportable logo is the **mark glyph + wordmark**. Let me export that as standalone SVGs.

_[tool: write_file]_

_[tool: write_file]_

Let me preview both to verify they render correctly.

_[tool: show_html]_

_[tool: show_html]_

_[tool: present_fs_item_for_download]_

_[tool: present_fs_item_for_download]_

Beide rendern sauber. Hier die Exporte:

- **`export/proplytic-logo.svg`** — komplettes Lockup (Mark + Wortmarke „proplytic.ai"). Text ist live (DM Sans 600), also editierbar in Figma/Illustrator. Falls du es 100 % portabel brauchst (ohne Font-Abhängigkeit), kann ich die Schrift in Pfade umwandeln.
- **`export/proplytic-mark.svg`** — nur das Glyph (reiner Vektor, skaliert bis ~16 px sauber).

Farben: Slate `#2E4150`, Teal-Akzent `#3AA7B5`, Tinte `#1B2733`.

Hinweis: Die Inline-Lockups in der App nutzen tatsächlich ein PNG-Gebäudekachel — das lässt sich nicht als SVG exportieren. Diese SVG-Version basiert auf dem Vektor-Mark (den Balken + Giebelhaus), der als kompaktes/dunkles Logo gedacht ist.Beide stehen oben zum Download bereit. Sag Bescheid, wenn ich die Wortmarke in Pfade umwandeln oder eine dunkle/einfarbige Variante erstellen soll.

