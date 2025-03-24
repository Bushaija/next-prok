import { NextRequest, NextResponse } from 'next/server';
import { ContractSigningService } from '@/services/contractSigningService';
import { z } from 'zod';
import { updateContractSigningSchema } from '@/db/schema';

const contractSigningService = new ContractSigningService();

// GET handler for dynamic route /api/contract-signings/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("Dynamic route ID:", id);
    
    // Validate ID format
    const contractSigningId = parseInt(id, 10);
    if (isNaN(contractSigningId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const contractSigning = await contractSigningService.getById(contractSigningId);
    
    if (!contractSigning) {
      return NextResponse.json(
        { error: 'Contract Signing not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(contractSigning);
  } catch (error) {
    console.error('Error in GET /api/contract-signings/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch contract signing' },
      { status: 500 }
    );
  }
}

// PUT handler for dynamic route /api/contract-signings/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const contractSigningId = parseInt(id, 10);
    if (isNaN(contractSigningId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
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
    const existingContractSigning = await contractSigningService.getById(contractSigningId);
    if (!existingContractSigning) {
      return NextResponse.json(
        { error: 'Contract Signing not found' },
        { status: 404 }
      );
    }
    
    const contractSigning = await contractSigningService.update(contractSigningId, validationResult.data);
    
    if (!contractSigning) {
      return NextResponse.json(
        { error: 'Contract Signing not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(contractSigning);
  } catch (error) {
    console.error('Error in PUT /api/contract-signings/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update contract signing' },
      { status: 500 }
    );
  }
}

// DELETE handler for dynamic route /api/contract-signings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const contractSigningId = parseInt(id, 10);
    if (isNaN(contractSigningId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Check if the contract signing exists
    const existingContractSigning = await contractSigningService.getById(contractSigningId);
    if (!existingContractSigning) {
      return NextResponse.json(
        { error: 'Contract Signing not found' },
        { status: 404 }
      );
    }
    
    const success = await contractSigningService.delete(contractSigningId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Contract Signing not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/contract-signings/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete contract signing' },
      { status: 500 }
    );
  }
} 