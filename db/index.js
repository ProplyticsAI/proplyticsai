// Drizzle-Client für Netlify Database. Der Adapter wählt den Treiber
// laufzeitabhängig automatisch — keine Connection-String-Konfiguration nötig.
import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema.js";

export const db = drizzle({ schema });
