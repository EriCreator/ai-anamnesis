CREATE TABLE IF NOT EXISTS "AnamnesisReport" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar NOT NULL,
	"fullName" varchar NOT NULL,
	"ahvNumber" varchar NOT NULL,
	"urgency" varchar NOT NULL,
	"summary" text NOT NULL,
	"symptoms" text NOT NULL,
	"suggestedMedicaments" text NOT NULL,
	"suggestedTreatment" text NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AnamnesisReport" ADD CONSTRAINT "AnamnesisReport_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
