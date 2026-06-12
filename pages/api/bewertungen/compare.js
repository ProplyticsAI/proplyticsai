import { db } from "../../../db/index.js";
import { bewertung } from "../../../db/schema.js";
import { and, eq, inArray } from "drizzle-orm";
import { requireUserId } from "../../../lib/requireUser.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  const userId = await requireUserId(req, res);
  if (!userId) return;
  const { ids } = req.body ?? {};
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids (Array) erforderlich" });
  }
  const selected = ids.slice(0, 4);

  const rows = await db
    .select({
      id: bewertung.id,
      objektName: bewertung.objektName,
      ort: bewertung.ort,
      verfahren: bewertung.verfahren,
      inputs: bewertung.inputs,
      ergebnis: bewertung.ergebnis,
      monteCarlo: bewertung.monteCarlo,
    })
    .from(bewertung)
    .where(and(eq(bewertung.userId, userId), inArray(bewertung.id, selected)));

  // Reihenfolge der Anfrage beibehalten + Risikobandbreiten durchreichen
  const byId = new Map(rows.map((r) => [r.id, r]));
  const objekte = selected
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((r) => ({
      id: r.id,
      objektName: r.objektName,
      ort: r.ort,
      verfahren: r.verfahren,
      inputs: r.inputs
        ? {
            gebaeudetyp: r.inputs.gebaeudetyp,
            baujahr: r.inputs.baujahr,
            flaeche: r.inputs.flaeche,
            grundstuecksflaeche: r.inputs.grundstuecksflaeche,
            jahresnettokaltmiete: r.inputs.jahresnettokaltmiete,
          }
        : null,
      kennzahlen: r.ergebnis?.kennzahlen ?? null,
      ergebnis: r.ergebnis?.ergebnis ?? null,
      monteCarlo: r.monteCarlo
        ? { mean: r.monteCarlo.mean, percentiles: r.monteCarlo.percentiles }
        : null,
    }));

  return res.status(200).json({ objekte });
}
