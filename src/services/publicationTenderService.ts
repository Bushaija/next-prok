import { db } from '@/db';
import { 
  publicationTenders, 
  publicationTenderSchema, 
  newPublicationTenderSchema, 
  updatePublicationTenderSchema,
  PublicationTender,
  NewPublicationTender,
  UpdatePublicationTender
} from '@/db/schema';
import { eq, and, or, like } from 'drizzle-orm';

export class PublicationTenderService {
  /**
   * Create a new publication tender record
   */
  async create(data: NewPublicationTender): Promise<PublicationTender> {
    // Validate the data with Zod schema
    const validatedData = newPublicationTenderSchema.parse(data);
    
    const [result] = await db.insert(publicationTenders).values(validatedData).returning();
    
    // Validate the result with the schema
    return publicationTenderSchema.parse(result);
  }

  /**
   * Get all publication tender records
   */
  async getAll(): Promise<PublicationTender[]> {
    const results = await db.select().from(publicationTenders);
    
    // Validate each result with the schema
    return results.map(result => publicationTenderSchema.parse(result));
  }

  /**
   * Get a publication tender record by ID
   */
  async getById(id: number): Promise<PublicationTender | null> {
    const [result] = await db.select().from(publicationTenders).where(eq(publicationTenders.id, id));
    
    if (!result) {
      return null;
    }
    
    // Validate the result with the schema
    return publicationTenderSchema.parse(result);
  }

  /**
   * Update a publication tender record
   */
  async update(id: number, data: UpdatePublicationTender): Promise<PublicationTender | null> {
    // Validate the data with Zod schema
    const validatedData = updatePublicationTenderSchema.parse(data);
    
    const [result] = await db
      .update(publicationTenders)
      .set(validatedData)
      .where(eq(publicationTenders.id, id))
      .returning();
    
    if (!result) {
      return null;
    }
    
    // Validate the result with the schema
    return publicationTenderSchema.parse(result);
  }

  /**
   * Delete a publication tender record
   */
  async delete(id: number): Promise<boolean> {
    const [result] = await db
      .delete(publicationTenders)
      .where(eq(publicationTenders.id, id))
      .returning({ id: publicationTenders.id });
    
    return !!result;
  }

  /**
   * Search for publication tender records based on criteria
   */
  async search(criteria: Partial<PublicationTender>): Promise<PublicationTender[]> {
    let query = db.select().from(publicationTenders);
    
    // Build the where clause based on the criteria
    const whereConditions = [];
    
    if (criteria.id !== undefined) {
      whereConditions.push(eq(publicationTenders.id, criteria.id));
    }
    
    if (criteria.tenderTitle !== undefined) {
      whereConditions.push(like(publicationTenders.tenderTitle, `%${criteria.tenderTitle}%`));
    }
    
    if (criteria.dateOfTenderPublication !== undefined) {
      whereConditions.push(eq(publicationTenders.dateOfTenderPublication, criteria.dateOfTenderPublication));
    }
    
    if (criteria.publicationId !== undefined) {
      whereConditions.push(eq(publicationTenders.publicationId, criteria.publicationId));
    }
    
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    
    const results = await query;
    
    // Validate each result with the schema
    return results.map(result => publicationTenderSchema.parse(result));
  }
} 