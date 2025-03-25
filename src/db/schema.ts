import { pgTable, serial, integer, text, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";


// Item Identification Table
export const itemIdentifications = pgTable("item_identifications", {
  id: serial("id").primaryKey(),
  procurementDivision: varchar("procurement_division", { length: 255 }),
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

// Opening Bids Table
export const openingBids = pgTable("opening_bids", {
  id: serial("id").primaryKey(),
  tenderTitle: varchar("tender_title", { length: 255 }),
  bidOpeningDate: timestamp("bid_opening_date"),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
  // Reference to publication tender
  publicationTenderId: integer("publication_tender_id").references(() => publicationTenders.id, { onDelete: "set null" }),
});

export const bidEvaluations = pgTable("bid_evaluations", {
  id: serial("id").primaryKey(),
  tenderTitle: varchar("tender_title", { length: 255 }),
  bidEvaluationDate: timestamp("bid_evaluation_date"),
  bidValidityStartingDate: timestamp("bid_validity_starting_date"),
  bidValidityEndingDate: timestamp("bid_validity_ending_date"),
  notificationDate: timestamp("notification_date"),
  contractNegotiationDate: timestamp("contract_negotiation_date"),
  contractAmount: integer("contract_amount"),
  status: varchar("status", { length: 50 }).default("Pending"),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
  // Reference to opening bid
  openingBidId: integer("opening_bid_id").references(() => openingBids.id, { onDelete: "set null" }),
});

// Contract Signing Table
export const contractSignings = pgTable("contract_signings", {
  id: serial("id").primaryKey(),
  tenderTitle: varchar("tender_title", { length: 255 }),
  draftOfTheContractDate: timestamp("draft_of_the_contract_date"),
  reviewAndApprovalByTheLegalDate: timestamp("review_and_approval_by_the_legal_date"),
  contractorBidderApprovalDate: timestamp("contractor_bidder_approval_date"),
  contractorBidderNames: varchar("contractor_bidder_names", { length: 255 }),
  contractorBidderEmail: varchar("contractor_bidder_email", { length: 255 }),
  contractorBidderPhoneNumber: varchar("contractor_bidder_phone_number", { length: 50 }),
  performanceGuaranteeValidityStartDate: timestamp("performance_guarantee_validity_start_date"),
  performanceGuaranteeValidityEndDate: timestamp("performance_guarantee_validity_end_date"),
  submissionOfPerformanceGuaranteeDate: timestamp("submission_of_performance_guarantee_date"),
  approvalOfContractByTheMOJDate: timestamp("approval_of_contract_by_the_moj_date"),
  approvalOfTheCBMDate: timestamp("approval_of_the_cbm_date"),
  contractStartDate: timestamp("contract_start_date"),
  contractEndDate: timestamp("contract_end_date"),
  status: varchar("status", { length: 50 }).default("Pending"),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
  // Reference to bid evaluation
  bidEvaluationId: integer("bid_evaluation_id").references(() => bidEvaluations.id, { onDelete: "set null" }),
});

// Contract Management Table
export const contractManagements = pgTable("contract_managements", {
  id: serial("id").primaryKey(),
  tenderTitle: varchar("tender_title", { length: 255 }),
  dateOfPurchaseOrderIssue: timestamp("date_of_purchase_order_issue"),
  divisionIssuingAPurchaseOrder: varchar("division_issuing_a_purchase_order", { length: 255 }),
  focalPerformanceFromTheProgram: varchar("focal_performance_from_the_program", { length: 255 }),
  procurementStaff: varchar("procurement_staff", { length: 255 }),
  performanceGuaranteeEndPeriod: timestamp("performance_guarantee_end_period"),
  tenderExecutionStartDate: timestamp("tender_execution_start_date"),
  tenderExecutionEndDate: timestamp("tender_execution_end_date"),
  inspectionDoneBy: varchar("inspection_done_by", { length: 255 }),
  inspectionList: varchar("inspection_list", { length: 50 }),
  deliveryDate: timestamp("delivery_date"),
  acceptanceDate: timestamp("acceptance_date"),
  warrantyLiabilityStartDate: timestamp("warranty_liability_start_date"),
  warrantyLiabilityEndDate: timestamp("warranty_liability_end_date"),
  status: varchar("status", { length: 50 }).default("Pending"),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
  // Reference to contract signing
  contractSigningId: integer("contract_signing_id").references(() => contractSignings.id, { onDelete: "set null" }),
});

// Invoice Table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  tenderTitle: varchar("tender_title", { length: 255 }),
  invoiceSubmissionDate: timestamp("invoice_submission_date"),
  invoiceReceivedByTheFinanceOfficeDate: timestamp("invoice_received_by_the_finance_office_date"),
  requestedForPaymentDate: timestamp("requested_for_payment_date"),
  dateOfInvoicePayment: timestamp("date_of_invoice_payment"),
  status: varchar("status", { length: 50 }).default("Pending"),
  createdAt: timestamp("created_at", {mode: "string"}).defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"}).defaultNow(),
  // Reference to contract management
  contractManagementId: integer("contract_management_id").references(() => contractManagements.id, { onDelete: "set null" }),
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

// Opening Bids schema
export const openingBidSchema = z.object({
  id: z.number(),
  tenderTitle: z.string(),
  bidOpeningDate: z.coerce.date(),
  publicationTenderId: z.number().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// New opening bid schema
export const newOpeningBidSchema = openingBidSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update opening bid schema
export const updateOpeningBidSchema = newOpeningBidSchema.partial();

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

export type OpeningBid = z.infer<typeof openingBidSchema>;
export type NewOpeningBid = z.infer<typeof newOpeningBidSchema>;
export type UpdateOpeningBid = z.infer<typeof updateOpeningBidSchema>;

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

export const publicationTendersRelations = relations(publicationTenders, ({ one, many }) => ({
  publication: one(publications, {
    fields: [publicationTenders.publicationId],
    references: [publications.id],
  }),
  openingBids: many(openingBids),
}));

export const openingBidsRelations = relations(openingBids, ({ one }) => ({
  publicationTender: one(publicationTenders, {
    fields: [openingBids.publicationTenderId],
    references: [publicationTenders.id],
  }),
}));

// Bid Evaluation Table

// Bid Evaluation schema
export const bidEvaluationSchema = z.object({
  id: z.number(),
  tenderTitle: z.string(),
  bidEvaluationDate: z.coerce.date(),
  bidValidityStartingDate: z.coerce.date(),
  bidValidityEndingDate: z.coerce.date(),
  notificationDate: z.coerce.date(),
  contractNegotiationDate: z.coerce.date(),
  contractAmount: z.coerce.number().int(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  openingBidId: z.number().optional().nullable(),
});

// Contract Signing schema
export const contractSigningSchema = z.object({
  id: z.number(),
  tenderTitle: z.string(),
  draftOfTheContractDate: z.coerce.date(),
  reviewAndApprovalByTheLegalDate: z.coerce.date(),
  contractorBidderApprovalDate: z.coerce.date(),
  contractorBidderNames: z.string(),
  contractorBidderEmail: z.string().email(),
  contractorBidderPhoneNumber: z.string(),
  performanceGuaranteeValidityStartDate: z.coerce.date(),
  performanceGuaranteeValidityEndDate: z.coerce.date(),
  submissionOfPerformanceGuaranteeDate: z.coerce.date(),
  approvalOfContractByTheMOJDate: z.coerce.date(),
  approvalOfTheCBMDate: z.coerce.date(),
  contractStartDate: z.coerce.date(),
  contractEndDate: z.coerce.date(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  bidEvaluationId: z.number().optional().nullable(),
});

// Contract Management schema
export const contractManagementSchema = z.object({
  id: z.number(),
  tenderTitle: z.string(),
  dateOfPurchaseOrderIssue: z.coerce.date(),
  divisionIssuingAPurchaseOrder: z.string(),
  focalPerformanceFromTheProgram: z.string(),
  procurementStaff: z.string(),
  performanceGuaranteeEndPeriod: z.coerce.date(),
  tenderExecutionStartDate: z.coerce.date(),
  tenderExecutionEndDate: z.coerce.date(),
  inspectionDoneBy: z.string(),
  inspectionList: z.string(),
  deliveryDate: z.coerce.date(),
  acceptanceDate: z.coerce.date(),
  warrantyLiabilityStartDate: z.coerce.date(),
  warrantyLiabilityEndDate: z.coerce.date(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contractSigningId: z.number().optional().nullable(),
});

// Invoice schema
export const invoiceSchema = z.object({
  id: z.number(),
  tenderTitle: z.string(),
  invoiceSubmissionDate: z.coerce.date(),
  invoiceReceivedByTheFinanceOfficeDate: z.coerce.date(),
  requestedForPaymentDate: z.coerce.date(),
  dateOfInvoicePayment: z.coerce.date(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contractManagementId: z.number().optional().nullable(),
});

// New schemas (without id and timestamps)
export const newBidEvaluationSchema = bidEvaluationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const newContractSigningSchema = contractSigningSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const newContractManagementSchema = contractManagementSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const newInvoiceSchema = invoiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schemas (all fields optional)
export const updateBidEvaluationSchema = newBidEvaluationSchema.partial();
export const updateContractSigningSchema = newContractSigningSchema.partial();
export const updateContractManagementSchema = newContractManagementSchema.partial();
export const updateInvoiceSchema = newInvoiceSchema.partial();

// Define types from Zod schemas
export type BidEvaluation = z.infer<typeof bidEvaluationSchema>;
export type NewBidEvaluation = z.infer<typeof newBidEvaluationSchema>;
export type UpdateBidEvaluation = z.infer<typeof updateBidEvaluationSchema>;

export type ContractSigning = z.infer<typeof contractSigningSchema>;
export type NewContractSigning = z.infer<typeof newContractSigningSchema>;
export type UpdateContractSigning = z.infer<typeof updateContractSigningSchema>;

export type ContractManagement = z.infer<typeof contractManagementSchema>;
export type NewContractManagement = z.infer<typeof newContractManagementSchema>;
export type UpdateContractManagement = z.infer<typeof updateContractManagementSchema>;

export type Invoice = z.infer<typeof invoiceSchema>;
export type NewInvoice = z.infer<typeof newInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;

// Extend relations with new tables
export const bidEvaluationsRelations = relations(bidEvaluations, ({ one, many }) => ({
  openingBid: one(openingBids, {
    fields: [bidEvaluations.openingBidId],
    references: [openingBids.id],
  }),
  contractSignings: many(contractSignings),
}));

export const contractSigningsRelations = relations(contractSignings, ({ one, many }) => ({
  bidEvaluation: one(bidEvaluations, {
    fields: [contractSignings.bidEvaluationId],
    references: [bidEvaluations.id],
  }),
  contractManagements: many(contractManagements),
}));

export const contractManagementsRelations = relations(contractManagements, ({ one, many }) => ({
  contractSigning: one(contractSignings, {
    fields: [contractManagements.contractSigningId],
    references: [contractSignings.id],
  }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  contractManagement: one(contractManagements, {
    fields: [invoices.contractManagementId],
    references: [contractManagements.id],
  }),
}));

// You can add more tables for other form types here

