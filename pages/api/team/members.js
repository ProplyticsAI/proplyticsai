import { db } from "../../../db/index.js";
import { teamMember } from "../../../db/schema.js";
import { eq, asc } from "drizzle-orm";
import { generateId } from "../../../lib/ids.js";
import { requireUserId } from "../../../lib/requireUser.js";

export default async function handler(req, res) {
  const ownerId = requireUserId(req, res);
  if (!ownerId) return;

  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(teamMember)
      .where(eq(teamMember.ownerId, ownerId))
      .orderBy(asc(teamMember.createdAt));
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { email, role, name } = req.body ?? {};
    if (!email || !role) {
      return res.status(400).json({ error: "email und role erforderlich" });
    }
    const [member] = await db
      .insert(teamMember)
      .values({
        id: generateId("mbr"),
        ownerId,
        name: name || email.split("@")[0],
        email,
        role,
        status: "aktiv",
      })
      .returning();
    return res.status(201).json(member);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
