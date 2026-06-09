import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { getUserId } from "../../../lib/requireUser.js";

// Liefert den aktuellen Nutzer anhand des Identity-Tokens (Authorization-Header).
// Ohne Token → Demo-Nutzer (Phase-1-Übergang, s. lib/requireUser.js).
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  const userId = getUserId(req);
  if (userId === "demo") {
    return res.status(200).json({
      user: { id: "demo", name: "Alex Klein", email: "demo@proplytic.ai", plan: "pro" },
    });
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return res.status(404).json({ error: "Nutzer nicht synchronisiert" });
  return res.status(200).json({ user });
}
