import { NextRequest, NextResponse } from 'next/server';
import { PlanningService } from '@/services/planningService';
import { z } from 'zod';

const planningService = new PlanningService();

// GET handler for dynamic route /api/plannings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("Dynamic route ID:", id);
    
    // Validate ID format
    const planningId = parseInt(id, 10);
    if (isNaN(planningId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const planning = await planningService.getById(planningId);
    
    if (!planning) {
      return NextResponse.json(
        { error: 'Planning not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(planning);
  } catch (error) {
    console.error('Error in GET /api/plannings/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch planning' },
      { status: 500 }
    );
  }
}

// PUT handler for dynamic route /api/plannings/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const planningId = parseInt(id, 10);
    if (isNaN(planningId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const planning = await planningService.update(planningId, body);
    
    if (!planning) {
      return NextResponse.json(
        { error: 'Planning not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(planning);
  } catch (error) {
    console.error('Error in PUT /api/plannings/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update planning' },
      { status: 500 }
    );
  }
}

// DELETE handler for dynamic route /api/plannings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const planningId = parseInt(id, 10);
    if (isNaN(planningId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const success = await planningService.delete(planningId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Planning not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/plannings/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete planning' },
      { status: 500 }
    );
  }
} 