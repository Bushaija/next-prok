import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { OpenBidService } from '@/services/openBidService';
import { 
  openingBidSchema,
  newOpeningBidSchema, 
  updateOpeningBidSchema 
} from '@/db/schema';

const openBidService = new OpenBidService();

// GET handler to retrieve all opening bids or filter by ID or other criteria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const publicationTenderId = searchParams.get('publicationTenderId');
    const tenderTitle = searchParams.get('tenderTitle');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    // If ID is provided, fetch a specific opening bid
    if (id) {
      const bidId = parseInt(id, 10);
      if (isNaN(bidId)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      
      const bid = await openBidService.getById(bidId);
      if (!bid) {
        return NextResponse.json({ error: 'Opening bid not found' }, { status: 404 });
      }
      
      return NextResponse.json(bid);
    }
    
    // If search parameters are provided, use search function
    if (publicationTenderId || tenderTitle || status || dateFrom || dateTo) {
      const searchCriteria: any = {};
      
      if (publicationTenderId) {
        const parsedId = parseInt(publicationTenderId, 10);
        if (!isNaN(parsedId)) {
          searchCriteria.publicationTenderId = parsedId;
        }
      }
      
      if (tenderTitle) {
        searchCriteria.tenderTitle = tenderTitle;
      }
      
      if (status) {
        searchCriteria.status = status;
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
      
      const results = await openBidService.search(searchCriteria);
      return NextResponse.json(results);
    }
    
    // Otherwise, fetch all opening bids
    const bids = await openBidService.getAll();
    return NextResponse.json(bids);
  } catch (error) {
    console.error('Error fetching opening bids:', error);
    return NextResponse.json({ error: 'Failed to fetch opening bids' }, { status: 500 });
  }
}

// POST handler to create a new opening bid
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = newOpeningBidSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Create the new opening bid
    const newBid = await openBidService.create(validationResult.data);
    
    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    console.error('Error creating opening bid:', error);
    return NextResponse.json({ error: 'Failed to create opening bid' }, { status: 500 });
  }
}

// PUT handler to update an existing opening bid
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
    const validationResult = updateOpeningBidSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the opening bid exists
    const existingBid = await openBidService.getById(id);
    if (!existingBid) {
      return NextResponse.json({ error: 'Opening bid not found' }, { status: 404 });
    }
    
    // Update the opening bid
    const updatedBid = await openBidService.update(id, validationResult.data);
    
    return NextResponse.json(updatedBid);
  } catch (error) {
    console.error('Error updating opening bid:', error);
    return NextResponse.json({ error: 'Failed to update opening bid' }, { status: 500 });
  }
}

// DELETE handler to delete an opening bid
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
    
    // Check if the opening bid exists
    const existingBid = await openBidService.getById(id);
    if (!existingBid) {
      return NextResponse.json({ error: 'Opening bid not found' }, { status: 404 });
    }
    
    // Delete the opening bid
    const success = await openBidService.delete(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete opening bid' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting opening bid:', error);
    return NextResponse.json({ error: 'Failed to delete opening bid' }, { status: 500 });
  }
}

// Zod schema for bid evaluation
export const bidEvaluationSchema = z.object({
  evaluationDate: z.date(),
  evaluatorName: z.string().min(1),
  score: z.number().min(0),
  comments: z.string().optional(),
});

// Update the form field definitions
export const openingBidsFormFields = [
  {
    name: "tenderTitle",
    title: "Tender Title",
    type: "text",
    placeholder: "Enter tender title",
    required: true,
  },
  {
    name: "bidOpeningDate",
    title: "Date of Opening Bids",
    type: "date",
    placeholder: "Select bid opening date",
    required: true,
  },
  {
    name: "publicationTenderId",
    title: "Publication Tender ID",
    type: "number",
    placeholder: "Enter publication tender ID",
    required: false,
  }
];
