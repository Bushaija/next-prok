import { db } from '@/db';
import { 
  publications, 
  publicationSchema, 
  newPublicationSchema, 
  updatePublicationSchema,
  Publication,
  NewPublication,
  UpdatePublication
} from '@/db/schema';
import { eq, and, or, like } from 'drizzle-orm';

export class PublicationService {
  /**
   * Create a new publication record
   */
  async create(data: NewPublication): Promise<Publication> {
    // Validate the data with Zod schema
    const validatedData = newPublicationSchema.parse(data);
    
    const [result] = await db.insert(publications).values(validatedData).returning();
    
    // Validate the result with the schema
    return publicationSchema.parse(result);
  }

  /**
   * Get all publication records
   */
  async getAll(): Promise<Publication[]> {
    const results = await db.select().from(publications);
    
    // Validate each result with the schema
    return results.map(result => publicationSchema.parse(result));
  }

  /**
   * Get a publication record by ID
   */
  async getById(id: number): Promise<Publication | null> {
    const [result] = await db.select().from(publications).where(eq(publications.id, id));
    
    if (!result) {
      return null;
    }
    
    // Validate the result with the schema
    return publicationSchema.parse(result);
  }

  /**
   * Update a publication record
   */
  async update(id: number, data: UpdatePublication): Promise<Publication | null> {
    // Validate the data with Zod schema
    const validatedData = updatePublicationSchema.parse(data);
    
    const [result] = await db
      .update(publications)
      .set(validatedData)
      .where(eq(publications.id, id))
      .returning();
    
    if (!result) {
      return null;
    }
    
    // Validate the result with the schema
    return publicationSchema.parse(result);
  }

  /**
   * Delete a publication record
   */
  async delete(id: number): Promise<boolean> {
    const [result] = await db
      .delete(publications)
      .where(eq(publications.id, id))
      .returning({ id: publications.id });
    
    return !!result;
  }

  /**
   * Search for publication records based on criteria
   */
  async search(criteria: Partial<Publication>): Promise<Publication[]> {
    let query = db.select().from(publications);
    
    // Build the where clause based on the criteria
    const whereConditions = [];
    
    if (criteria.id !== undefined) {
      whereConditions.push(eq(publications.id, criteria.id));
    }
    
    if (criteria.tenderTitle !== undefined) {
      whereConditions.push(like(publications.tenderTitle, `%${criteria.tenderTitle}%`));
    }
    
    if (criteria.revision !== undefined) {
      whereConditions.push(eq(publications.revision, criteria.revision));
    }
    
    if (criteria.planningId !== undefined) {
      whereConditions.push(eq(publications.planningId, criteria.planningId));
    }
    
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    
    const results = await query;
    
    // Validate each result with the schema
    return results.map(result => publicationSchema.parse(result));
  }
} 