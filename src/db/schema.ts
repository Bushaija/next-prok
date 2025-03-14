import { pgTable, serial, integer, text, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const tableA = pgTable("table_a", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull(),
    test1: integer("test1"),
    test2: integer("test2"),
    test3: integer("test3"),
    status: text("status").default("pending"),
});

export const tableB = pgTable("table_b", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull(),
    test1: integer("test1"),
    test2: integer("test2"),    
    test3: integer("test3"),
    status: text("status").default("pending"),
    dependsOn: integer("depends_on").references(() => tableA.id, { onDelete: "cascade" }),
});

export const tableC = pgTable("table_c", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").notNull(),
    test1: integer("test1"),
    test2: integer("test2"),
    test3: integer("test3"),
    status: text("status").default("pending"),
    dependsOn: integer("depends_on").references(() => tableB.id, { onDelete: "cascade" }),
});

// Item Identification Table
export const itemIdentifications = pgTable("item_identifications", {
  id: serial("id").primaryKey(),
  division: varchar("division", { length: 255 }),
  financialYear: integer("financial_year"),
  managerEmail: varchar("manager_email", { length: 255 }),
  divisionManagerPhone: varchar("division_manager_phone", { length: 50 }),
  contractManagerPhone: varchar("contract_manager_phone", { length: 50 }),
  tenderTitle: varchar("tender_title", { length: 255 }),
  category: varchar("category", { length: 100 }),
  quantity: integer("quantity"),
  budget: integer("budget"),
  estimatedAmount: integer("estimated_amount"),
  technicalSpecification: text("technical_specification"),
  marketSurveyReport: text("market_survey_report"),
  timelineForDelivery: timestamp("timeline_for_delivery"),
  status: varchar("status", { length: 50 }),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
});

// Planning Table
export const plannings = pgTable("plannings", {
  id: serial("id").primaryKey(),
  tenderTitle: varchar("tender_title", { length: 255 }),
  tenderFinalGivenTitle: varchar("tender_final_given_title", { length: 255 }),
  tenderMethods: varchar("tender_methods", { length: 255 }),
  estimatedBudget: integer("estimated_budget"),
  tenderType: varchar("tender_type", { length: 50 }),
  frameworkType: varchar("framework_type", { length: 50 }),
  plannedTenderDocumentPreparation: timestamp("planned_tender_document_preparation"),
  plannedPublicationDate: timestamp("planned_publication_date"),
  plannedBidOpeningDate: timestamp("planned_bid_opening_date"),
  plannedEvaluationDate: timestamp("planned_evaluation_date"),
  plannedNotificationDate: timestamp("planned_notification_date"),
  plannedContractClosureDate: timestamp("planned_contract_closure_date"),
  planningStatus: varchar("planning_status", { length: 50 }),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
  // Optional reference to identification
  identificationId: integer("identification_id").references(() => itemIdentifications.id, { onDelete: "set null" }),
});

// Publication Table
export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  tenderTitle: varchar("tender_title", { length: 255 }),
  initialProcurementPlanPublication: timestamp("initial_procurement_plan_publication"),
  quarterIIProcurementPlanPublication: timestamp("quarter_ii_procurement_plan_publication"),
  quarterIIIProcurementPlanPublication: timestamp("quarter_iii_procurement_plan_publication"),
  revision: text("revision"),
  tatPublication: integer("tat_publication"),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
  // Optional reference to planning
  planningId: integer("planning_id").references(() => plannings.id, { onDelete: "set null" }),
});

// Publication Tender Table
export const publicationTenders = pgTable("publication_tenders", {
  id: serial("id").primaryKey(),
  tenderTitle: varchar("tender_title", { length: 255 }),
  dateOfPreparationOfTenderDocument: timestamp("date_of_preparation_of_tender_document"),
  dateOfSubmissionOfTheDocumentCommitteeForApproval: timestamp("date_of_submission_of_the_document_committee_for_approval"),
  dateOfCBMApproval: timestamp("date_of_cbm_approval"),
  dateOfTenderPublication: timestamp("date_of_tender_publication"),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
  // Optional reference to publication
  publicationId: integer("publication_id").references(() => publications.id, { onDelete: "set null" }),
});

// Define Zod schemas for validation and type inference
export const itemIdentificationSchema = z.object({
    id: z.number(),
    division: z.string(),
    financialYear: z.coerce.number().int().positive("Financial year must be a positive integer"),
    managerEmail: z.string().email("Invalid email address"),
    divisionManagerPhone: z.string(),
    contractManagerPhone: z.string(),
    tenderTitle: z.string(),
    category: z.string(),
    quantity: z.coerce.number().int(),
    budget: z.coerce.number().int(),
    estimatedAmount: z.coerce.number().int(),
    technicalSpecification: z.string(),
    marketSurveyReport: z.string().optional().nullable(),
    timelineForDelivery: z.coerce.date(), // 🔥 Fix: Auto-convert string to Date
    status: z.string(),
    createdAt: z.coerce.date(), // 🔥 Fix: Auto-convert string to Date
    updatedAt: z.coerce.date(), // 🔥 Fix: Auto-convert string to Date
});

