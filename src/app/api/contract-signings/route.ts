import { NextRequest, NextResponse } from 'next/server';
import { ContractSigningService } from '@/services/contractSigningService';
import { 
  contractSigningSchema,
  newContractSigningSchema, 
  updateContractSigningSchema 
} from '@/db/schema';

const contractSigningService = new ContractSigningService();

// GET handler to retrieve all contract signings or filter by ID or other criteria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const bidEvaluationId = searchParams.get('bidEvaluationId');
    const tenderTitle = searchParams.get('tenderTitle');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const contractorName = searchParams.get('contractorBidderNames');
    
    // If ID is provided, fetch a specific contract signing
    if (id) {
      const contractId = parseInt(id, 10);
      if (isNaN(contractId)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      
      const contract = await contractSigningService.getById(contractId);
      if (!contract) {
        return NextResponse.json({ error: 'Contract signing not found' }, { status: 404 });
      }
      
      return NextResponse.json(contract);
    }
    
    // If search parameters are provided, use search function
    if (bidEvaluationId || tenderTitle || status || dateFrom || dateTo || contractorName) {
      const searchCriteria: any = {};
      
      if (bidEvaluationId) {
        const parsedId = parseInt(bidEvaluationId, 10);
        if (!isNaN(parsedId)) {
          searchCriteria.bidEvaluationId = parsedId;
        }
      }
      
      if (tenderTitle) {
        searchCriteria.tenderTitle = tenderTitle;
      }
      
      if (status) {
        searchCriteria.status = status;
      }
      
      if (contractorName) {
        searchCriteria.contractorBidderNames = contractorName;
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
      
      const results = await contractSigningService.search(searchCriteria);
      return NextResponse.json(results);
    }
    
    // Otherwise, fetch all contract signings
    const contracts = await contractSigningService.getAll();
    return NextResponse.json(contracts);
  } catch (error) {
    console.error('Error fetching contract signings:', error);
    return NextResponse.json({ error: 'Failed to fetch contract signings' }, { status: 500 });
  }
}

// POST handler to create a new contract signing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = newContractSigningSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Create the new contract signing
    const newContract = await contractSigningService.create(validationResult.data);
    
    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    console.error('Error creating contract signing:', error);
    return NextResponse.json({ error: 'Failed to create contract signing' }, { status: 500 });
  }
}

// PUT handler to update an existing contract signing
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
    const validationResult = updateContractSigningSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the contract signing exists
    const existingContract = await contractSigningService.getById(id);
    if (!existingContract) {
      return NextResponse.json({ error: 'Contract signing not found' }, { status: 404 });
    }
    
    // Update the contract signing
    const updatedContract = await contractSigningService.update(id, validationResult.data);
    
    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error('Error updating contract signing:', error);
    return NextResponse.json({ error: 'Failed to update contract signing' }, { status: 500 });
  }
}

// DELETE handler to delete a contract signing
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
    
    // Check if the contract signing exists
    const existingContract = await contractSigningService.getById(id);
    if (!existingContract) {
      return NextResponse.json({ error: 'Contract signing not found' }, { status: 404 });
    }
    
    // Delete the contract signing
    const success = await contractSigningService.delete(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete contract signing' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting contract signing:', error);
    return NextResponse.json({ error: 'Failed to delete contract signing' }, { status: 500 });
  }
} 