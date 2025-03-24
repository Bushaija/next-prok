import { NextRequest, NextResponse } from 'next/server';
import { ContractManagementService } from '@/services/contractManagementService';
import { z } from 'zod';
import { updateContractManagementSchema } from '@/db/schema';

const contractManagementService = new ContractManagementService();

// GET handler for dynamic route /api/contract-managements/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("Dynamic route ID:", id);
    
    // Validate ID format
    const contractManagementId = parseInt(id, 10);
    if (isNaN(contractManagementId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const contractManagement = await contractManagementService.getById(contractManagementId);
    
    if (!contractManagement) {
      return NextResponse.json(
        { error: 'Contract Management not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(contractManagement);
  } catch (error) {
    console.error('Error in GET /api/contract-managements/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch contract management' },
      { status: 500 }
    );
  }
}

// PUT handler for dynamic route /api/contract-managements/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const contractManagementId = parseInt(id, 10);
    if (isNaN(contractManagementId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
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
    const existingContractManagement = await contractManagementService.getById(contractManagementId);
    if (!existingContractManagement) {
      return NextResponse.json(
        { error: 'Contract Management not found' },
        { status: 404 }
      );
    }
    
    const contractManagement = await contractManagementService.update(contractManagementId, validationResult.data);
    
    if (!contractManagement) {
      return NextResponse.json(
        { error: 'Contract Management not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(contractManagement);
  } catch (error) {
    console.error('Error in PUT /api/contract-managements/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update contract management' },
      { status: 500 }
    );
  }
}

// DELETE handler for dynamic route /api/contract-managements/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const contractManagementId = parseInt(id, 10);
    if (isNaN(contractManagementId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Check if the contract management exists
    const existingContractManagement = await contractManagementService.getById(contractManagementId);
    if (!existingContractManagement) {
      return NextResponse.json(
        { error: 'Contract Management not found' },
        { status: 404 }
      );
    }
    
    const success = await contractManagementService.delete(contractManagementId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Contract Management not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/contract-managements/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete contract management' },
      { status: 500 }
    );
  }
} 