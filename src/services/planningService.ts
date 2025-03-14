import { db } from '@/db';
import { 
  plannings, 
  planningSchema, 
  newPlanningSchema, 
  updatePlanningSchema,
  Planning,
  NewPlanning,
  UpdatePlanning
} from '@/db/schema';
import { eq, and, or, like } from 'drizzle-orm';

export class PlanningService {
  /**
   * Create a new planning record
   */
  async create(data: NewPlanning): Promise<Planning> {
    // Validate the data with Zod schema
    const validatedData = newPlanningSchema.parse(data);
    
    const [result] = await db.insert(plannings).values(validatedData).returning();
    
    // Validate the result with the schema
    return planningSchema.parse(result);
  }

  /**
   * Get all planning records
   */
  async getAll(): Promise<Planning[]> {
    const results = await db.select().from(plannings);
    
    // Validate each result with the schema
    return results.map(result => planningSchema.parse(result));
  }

  /**
   * Get a planning record by ID
   */
  async getById(id: number): Promise<Planning | null> {
    const [result] = await db.select().from(plannings).where(eq(plannings.id, id));
    
    if (!result) {
      return null;
    }
    
    // Validate the result with the schema
    return planningSchema.parse(result);
  }

  /**
   * Update a planning record
   */
  async update(id: number, data: UpdatePlanning): Promise<Planning | null> {
    // Validate the data with Zod schema
    const validatedData = updatePlanningSchema.parse(data);
    
    const [result] = await db
      .update(plannings)
      .set(validatedData)
      .where(eq(plannings.id, id))
      .returning();
    
    if (!result) {
      return null;
    }
    
    // Validate the result with the schema
    return planningSchema.parse(result);
  }

  /**
   * Delete a planning record
   */
  async delete(id: number): Promise<boolean> {
    const [result] = await db
      .delete(plannings)
      .where(eq(plannings.id, id))
      .returning({ id: plannings.id });
    
    return !!result;
  }

  /**
   * Search for planning records based on criteria
   */
  async search(criteria: Partial<Planning>): Promise<Planning[]> {
    let query = db.select().from(plannings);
    
    // Build the where clause based on the criteria
    const whereConditions = [];
    
    if (criteria.id !== undefined) {
      whereConditions.push(eq(plannings.id, criteria.id));
    }
    
    if (criteria.tenderTitle !== undefined) {
      whereConditions.push(like(plannings.tenderTitle, `%${criteria.tenderTitle}%`));
    }
    
    if (criteria.estimatedBudget !== undefined) {
      whereConditions.push(eq(plannings.estimatedBudget, criteria.estimatedBudget));
    }
    
    if (criteria.planningStatus !== undefined) {
      whereConditions.push(eq(plannings.planningStatus, criteria.planningStatus));
    }
    
    if (criteria.identificationId !== undefined) {
      whereConditions.push(eq(plannings.identificationId, criteria.identificationId));
    }
    
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }
    
    const results = await query;
    
    // Validate each result with the schema
    return results.map(result => planningSchema.parse(result));
  }
} 