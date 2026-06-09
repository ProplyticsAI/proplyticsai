import { db } from "../../../db/index.js";
import { bewertung } from "../../../db/schema.js";
import { and, eq, desc, ilike } from "drizzle-orm";
import { generateId } from "../../../lib/ids.js";
import { getUserId } from "../../../lib/requireUser.js";

export default async function handler(req, res) {
  const userId = getUserId(req);

  if (req.method === "GET") {
    const { status, verfahren, q } = req.query;
    const filters = [eq(bewertung.userId, userId)];
    if (status) filters.push(eq(bewertung.status, status));
    if (verfahren) filters.push(eq(bewertung.verfahren, verfahren));
    if (q) filters.push(ilike(bewertung.objektName, `%${q}%`));

    const rows = await db
      .select({
        id: bewertung.id,
        objektName: bewertung.objektName,
        ort: bewertung.ort,
        verfahren: bewertung.verfahren,
        status: bewertung.status,
        monteCarlo: bewertung.monteCarlo,
        createdAt: bewertung.createdAt,
        updatedAt: bewertung.updatedAt,
      })
      .from(bewertung)
      .where(and(...filters))
      .orderBy(desc(bewertung.updatedAt));

    // Liste schlank halten: nur Perzentile + mean aus monteCarlo durchreichen
    const list = rows.map((r) => ({
      ...r,
      monteCarlo: r.monteCarlo
        ? { mean: r.monteCarlo.mean, percentiles: r.monteCarlo.percentiles }
        : null,
    }));
    return res.status(200).json(list);
  }

  if (req.method === "POST") {
    const { objektName, ort, verfahren, status, inputs, ergebnis, monteCarlo } =
      req.body ?? {};
    if (!objektName || !verfahren) {
      return res.status(400).json({ error: "objektName und verfahren erforderlich" });
    }
    const now = new Date();
    const entry = {
      id: generateId("bw"),
      userId,
      objektName,
      ort: ort ?? null,
      verfahren,
      status: status ?? "abgeschlossen",
      inputs: inputs ?? null,
      ergebnis: ergebnis ?? null,
      monteCarlo: monteCarlo ?? null,
      createdAt: now,
      updatedAt: now,
    };
    const [created] = await db.insert(bewertung).values(entry).returning();
    return res.status(201).json(created);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
