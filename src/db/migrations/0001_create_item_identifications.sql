-- Create item_identifications table
CREATE TABLE IF NOT EXISTS "item_identifications" (
  "id" SERIAL PRIMARY KEY,
  "division" VARCHAR(255) NOT NULL,
  "financial_year" INTEGER NOT NULL,
  "manager_email" VARCHAR(255) NOT NULL,
  "division_manager_phone" VARCHAR(50) NOT NULL,
  "contract_manager_phone" VARCHAR(50) NOT NULL,
  "tender_title" VARCHAR(255) NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "quantity" INTEGER NOT NULL,
  "budget" INTEGER NOT NULL,
  "estimated_amount" INTEGER NOT NULL,
  "technical_specification" TEXT NOT NULL,
  "market_survey_report" TEXT,
  "timeline_for_delivery" TIMESTAMP NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add indexes for common query patterns
CREATE INDEX idx_item_identifications_division ON "item_identifications" ("division");
CREATE INDEX idx_item_identifications_financial_year ON "item_identifications" ("financial_year");
CREATE INDEX idx_item_identifications_tender_title ON "item_identifications" ("tender_title");
CREATE INDEX idx_item_identifications_status ON "item_identifications" ("status"); 