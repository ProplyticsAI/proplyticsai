import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { requireUserId } from "../../../lib/requireUser.js";

// Liefert den aktuellen Nutzer anhand des Identity-Tokens (Authorization-Header).
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  const userId = await requireUserId(req, res);
  if (!userId) return;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return res.status(404).json({ error: "Nutzer nicht synchronisiert" });
  return res.status(200).json({ user });
}
