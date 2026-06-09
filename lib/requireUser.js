import { createHmac, timingSafeEqual } from "node:crypto";

export function getUserId(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const secret = process.env.NETLIFY_IDENTITY_JWT_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;

  try {
    const expected = createHmac("sha256", secret)
      .update(`${header}.${payload}`)
      .digest("base64url");
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (claims.exp && claims.exp < Date.now() / 1000) return null;
    return claims.sub || null;
  } catch {
    return null;
  }
}

export function requireUserId(req, res) {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Nicht autorisiert" });
    return null;
  }
  return userId;
}
