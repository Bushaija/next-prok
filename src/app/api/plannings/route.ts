import { NextRequest, NextResponse } from 'next/server';
import { PlanningService } from '@/services/planningService';
import { newPlanningSchema, updatePlanningSchema } from '@/db/schema';
import { z } from 'zod';

const planningService = new PlanningService();

// GET handler - fetch all plannings or a specific planning by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, fetch a specific planning
    if (id) {
      const planningId = parseInt(id, 10);
      
      // Validate ID format
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
    }
    
    // Check if there are search parameters
    const searchCriteria: Record<string, any> = {};
    
    // Extract search parameters
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'id') {
        searchCriteria[key] = value;
      }
    }
    
    // If search criteria exist, perform a search
    if (Object.keys(searchCriteria).length > 0) {
      const results = await planningService.search(searchCriteria);
      return NextResponse.json(results);
    }
    
    // Otherwise, fetch all plannings
    const plannings = await planningService.getAll();
    return NextResponse.json(plannings);
  } catch (error) {
    console.error('Error in GET /api/plannings:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch plannings' },
      { status: 500 }
    );
  }
}

// POST handler - create a new planning
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = newPlanningSchema.parse(body);
    
    const planning = await planningService.create(validatedData);
    
    return NextResponse.json(planning, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/plannings:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create planning' },
      { status: 500 }
    );
  }
}

// PUT handler - update an existing planning
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }
    
    const planningId = parseInt(id, 10);
    
    // Validate ID format
    if (isNaN(planningId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = updatePlanningSchema.parse(body);
    
    const planning = await planningService.update(planningId, validatedData);
    
    if (!planning) {
      return NextResponse.json(
        { error: 'Planning not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(planning);
  } catch (error) {
    console.error('Error in PUT /api/plannings:', error);
    
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

// DELETE handler - delete a planning
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }
    
    const planningId = parseInt(id, 10);
    
    // Validate ID format
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
    console.error('Error in DELETE /api/plannings:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete planning' },
      { status: 500 }
    );
  }
} 