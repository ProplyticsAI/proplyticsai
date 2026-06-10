import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { requireUserId } from "../../../lib/requireUser.js";

// Spiegelt den (über Netlify Identity authentifizierten) Nutzer in die
// users-Tabelle. Idempotent — beim ersten Login/Registrieren aufgerufen.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  const userId = await requireUserId(req, res);
  if (!userId) return;

  const { email, name, company } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "email erforderlich" });

  const [existing] = await db.select().from(users).where(eq(users.id, userId));
  if (existing) {
    const [updated] = await db
      .update(users)
      .set({ email, name: name ?? existing.name, company: company ?? existing.company })
      .where(eq(users.id, userId))
      .returning();
    return res.status(200).json(updated);
  }

  const [created] = await db
    .insert(users)
    .values({ id: userId, email, name: name ?? null, company: company ?? null })
    .returning();
  return res.status(201).json(created);
}
