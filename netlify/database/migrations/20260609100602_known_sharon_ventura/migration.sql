CREATE TYPE "plan" AS ENUM('starter', 'pro', 'enterprise');--> statement-breakpoint
CREATE TYPE "bewertung_status" AS ENUM('entwurf', 'abgeschlossen', 'archiviert');--> statement-breakpoint
CREATE TYPE "verfahren" AS ENUM('ertragswert', 'sachwert');--> statement-breakpoint
CREATE TABLE "bewertung" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"objekt_name" text NOT NULL,
	"ort" text,
	"verfahren" "verfahren" NOT NULL,
	"status" "bewertung_status" DEFAULT 'abgeschlossen'::"bewertung_status" NOT NULL,
	"inputs" jsonb,
	"ergebnis" jsonb,
	"monte_carlo" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_invitation" (
	"id" text PRIMARY KEY,
	"owner_id" text NOT NULL,
	"email" varchar(320) NOT NULL,
	"role" text DEFAULT 'mitglied' NOT NULL,
	"status" text DEFAULT 'ausstehend' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"id" text PRIMARY KEY,
	"owner_id" text NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"email" varchar(320) NOT NULL,
	"role" text DEFAULT 'mitglied' NOT NULL,
	"status" text DEFAULT 'aktiv' NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"email" varchar(320) NOT NULL UNIQUE,
	"name" text,
	"company" text,
	"plan" "plan" DEFAULT 'starter'::"plan" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
