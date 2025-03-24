import { NextRequest, NextResponse } from 'next/server';
import { BidEvaluationService } from '@/services/bidEvaluationService';
import { 
  newBidEvaluationSchema
} from '@/db/schema';

const bidEvaluationService = new BidEvaluationService();

// GET handler to retrieve all bid evaluations or filter by criteria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const openBidId = searchParams.get('openBidId');
    const tenderTitle = searchParams.get('tenderTitle');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const evaluationTeam = searchParams.get('evaluationTeam');
    
    // If search parameters are provided, use search function
    if (openBidId || tenderTitle || status || dateFrom || dateTo || evaluationTeam) {
      const searchCriteria: any = {};
      
      if (openBidId) {
        const parsedId = parseInt(openBidId, 10);
        if (!isNaN(parsedId)) {
          searchCriteria.openBidId = parsedId;
        }
      }
      
      if (tenderTitle) {
        searchCriteria.tenderTitle = tenderTitle;
      }
      
      if (status) {
        searchCriteria.status = status;
      }
      
      if (evaluationTeam) {
        searchCriteria.evaluationTeam = evaluationTeam;
      }
      
      if (dateFrom) {
        try {
          searchCriteria.dateFrom = new Date(dateFrom);
        } catch (error) {
          return NextResponse.json({ error: 'Invalid dateFrom format' }, { status: 400 });
        }
      }
      
      if (dateTo) {
        try {
          searchCriteria.dateTo = new Date(dateTo);
        } catch (error) {
          return NextResponse.json({ error: 'Invalid dateTo format' }, { status: 400 });
        }
      }
      
      const results = await bidEvaluationService.search(searchCriteria);
      return NextResponse.json(results);
    }
    
    // Otherwise, fetch all bid evaluations
    const evaluations = await bidEvaluationService.getAll();
    return NextResponse.json(evaluations);
  } catch (error) {
    console.error('Error fetching bid evaluations:', error);
    return NextResponse.json({ error: 'Failed to fetch bid evaluations' }, { status: 500 });
  }
}

// POST handler to create a new bid evaluation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = newBidEvaluationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Create the new bid evaluation
    const newEvaluation = await bidEvaluationService.create(validationResult.data);
    
    return NextResponse.json(newEvaluation, { status: 201 });
  } catch (error) {
    console.error('Error creating bid evaluation:', error);
    return NextResponse.json({ error: 'Failed to create bid evaluation' }, { status: 500 });
  }
}

// PUT handler to update an existing bid evaluation
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
    
    // Validate request body using Zod
    const validationResult = updateBidEvaluationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the bid evaluation exists
    const existingEvaluation = await bidEvaluationService.getById(id);
    if (!existingEvaluation) {
      return NextResponse.json({ error: 'Bid evaluation not found' }, { status: 404 });
    }
    
    // Update the bid evaluation
    const updatedEvaluation = await bidEvaluationService.update(id, validationResult.data);
    
    return NextResponse.json(updatedEvaluation);
  } catch (error) {
    console.error('Error updating bid evaluation:', error);
    return NextResponse.json({ error: 'Failed to update bid evaluation' }, { status: 500 });
  }
}

// DELETE handler to delete a bid evaluation
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
    
    // Check if the bid evaluation exists
    const existingEvaluation = await bidEvaluationService.getById(id);
    if (!existingEvaluation) {
      return NextResponse.json({ error: 'Bid evaluation not found' }, { status: 404 });
    }
    
    // Delete the bid evaluation
    const success = await bidEvaluationService.delete(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete bid evaluation' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting bid evaluation:', error);
    return NextResponse.json({ error: 'Failed to delete bid evaluation' }, { status: 500 });
  }
} 