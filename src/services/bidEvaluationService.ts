import { db } from '@/db';
import { 
  bidEvaluations,
  BidEvaluation,
  NewBidEvaluation,
  UpdateBidEvaluation,
  bidEvaluationSchema,
  newBidEvaluationSchema,
  updateBidEvaluationSchema
} from '@/db/schema';
import { eq, and, like, gte, lte, or } from 'drizzle-orm';

export class BidEvaluationService {
  /**
   * Create a new bid evaluation record
   */
  async create(data: NewBidEvaluation): Promise<BidEvaluation> {
    // Validate data with Zod schema
    const validatedData = newBidEvaluationSchema.parse(data);
    
    const [result] = await db.insert(bidEvaluations).values(validatedData).returning();
    
    // Validate the result with the full schema
    return bidEvaluationSchema.parse(result);
  }

  /**
   * Get all bid evaluation records
   */
  async getAll(): Promise<BidEvaluation[]> {
    const results = await db.select().from(bidEvaluations).orderBy(bidEvaluations.createdAt);
    // Validate each result with the schema
    return results.map(result => bidEvaluationSchema.parse(result));
  }

  /**
   * Get bid evaluation by ID
   */
  async getById(id: number): Promise<BidEvaluation | null> {
    const result = await db
      .select()
      .from(bidEvaluations)
      .where(eq(bidEvaluations.id, id));
    
    if (!result[0]) return null;
    
    // Validate the result with the schema
    return bidEvaluationSchema.parse(result[0]);
  }

  /**
   * Update a bid evaluation record
   */
  async update(id: number, data: UpdateBidEvaluation): Promise<BidEvaluation | null> {
    // Validate data with Zod schema
    const validatedData = updateBidEvaluationSchema.parse(data);
    
    const [result] = await db
      .update(bidEvaluations)
      .set(validatedData)
      .where(eq(bidEvaluations.id, id))
      .returning();
    
    if (!result) return null;
    
    // Validate the result with the schema
    return bidEvaluationSchema.parse(result);
  }

  /**
   * Delete a bid evaluation record
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(bidEvaluations)
      .where(eq(bidEvaluations.id, id))
      .returning({ id: bidEvaluations.id });
    
    return result.length > 0;
  }

  /**
   * Search for bid evaluation records based on criteria
   */
  async search(criteria: Partial<BidEvaluation> & { 
    dateFrom?: Date, 
    dateTo?: Date,
    openingBidIds?: number[]
  }): Promise<BidEvaluation[]> {
    let query = db.select().from(bidEvaluations);
    
    // Build the where clause based on the criteria
    const whereConditions = [];
    
    if (criteria.id !== undefined) {
      whereConditions.push(eq(bidEvaluations.id, criteria.id));
    }
    
    if (criteria.tenderTitle !== undefined) {
      whereConditions.push(like(bidEvaluations.tenderTitle, `%${criteria.tenderTitle}%`));
    }
    
    if (criteria.status !== undefined) {
      whereConditions.push(eq(bidEvaluations.status, criteria.status));
    }
    
    if (criteria.openingBidId !== undefined) {
      whereConditions.push(eq(bidEvaluations.openingBidId, criteria.openingBidId));
    }
    
    if (criteria.openingBidIds && criteria.openingBidIds.length > 0) {
      // Handle multiple openingBidIds by using IN clause (implemented as OR)
      const openingBidConditions = criteria.openingBidIds.map(id => 
        eq(bidEvaluations.openingBidId, id)
      );
      whereConditions.push(or(...openingBidConditions));
    }
    
    // Date range filters for bidEvaluationDate
    if (criteria.dateFrom) {
      whereConditions.push(gte(bidEvaluations.bidEvaluationDate, criteria.dateFrom));
    }
    
    if (criteria.dateTo) {
      whereConditions.push(lte(bidEvaluations.bidEvaluationDate, criteria.dateTo));
    }
    
    // Apply conditions if there are any
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions) as any);
    }
    
    const results = await query.orderBy(bidEvaluations.createdAt);
    
    // Validate each result with the schema
    return results.map(result => bidEvaluationSchema.parse(result));
  }

  /**
   * Get bid evaluations by opening bid ID
   */
  async getByOpeningBidId(openingBidId: number): Promise<BidEvaluation[]> {
    const results = await db
      .select()
      .from(bidEvaluations)
      .where(eq(bidEvaluations.openingBidId, openingBidId))
      .orderBy(bidEvaluations.createdAt);
    
    // Validate each result with the schema
    return results.map(result => bidEvaluationSchema.parse(result));
  }
} 