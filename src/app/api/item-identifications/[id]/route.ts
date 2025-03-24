import { NextRequest, NextResponse } from 'next/server';
import { ItemIdentificationService } from '@/services/itemIdentificationService';
import { z } from 'zod';
import { updateItemIdentificationSchema } from '@/db/schema';

const itemIdentificationService = new ItemIdentificationService();

// GET handler for dynamic route /api/item-identifications/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("Dynamic route ID:", id);
    
    // Validate ID format
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const itemIdentification = await itemIdentificationService.getById(itemId);
    
    if (!itemIdentification) {
      return NextResponse.json(
        { error: 'Item Identification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(itemIdentification);
  } catch (error) {
    console.error('Error in GET /api/item-identifications/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch item identification' },
      { status: 500 }
    );
  }
}

// PUT handler for dynamic route /api/item-identifications/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = updateItemIdentificationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the item identification exists
    const existingItem = await itemIdentificationService.getById(itemId);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item Identification not found' },
        { status: 404 }
      );
    }
    
    const itemIdentification = await itemIdentificationService.update(itemId, validationResult.data);
    
    if (!itemIdentification) {
      return NextResponse.json(
        { error: 'Item Identification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(itemIdentification);
  } catch (error) {
    console.error('Error in PUT /api/item-identifications/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update item identification' },
      { status: 500 }
    );
  }
}

// DELETE handler for dynamic route /api/item-identifications/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Check if the item identification exists
    const existingItem = await itemIdentificationService.getById(itemId);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item Identification not found' },
        { status: 404 }
      );
    }
    
    const success = await itemIdentificationService.delete(itemId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Item Identification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/item-identifications/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete item identification' },
      { status: 500 }
    );
  }
} 