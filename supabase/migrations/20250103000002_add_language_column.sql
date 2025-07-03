-- Add language column to cases table
ALTER TABLE "public"."cases"
ADD COLUMN "language" text NOT NULL DEFAULT 'English';

-- Add language column to agents table
ALTER TABLE "public"."agents"
ADD COLUMN "language" text NOT NULL DEFAULT 'English';

-- Add comments for documentation
COMMENT ON COLUMN "public"."cases"."language" IS 'Language of the case content (default: English)';
COMMENT ON COLUMN "public"."agents"."language" IS 'Language for agent communication (default: English)';
