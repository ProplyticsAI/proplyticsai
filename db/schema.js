// proplytic.ai — Datenbankschema (Drizzle ORM / Netlify Database)
// Siehe docs/db-schema-bewertungen-persistenz.md für das fachliche Modell.
import { pgTable, pgEnum, text, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";

export const verfahrenEnum = pgEnum("verfahren", ["ertragswert", "sachwert"]);
export const statusEnum = pgEnum("bewertung_status", ["entwurf", "abgeschlossen", "archiviert"]);
export const planEnum = pgEnum("plan", ["starter", "pro", "enterprise"]);

// Nutzer — gespiegelt aus Netlify Identity (id = Identity-`sub`).
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: text("name"),
  company: text("company"),
  plan: planEnum("plan").notNull().default("starter"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Bewertung — abgeschlossene oder als Entwurf gespeicherte Verfahrensbewertung.
// inputs/ergebnis/monteCarlo bewusst als jsonb (Feldstruktur variiert je Verfahren).
export const bewertung = pgTable("bewertung", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  objektName: text("objekt_name").notNull(),
  ort: text("ort"),
  verfahren: verfahrenEnum("verfahren").notNull(),
  status: statusEnum("status").notNull().default("abgeschlossen"),
  inputs: jsonb("inputs"),
  ergebnis: jsonb("ergebnis"),
  monteCarlo: jsonb("monte_carlo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Team-Mitglieder und Einladungen (Enterprise-Mandant).
export const teamMember = pgTable("team_member", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  userId: text("user_id"),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: text("role").notNull().default("mitglied"),
  status: text("status").notNull().default("aktiv"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teamInvitation = pgTable("team_invitation", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  role: text("role").notNull().default("mitglied"),
  status: text("status").notNull().default("ausstehend"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});
