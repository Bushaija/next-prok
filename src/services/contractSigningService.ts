import { db } from '@/db';
import { 
  contractSignings,
  ContractSigning,
  NewContractSigning,
  UpdateContractSigning,
  contractSigningSchema,
  newContractSigningSchema,
  updateContractSigningSchema
} from '@/db/schema';
import { eq, and, like, gte, lte, or } from 'drizzle-orm';

export class ContractSigningService {
  /**
   * Create a new contract signing record
   */
  async create(data: NewContractSigning): Promise<ContractSigning> {
    // Validate data with Zod schema
    const validatedData = newContractSigningSchema.parse(data);
    
    const [result] = await db.insert(contractSignings).values(validatedData).returning();
    
    // Validate the result with the full schema
    return contractSigningSchema.parse(result);
  }

  /**
   * Get all contract signing records
   */
  async getAll(): Promise<ContractSigning[]> {
    const results = await db.select().from(contractSignings).orderBy(contractSignings.createdAt);
    // Validate each result with the schema
    return results.map(result => contractSigningSchema.parse(result));
  }

  /**
   * Get contract signing by ID
   */
  async getById(id: number): Promise<ContractSigning | null> {
    const result = await db
      .select()
      .from(contractSignings)
      .where(eq(contractSignings.id, id));
    
    if (!result[0]) return null;
    
    // Validate the result with the schema
    return contractSigningSchema.parse(result[0]);
  }

  /**
   * Update a contract signing record
   */
  async update(id: number, data: UpdateContractSigning): Promise<ContractSigning | null> {
    // Validate data with Zod schema
    const validatedData = updateContractSigningSchema.parse(data);
    
    const [result] = await db
      .update(contractSignings)
      .set(validatedData)
      .where(eq(contractSignings.id, id))
      .returning();
    
    if (!result) return null;
    
    // Validate the result with the schema
    return contractSigningSchema.parse(result);
  }

  /**
   * Delete a contract signing record
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(contractSignings)
      .where(eq(contractSignings.id, id))
      .returning({ id: contractSignings.id });
    
    return result.length > 0;
  }

  /**
   * Search for contract signing records based on criteria
   */
  async search(criteria: Partial<ContractSigning> & { 
    dateFrom?: Date, 
    dateTo?: Date,
    bidEvaluationIds?: number[]
  }): Promise<ContractSigning[]> {
    let query = db.select().from(contractSignings);
    
    // Build the where clause based on the criteria
    const whereConditions = [];
    
    if (criteria.id !== undefined) {
      whereConditions.push(eq(contractSignings.id, criteria.id));
    }
    
    if (criteria.tenderTitle !== undefined) {
      whereConditions.push(like(contractSignings.tenderTitle, `%${criteria.tenderTitle}%`));
    }
    
    if (criteria.status !== undefined) {
      whereConditions.push(eq(contractSignings.status, criteria.status));
    }
    
    if (criteria.bidEvaluationId !== undefined) {
      whereConditions.push(eq(contractSignings.bidEvaluationId, criteria.bidEvaluationId));
    }
    
    if (criteria.bidEvaluationIds && criteria.bidEvaluationIds.length > 0) {
      // Handle multiple bidEvaluationIds by using IN clause (implemented as OR)
      const bidEvaluationConditions = criteria.bidEvaluationIds.map(id => 
        eq(contractSignings.bidEvaluationId, id)
      );
      whereConditions.push(or(...bidEvaluationConditions));
    }
    
    if (criteria.contractorBidderNames !== undefined) {
      whereConditions.push(like(contractSignings.contractorBidderNames, `%${criteria.contractorBidderNames}%`));
    }
    
    if (criteria.contractorBidderEmail !== undefined) {
      whereConditions.push(like(contractSignings.contractorBidderEmail, `%${criteria.contractorBidderEmail}%`));
    }
    
    // Date range filters for contractStartDate
    if (criteria.dateFrom) {
      whereConditions.push(gte(contractSignings.contractStartDate, criteria.dateFrom));
    }
    
    if (criteria.dateTo) {
      whereConditions.push(lte(contractSignings.contractEndDate, criteria.dateTo));
    }
    
    // Apply conditions if there are any
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions) as any);
    }
    
    const results = await query.orderBy(contractSignings.createdAt);
    
    // Validate each result with the schema
    return results.map(result => contractSigningSchema.parse(result));
  }

  /**
   * Get contract signings by bid evaluation ID
   */
  async getByBidEvaluationId(bidEvaluationId: number): Promise<ContractSigning[]> {
    const results = await db
      .select()
      .from(contractSignings)
      .where(eq(contractSignings.bidEvaluationId, bidEvaluationId))
      .orderBy(contractSignings.createdAt);
    
    // Validate each result with the schema
    return results.map(result => contractSigningSchema.parse(result));
  }
} 