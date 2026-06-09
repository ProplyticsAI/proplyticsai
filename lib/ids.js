import { randomBytes } from "crypto";

// Kurze, präfixierte ID (z. B. bw_8f3a1c) — kollisionsarm für Demo/Produktion.
export function generateId(prefix) {
  return `${prefix}_${randomBytes(5).toString("hex")}`;
}
