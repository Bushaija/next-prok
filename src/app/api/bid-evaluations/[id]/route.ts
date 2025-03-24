import { NextRequest, NextResponse } from 'next/server';
import { BidEvaluationService } from '@/services/bidEvaluationService';
import { z } from 'zod';
import { updateBidEvaluationSchema } from '@/db/schema';

const bidEvaluationService = new BidEvaluationService();

// GET handler for dynamic route /api/bid-evaluations/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("Dynamic route ID:", id);
    
    // Validate ID format
    const bidEvaluationId = parseInt(id, 10);
    if (isNaN(bidEvaluationId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const bidEvaluation = await bidEvaluationService.getById(bidEvaluationId);
    
    if (!bidEvaluation) {
      return NextResponse.json(
        { error: 'Bid Evaluation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(bidEvaluation);
  } catch (error) {
    console.error('Error in GET /api/bid-evaluations/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch bid evaluation' },
      { status: 500 }
    );
  }
}

// PUT handler for dynamic route /api/bid-evaluations/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const bidEvaluationId = parseInt(id, 10);
    if (isNaN(bidEvaluationId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = updateBidEvaluationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the bid evaluation exists
    const existingBidEvaluation = await bidEvaluationService.getById(bidEvaluationId);
    if (!existingBidEvaluation) {
      return NextResponse.json(
        { error: 'Bid Evaluation not found' },
        { status: 404 }
      );
    }
    
    const bidEvaluation = await bidEvaluationService.update(bidEvaluationId, validationResult.data);
    
    if (!bidEvaluation) {
      return NextResponse.json(
        { error: 'Bid Evaluation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(bidEvaluation);
  } catch (error) {
    console.error('Error in PUT /api/bid-evaluations/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update bid evaluation' },
      { status: 500 }
    );
  }
}

// DELETE handler for dynamic route /api/bid-evaluations/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const bidEvaluationId = parseInt(id, 10);
    if (isNaN(bidEvaluationId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Check if the bid evaluation exists
    const existingBidEvaluation = await bidEvaluationService.getById(bidEvaluationId);
    if (!existingBidEvaluation) {
      return NextResponse.json(
        { error: 'Bid Evaluation not found' },
        { status: 404 }
      );
    }
    
    const success = await bidEvaluationService.delete(bidEvaluationId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Bid Evaluation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/bid-evaluations/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete bid evaluation' },
      { status: 500 }
    );
  }
} 