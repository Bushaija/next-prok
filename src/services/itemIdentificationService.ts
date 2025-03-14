import { db } from '@/db';
import { 
  itemIdentifications, 
  ItemIdentification, 
  NewItemIdentification,
  UpdateItemIdentification,
  itemIdentificationSchema,
  newItemIdentificationSchema,
  updateItemIdentificationSchema
} from '@/db/schema';
import { eq } from 'drizzle-orm';

export class ItemIdentificationService {
  // Create a new item identification
  async create(data: NewItemIdentification): Promise<ItemIdentification> {
    // Validate data with Zod schema
    const validatedData = newItemIdentificationSchema.parse(data);
    
    const result = await db.insert(itemIdentifications).values({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    // Validate the result with the full schema
    return itemIdentificationSchema.parse(result[0]);
  }

  // Get all item identifications
  async getAll(): Promise<ItemIdentification[]> {
    const results = await db.select().from(itemIdentifications).orderBy(itemIdentifications.createdAt);
    // Validate each result with the schema
    return results.map(result => itemIdentificationSchema.parse(result));
  }

  // Get item identification by ID
  async getById(id: number): Promise<ItemIdentification | null> {
    const result = await db
      .select()
      .from(itemIdentifications)
      .where(eq(itemIdentifications.id, id));
    
    if (!result[0]) return null;
    
    // Validate the result with the schema
    return itemIdentificationSchema.parse(result[0]);
  }

  // Update an item identification
  async update(id: number, data: UpdateItemIdentification): Promise<ItemIdentification | null> {
    // Validate data with Zod schema
    const validatedData = updateItemIdentificationSchema.parse(data);
    
    const result = await db
      .update(itemIdentifications)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(itemIdentifications.id, id))
      .returning();
    
    if (!result[0]) return null;
    
    // Validate the result with the schema
    return itemIdentificationSchema.parse(result[0]);
  }

  // Delete an item identification
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(itemIdentifications)
      .where(eq(itemIdentifications.id, id))
      .returning({ id: itemIdentifications.id });
    
    return result.length > 0;
  }

  // Search item identifications by various criteria
  async search(criteria: Partial<ItemIdentification>): Promise<ItemIdentification[]> {
    let query = db.select().from(itemIdentifications);
    
    // Add conditions based on provided criteria
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key in itemIdentifications) {
        query = query.where(eq(itemIdentifications[key as keyof typeof itemIdentifications], value));
      }
    });
    
    const results = await query.orderBy(itemIdentifications.createdAt);
    
    // Validate each result with the schema
    return results.map(result => itemIdentificationSchema.parse(result));
  }
}

// For backward compatibility
export const itemIdentificationService = new ItemIdentificationService(); 