// Planning schema
export const planningSchema = z.object({
  id: z.number(),
  tenderTitle: z.string(),
  tenderFinalGivenTitle: z.string(),
  tenderMethods: z.string(),
  estimatedBudget: z.coerce.number().int(),
  tenderType: z.string(),
  frameworkType: z.string(),
  plannedTenderDocumentPreparation: z.coerce.date(),
  plannedPublicationDate: z.coerce.date(),
  plannedBidOpeningDate: z.coerce.date(),
  plannedEvaluationDate: z.coerce.date(),
  plannedNotificationDate: z.coerce.date(),
  plannedContractClosureDate: z.coerce.date(),
  planningStatus: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  identificationId: z.number().optional().nullable(),
});

// Publication schema
export const publicationSchema = z.object({
  id: z.number(),
  tenderTitle: z.string(),
  initialProcurementPlanPublication: z.coerce.date(),
  quarterIIProcurementPlanPublication: z.coerce.date(),
  quarterIIIProcurementPlanPublication: z.coerce.date(),
  revision: z.string(),
  tatPublication: z.coerce.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  planningId: z.number().optional().nullable(),
});

// Publication Tender schema
export const publicationTenderSchema = z.object({
  id: z.number(),
  tenderTitle: z.string().optional(),
  dateOfPreparationOfTenderDocument: z.coerce.date(),
  dateOfSubmissionOfTheDocumentCommitteeForApproval: z.coerce.date(),
  dateOfCBMApproval: z.coerce.date(),
  dateOfTenderPublication: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publicationId: z.number().optional().nullable(),
});

// Schema for creating a new item identification (without id and timestamps)
export const newItemIdentificationSchema = itemIdentificationSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Schema for creating a new planning (without id and timestamps)
export const newPlanningSchema = planningSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Schema for creating a new publication (without id and timestamps)
export const newPublicationSchema = publicationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Schema for creating a new publication tender (without id and timestamps)
export const newPublicationTenderSchema = publicationTenderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Schema for updating an item identification (all fields optional)
export const updateItemIdentificationSchema = newItemIdentificationSchema.partial();

// Schema for updating a planning (all fields optional)
export const updatePlanningSchema = newPlanningSchema.partial();

// Schema for updating a publication (all fields optional)
export const updatePublicationSchema = newPublicationSchema.partial();

// Schema for updating a publication tender (all fields optional)
export const updatePublicationTenderSchema = newPublicationTenderSchema.partial();

// Define types from Zod schemas
export type ItemIdentification = z.infer<typeof itemIdentificationSchema>;
export type NewItemIdentification = z.infer<typeof newItemIdentificationSchema>;
export type UpdateItemIdentification = z.infer<typeof updateItemIdentificationSchema>;

export type Planning = z.infer<typeof planningSchema>;
export type NewPlanning = z.infer<typeof newPlanningSchema>;
export type UpdatePlanning = z.infer<typeof updatePlanningSchema>;

export type Publication = z.infer<typeof publicationSchema>;
export type NewPublication = z.infer<typeof newPublicationSchema>;
export type UpdatePublication = z.infer<typeof updatePublicationSchema>;

export type PublicationTender = z.infer<typeof publicationTenderSchema>;
export type NewPublicationTender = z.infer<typeof newPublicationTenderSchema>;
export type UpdatePublicationTender = z.infer<typeof updatePublicationTenderSchema>;

// Relations definitions
export const itemIdentificationsRelations = relations(itemIdentifications, ({ one, many }) => ({
  plannings: many(plannings),
}));

export const planningsRelations = relations(plannings, ({ one, many }) => ({
  identification: one(itemIdentifications, {
    fields: [plannings.identificationId],
    references: [itemIdentifications.id],
  }),
  publications: many(publications),
}));

export const publicationsRelations = relations(publications, ({ one, many }) => ({
  planning: one(plannings, {
    fields: [publications.planningId],
    references: [plannings.id],
  }),
  publicationTenders: many(publicationTenders),
}));

export const publicationTendersRelations = relations(publicationTenders, ({ one }) => ({
  publication: one(publications, {
    fields: [publicationTenders.publicationId],
    references: [publications.id],
  }),
}));

// You can add more tables for other form types here

