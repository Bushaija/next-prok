import { db } from '@/db';
import { 
  contractManagements,
  ContractManagement,
  NewContractManagement,
  UpdateContractManagement,
  contractManagementSchema,
  newContractManagementSchema,
  updateContractManagementSchema
} from '@/db/schema';
import { eq, and, like, gte, lte, or } from 'drizzle-orm';

export class ContractManagementService {
  /**
   * Create a new contract management record
   */
  async create(data: NewContractManagement): Promise<ContractManagement> {
    // Validate data with Zod schema
    const validatedData = newContractManagementSchema.parse(data);
    
    const [result] = await db.insert(contractManagements).values(validatedData).returning();
    
    // Validate the result with the full schema
    return contractManagementSchema.parse(result);
  }

  /**
   * Get all contract management records
   */
  async getAll(): Promise<ContractManagement[]> {
    const results = await db.select().from(contractManagements).orderBy(contractManagements.createdAt);
    // Validate each result with the schema
    return results.map(result => contractManagementSchema.parse(result));
  }

  /**
   * Get contract management by ID
   */
  async getById(id: number): Promise<ContractManagement | null> {
    const result = await db
      .select()
      .from(contractManagements)
      .where(eq(contractManagements.id, id));
    
    if (!result[0]) return null;
    
    // Validate the result with the schema
    return contractManagementSchema.parse(result[0]);
  }

  /**
   * Update a contract management record
   */
  async update(id: number, data: UpdateContractManagement): Promise<ContractManagement | null> {
    // Validate data with Zod schema
    const validatedData = updateContractManagementSchema.parse(data);
    
    const [result] = await db
      .update(contractManagements)
      .set(validatedData)
      .where(eq(contractManagements.id, id))
      .returning();
    
    if (!result) return null;
    
    // Validate the result with the schema
    return contractManagementSchema.parse(result);
  }

  /**
   * Delete a contract management record
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(contractManagements)
      .where(eq(contractManagements.id, id))
      .returning({ id: contractManagements.id });
    
    return result.length > 0;
  }

  /**
   * Search for contract management records based on criteria
   */
  async search(criteria: Partial<ContractManagement> & { 
    dateFrom?: Date, 
    dateTo?: Date,
    contractSigningIds?: number[]
  }): Promise<ContractManagement[]> {
    let query = db.select().from(contractManagements);
    
    // Build the where clause based on the criteria
    const whereConditions = [];
    
    if (criteria.id !== undefined) {
      whereConditions.push(eq(contractManagements.id, criteria.id));
    }
    
    if (criteria.tenderTitle !== undefined) {
      whereConditions.push(like(contractManagements.tenderTitle, `%${criteria.tenderTitle}%`));
    }
    
    if (criteria.status !== undefined) {
      whereConditions.push(eq(contractManagements.status, criteria.status));
    }
    
    if (criteria.contractSigningId !== undefined) {
      whereConditions.push(eq(contractManagements.contractSigningId, criteria.contractSigningId));
    }
    
    if (criteria.contractSigningIds && criteria.contractSigningIds.length > 0) {
      // Handle multiple contractSigningIds by using IN clause (implemented as OR)
      const contractSigningConditions = criteria.contractSigningIds.map(id => 
        eq(contractManagements.contractSigningId, id)
      );
      whereConditions.push(or(...contractSigningConditions));
    }
    
    if (criteria.procurementStaff !== undefined) {
      whereConditions.push(like(contractManagements.procurementStaff, `%${criteria.procurementStaff}%`));
    }
    
    if (criteria.inspectionDoneBy !== undefined) {
      whereConditions.push(like(contractManagements.inspectionDoneBy, `%${criteria.inspectionDoneBy}%`));
    }
    
    // Date range filters for tenderExecutionStartDate
    if (criteria.dateFrom) {
      whereConditions.push(gte(contractManagements.tenderExecutionStartDate, criteria.dateFrom));
    }
    
    if (criteria.dateTo) {
      whereConditions.push(lte(contractManagements.tenderExecutionEndDate, criteria.dateTo));
    }
    
    // Apply conditions if there are any
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions) as any);
    }
    
    const results = await query.orderBy(contractManagements.createdAt);
    
    // Validate each result with the schema
    return results.map(result => contractManagementSchema.parse(result));
  }

  /**
   * Get contract managements by contract signing ID
   */
  async getByContractSigningId(contractSigningId: number): Promise<ContractManagement[]> {
    const results = await db
      .select()
      .from(contractManagements)
      .where(eq(contractManagements.contractSigningId, contractSigningId))
      .orderBy(contractManagements.createdAt);
    
    // Validate each result with the schema
    return results.map(result => contractManagementSchema.parse(result));
  }
} 