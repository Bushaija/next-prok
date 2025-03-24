import { NextRequest, NextResponse } from 'next/server';
import { OpenBidService } from '@/services/openBidService';
import { z } from 'zod';
import { updateOpeningBidSchema } from '@/db/schema';

const openBidService = new OpenBidService();

// GET handler for dynamic route /api/open-bids/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("Dynamic route ID:", id);
    
    // Validate ID format
    const openBidId = parseInt(id, 10);
    if (isNaN(openBidId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const openBid = await openBidService.getById(openBidId);
    
    if (!openBid) {
      return NextResponse.json(
        { error: 'Open Bid not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(openBid);
  } catch (error) {
    console.error('Error in GET /api/open-bids/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch open bid' },
      { status: 500 }
    );
  }
}

// PUT handler for dynamic route /api/open-bids/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const openBidId = parseInt(id, 10);
    if (isNaN(openBidId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = updateOpeningBidSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the open bid exists
    const existingOpenBid = await openBidService.getById(openBidId);
    if (!existingOpenBid) {
      return NextResponse.json(
        { error: 'Open Bid not found' },
        { status: 404 }
      );
    }
    
    const openBid = await openBidService.update(openBidId, validationResult.data);
    
    if (!openBid) {
      return NextResponse.json(
        { error: 'Open Bid not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(openBid);
  } catch (error) {
    console.error('Error in PUT /api/open-bids/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update open bid' },
      { status: 500 }
    );
  }
}

// DELETE handler for dynamic route /api/open-bids/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const openBidId = parseInt(id, 10);
    if (isNaN(openBidId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Check if the open bid exists
    const existingOpenBid = await openBidService.getById(openBidId);
    if (!existingOpenBid) {
      return NextResponse.json(
        { error: 'Open Bid not found' },
        { status: 404 }
      );
    }
    
    const success = await openBidService.delete(openBidId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Open Bid not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/open-bids/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete open bid' },
      { status: 500 }
    );
  }
} 