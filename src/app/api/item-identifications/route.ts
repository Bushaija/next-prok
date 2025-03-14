import { NextRequest, NextResponse } from 'next/server';
import { itemIdentificationService } from '@/services/itemIdentificationService';
import { 
  newItemIdentificationSchema, 
  updateItemIdentificationSchema 
} from '@/db/schema';

// GET handler to retrieve all item identifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const itemId = parseInt(id, 10);
      if (isNaN(itemId)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      
      const item = await itemIdentificationService.getById(itemId);
      if (!item) {
        return NextResponse.json({ error: 'Item identification not found' }, { status: 404 });
      }
      
      return NextResponse.json(item);
    }
    
    const items = await itemIdentificationService.getAll();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching item identifications:', error);
    return NextResponse.json({ error: 'Failed to fetch item identifications' }, { status: 500 });
  }
}

// POST handler to create a new item identification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Received body:", body);

    // Validate request body using Zod
    const validationResult = newItemIdentificationSchema.safeParse(body);

    console.log("Validation result:", validationResult);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Zod now correctly converts the string timestamp to Date
    const newItem = await itemIdentificationService.create(validationResult.data);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating item identification:", error);
    return NextResponse.json(
      { error: "Failed to create item identification" },
      { status: 500 }
    );
  }
}


// PUT handler to update an existing item identification
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    
    if (!idParam) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }
    
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Validate request body using the schema from db/schema.ts
    const validationResult = updateItemIdentificationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Convert string date to Date object if provided
    const data = {
      ...validationResult.data,
      timelineForDelivery: validationResult.data.timelineForDelivery 
        ? new Date(validationResult.data.timelineForDelivery) 
        : undefined,
    };
    
    const updatedItem = await itemIdentificationService.update(id, data);
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item identification not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating item identification:', error);
    return NextResponse.json({ error: 'Failed to update item identification' }, { status: 500 });
  }
}

// DELETE handler to delete an item identification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    
    if (!idParam) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }
    
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    const success = await itemIdentificationService.delete(id);
    if (!success) {
      return NextResponse.json({ error: 'Item identification not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item identification:', error);
    return NextResponse.json({ error: 'Failed to delete item identification' }, { status: 500 });
  }
} 