import { NextRequest, NextResponse } from 'next/server';
import { ContractManagementService } from '@/services/contractManagementService';
import { 
  contractManagementSchema,
  newContractManagementSchema, 
  updateContractManagementSchema 
} from '@/db/schema';

const contractManagementService = new ContractManagementService();

// GET handler to retrieve all contract managements or filter by ID or other criteria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const contractSigningId = searchParams.get('contractSigningId');
    const tenderTitle = searchParams.get('tenderTitle');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const procurementStaff = searchParams.get('procurementStaff');
    
    // If ID is provided, fetch a specific contract management
    if (id) {
      const managementId = parseInt(id, 10);
      if (isNaN(managementId)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      
      const management = await contractManagementService.getById(managementId);
      if (!management) {
        return NextResponse.json({ error: 'Contract management not found' }, { status: 404 });
      }
      
      return NextResponse.json(management);
    }
    
    // If search parameters are provided, use search function
    if (contractSigningId || tenderTitle || status || dateFrom || dateTo || procurementStaff) {
      const searchCriteria: any = {};
      
      if (contractSigningId) {
        const parsedId = parseInt(contractSigningId, 10);
        if (!isNaN(parsedId)) {
          searchCriteria.contractSigningId = parsedId;
        }
      }
      
      if (tenderTitle) {
        searchCriteria.tenderTitle = tenderTitle;
      }
      
      if (status) {
        searchCriteria.status = status;
      }
      
      if (procurementStaff) {
        searchCriteria.procurementStaff = procurementStaff;
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
      
      const results = await contractManagementService.search(searchCriteria);
      return NextResponse.json(results);
    }
    
    // Otherwise, fetch all contract managements
    const managements = await contractManagementService.getAll();
    return NextResponse.json(managements);
  } catch (error) {
    console.error('Error fetching contract managements:', error);
    return NextResponse.json({ error: 'Failed to fetch contract managements' }, { status: 500 });
  }
}

// POST handler to create a new contract management
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = newContractManagementSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Create the new contract management
    const newManagement = await contractManagementService.create(validationResult.data);
    
    return NextResponse.json(newManagement, { status: 201 });
  } catch (error) {
    console.error('Error creating contract management:', error);
    return NextResponse.json({ error: 'Failed to create contract management' }, { status: 500 });
  }
}

// PUT handler to update an existing contract management
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
    const validationResult = updateContractManagementSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the contract management exists
    const existingManagement = await contractManagementService.getById(id);
    if (!existingManagement) {
      return NextResponse.json({ error: 'Contract management not found' }, { status: 404 });
    }
    
    // Update the contract management
    const updatedManagement = await contractManagementService.update(id, validationResult.data);
    
    return NextResponse.json(updatedManagement);
  } catch (error) {
    console.error('Error updating contract management:', error);
    return NextResponse.json({ error: 'Failed to update contract management' }, { status: 500 });
  }
}

// DELETE handler to delete a contract management
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
    
    // Check if the contract management exists
    const existingManagement = await contractManagementService.getById(id);
    if (!existingManagement) {
      return NextResponse.json({ error: 'Contract management not found' }, { status: 404 });
    }
    
    // Delete the contract management
    const success = await contractManagementService.delete(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete contract management' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting contract management:', error);
    return NextResponse.json({ error: 'Failed to delete contract management' }, { status: 500 });
  }
} 