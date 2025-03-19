import { db } from '@/db';
import { 
  invoices,
  Invoice,
  NewInvoice,
  UpdateInvoice,
  invoiceSchema,
  newInvoiceSchema,
  updateInvoiceSchema
} from '@/db/schema';
import { eq, and, like, gte, lte, or } from 'drizzle-orm';

export class InvoiceService {
  /**
   * Create a new invoice record
   */
  async create(data: NewInvoice): Promise<Invoice> {
    // Validate data with Zod schema
    const validatedData = newInvoiceSchema.parse(data);
    
    const [result] = await db.insert(invoices).values(validatedData).returning();
    
    // Validate the result with the full schema
    return invoiceSchema.parse(result);
  }

  /**
   * Get all invoice records
   */
  async getAll(): Promise<Invoice[]> {
    const results = await db.select().from(invoices).orderBy(invoices.createdAt);
    // Validate each result with the schema
    return results.map(result => invoiceSchema.parse(result));
  }

  /**
   * Get invoice by ID
   */
  async getById(id: number): Promise<Invoice | null> {
    const result = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id));
    
    if (!result[0]) return null;
    
    // Validate the result with the schema
    return invoiceSchema.parse(result[0]);
  }

  /**
   * Update an invoice record
   */
  async update(id: number, data: UpdateInvoice): Promise<Invoice | null> {
    // Validate data with Zod schema
    const validatedData = updateInvoiceSchema.parse(data);
    
    const [result] = await db
      .update(invoices)
      .set(validatedData)
      .where(eq(invoices.id, id))
      .returning();
    
    if (!result) return null;
    
    // Validate the result with the schema
    return invoiceSchema.parse(result);
  }

  /**
   * Delete an invoice record
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(invoices)
      .where(eq(invoices.id, id))
      .returning({ id: invoices.id });
    
    return result.length > 0;
  }

  /**
   * Search for invoice records based on criteria
   */
  async search(criteria: Partial<Invoice> & { 
    dateFrom?: Date, 
    dateTo?: Date,
    contractManagementIds?: number[]
  }): Promise<Invoice[]> {
    let query = db.select().from(invoices);
    
    // Build the where clause based on the criteria
    const whereConditions = [];
    
    if (criteria.id !== undefined) {
      whereConditions.push(eq(invoices.id, criteria.id));
    }
    
    if (criteria.tenderTitle !== undefined) {
      whereConditions.push(like(invoices.tenderTitle, `%${criteria.tenderTitle}%`));
    }
    
    if (criteria.status !== undefined) {
      whereConditions.push(eq(invoices.status, criteria.status));
    }
    
    if (criteria.contractManagementId !== undefined) {
      whereConditions.push(eq(invoices.contractManagementId, criteria.contractManagementId));
    }
    
    if (criteria.contractManagementIds && criteria.contractManagementIds.length > 0) {
      // Handle multiple contractManagementIds by using IN clause (implemented as OR)
      const contractManagementConditions = criteria.contractManagementIds.map(id => 
        eq(invoices.contractManagementId, id)
      );
      whereConditions.push(or(...contractManagementConditions));
    }
    
    // Date range filters for invoiceSubmissionDate
    if (criteria.dateFrom) {
      whereConditions.push(gte(invoices.invoiceSubmissionDate, criteria.dateFrom));
    }
    
    if (criteria.dateTo) {
      whereConditions.push(lte(invoices.dateOfInvoicePayment, criteria.dateTo));
    }
    
    // Apply conditions if there are any
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions) as any);
    }
    
    const results = await query.orderBy(invoices.createdAt);
    
    // Validate each result with the schema
    return results.map(result => invoiceSchema.parse(result));
  }

  /**
   * Get invoices by contract management ID
   */
  async getByContractManagementId(contractManagementId: number): Promise<Invoice[]> {
    const results = await db
      .select()
      .from(invoices)
      .where(eq(invoices.contractManagementId, contractManagementId))
      .orderBy(invoices.createdAt);
    
    // Validate each result with the schema
    return results.map(result => invoiceSchema.parse(result));
  }
} 