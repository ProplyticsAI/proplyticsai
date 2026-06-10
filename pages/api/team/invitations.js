import { db } from "../../../db/index.js";
import { teamInvitation } from "../../../db/schema.js";
import { eq, asc } from "drizzle-orm";
import { generateId } from "../../../lib/ids.js";
import { requireUserId } from "../../../lib/requireUser.js";

export default async function handler(req, res) {
  const ownerId = await requireUserId(req, res);
  if (!ownerId) return;

  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(teamInvitation)
      .where(eq(teamInvitation.ownerId, ownerId))
      .orderBy(asc(teamInvitation.createdAt));
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { email, role } = req.body ?? {};
    if (!email || !role) {
      return res.status(400).json({ error: "email und role erforderlich" });
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    const [invitation] = await db
      .insert(teamInvitation)
      .values({
        id: generateId("inv"),
        ownerId,
        email,
        role,
        status: "ausstehend",
        expiresAt,
      })
      .returning();
    // Versand der Einladungs-Mail folgt über Identity-Invite (Phase 3-Ausbau)
    return res.status(201).json(invitation);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
