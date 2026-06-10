import { db } from "../../../db/index.js";
import { bewertung } from "../../../db/schema.js";
import { and, eq } from "drizzle-orm";
import { requireUserId } from "../../../lib/requireUser.js";

export default async function handler(req, res) {
  const userId = await requireUserId(req, res);
  if (!userId) return;
  const { id } = req.query;
  const scope = and(eq(bewertung.id, id), eq(bewertung.userId, userId));

  if (req.method === "GET") {
    const [row] = await db.select().from(bewertung).where(scope);
    if (!row) return res.status(404).json({ error: "nicht gefunden" });
    return res.status(200).json(row);
  }

  if (req.method === "PATCH") {
    const { status, monteCarlo } = req.body ?? {};
    const patch = { updatedAt: new Date() };
    if (status !== undefined) patch.status = status;
    if (monteCarlo !== undefined) patch.monteCarlo = monteCarlo;

    const [updated] = await db
      .update(bewertung)
      .set(patch)
      .where(scope)
      .returning();
    if (!updated) return res.status(404).json({ error: "nicht gefunden" });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const [deleted] = await db.delete(bewertung).where(scope).returning();
    if (!deleted) return res.status(404).json({ error: "nicht gefunden" });
    return res.status(200).json({ success: true, id });
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  res.status(405).end();
}
