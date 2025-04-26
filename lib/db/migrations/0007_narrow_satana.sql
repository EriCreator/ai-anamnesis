ALTER TABLE "User" ADD COLUMN "firstName" varchar(64) DEFAULT 'Anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "lastName" varchar(64) DEFAULT 'User' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "dateOfBirth" date;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "ahvNumber" varchar(64);