import { db } from '@/db';
import { 
  openingBids, 
  OpeningBid,
  NewOpeningBid,
  UpdateOpeningBid,
  openingBidSchema,
  newOpeningBidSchema,
  updateOpeningBidSchema
} from '@/db/schema';
import { eq, and, like, gte, lte, or } from 'drizzle-orm';

export class OpenBidService {
  /**
   * Create a new opening bid record
   */
  async create(data: NewOpeningBid): Promise<OpeningBid> {
    // Validate data with Zod schema
    const validatedData = newOpeningBidSchema.parse(data);
    
    // const result = await db.insert(openingBids).values({
    //   ...validatedData,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }).returning();
    const [result] = await db.insert(openingBids).values(validatedData).returning();
    
    // Validate the result with the full schema
    return openingBidSchema.parse(result);
  }

  /**
   * Get all opening bid records
   */
  async getAll(): Promise<OpeningBid[]> {
    const results = await db.select().from(openingBids).orderBy(openingBids.createdAt);
    // Validate each result with the schema
    return results.map(result => openingBidSchema.parse(result));
  }

  /**
   * Get opening bid by ID
   */
  async getById(id: number): Promise<OpeningBid | null> {
    const result = await db
      .select()
      .from(openingBids)
      .where(eq(openingBids.id, id));
    
    if (!result[0]) return null;
    
    // Validate the result with the schema
    return openingBidSchema.parse(result[0]);
  }

  /**
   * Update an opening bid record
   */
  async update(id: number, data: UpdateOpeningBid): Promise<OpeningBid | null> {
    // Validate data with Zod schema
    const validatedData = updateOpeningBidSchema.parse(data);
    
    const [result] = await db
      .update(openingBids)
      .set(validatedData)
      .where(eq(openingBids.id, id))
      .returning();
    
    if (!result) return null;
    
    // Validate the result with the schema
    return openingBidSchema.parse(result);
  }

  /**
   * Delete an opening bid record
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(openingBids)
      .where(eq(openingBids.id, id))
      .returning({ id: openingBids.id });
    
    return result.length > 0;
  }

  /**
   * Search for opening bid records based on criteria
   */
  async search(criteria: Partial<OpeningBid> & { 
    dateFrom?: Date, 
    dateTo?: Date,
    publicationTenderIds?: number[]
  }): Promise<OpeningBid[]> {
    let query = db.select().from(openingBids);
    
    // Build the where clause based on the criteria
    const whereConditions = [];
    
    if (criteria.id !== undefined) {
      whereConditions.push(eq(openingBids.id, criteria.id));
    }
    
    if (criteria.tenderTitle !== undefined) {
      whereConditions.push(like(openingBids.tenderTitle, `%${criteria.tenderTitle}%`));
    }
    
    if (criteria.status !== undefined) {
      whereConditions.push(eq(openingBids.status, criteria.status));
    }
    
    if (criteria.publicationTenderId !== undefined) {
      whereConditions.push(like(openingBids.publicationTenderId, `%${criteria.publicationTenderId}%`));
    }
    
    if (criteria.publicationTenderIds && criteria.publicationTenderIds.length > 0) {
      // Handle multiple publicationTenderIds by using IN clause (implemented as OR)
      const publicationTenderConditions = criteria.publicationTenderIds.map(id => 
        eq(openingBids.publicationTenderId, id)
      );
      whereConditions.push(or(...publicationTenderConditions));
    }
    
    // Date range filters
    if (criteria.dateFrom) {
      whereConditions.push(gte(openingBids.bidOpeningDate, criteria.dateFrom));
    }
    
    if (criteria.dateTo) {
      whereConditions.push(lte(openingBids.bidOpeningDate, criteria.dateTo));
    }
    
    // Apply conditions if there are any
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    
    const results = await query.orderBy(openingBids.createdAt);
    
    // Validate each result with the schema
    return results.map(result => openingBidSchema.parse(result));
  }

  /**
   * Get opening bids by publication tender ID
   */
  async getByPublicationTenderId(publicationTenderId: number): Promise<OpeningBid[]> {
    const results = await db
      .select()
      .from(openingBids)
      .where(eq(openingBids.publicationTenderId, publicationTenderId))
      .orderBy(openingBids.createdAt);
    
    // Validate each result with the schema
    return results.map(result => openingBidSchema.parse(result));
  }
} 