import { NextRequest, NextResponse } from 'next/server';
import { PublicationTenderService } from '@/services/publicationTenderService';
import { z } from 'zod';
import { updatePublicationTenderSchema } from '@/db/schema';

const publicationTenderService = new PublicationTenderService();

// GET handler for dynamic route /api/publication-tenders/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("Dynamic route ID:", id);
    
    // Validate ID format
    const publicationTenderId = parseInt(id, 10);
    if (isNaN(publicationTenderId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const publicationTender = await publicationTenderService.getById(publicationTenderId);
    
    if (!publicationTender) {
      return NextResponse.json(
        { error: 'Publication Tender not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(publicationTender);
  } catch (error) {
    console.error('Error in GET /api/publication-tenders/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch publication tender' },
      { status: 500 }
    );
  }
}

// PUT handler for dynamic route /api/publication-tenders/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const publicationTenderId = parseInt(id, 10);
    if (isNaN(publicationTenderId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = updatePublicationTenderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the publication tender exists
    const existingPublicationTender = await publicationTenderService.getById(publicationTenderId);
    if (!existingPublicationTender) {
      return NextResponse.json(
        { error: 'Publication Tender not found' },
        { status: 404 }
      );
    }
    
    const publicationTender = await publicationTenderService.update(publicationTenderId, validationResult.data);
    
    if (!publicationTender) {
      return NextResponse.json(
        { error: 'Publication Tender not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(publicationTender);
  } catch (error) {
    console.error('Error in PUT /api/publication-tenders/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update publication tender' },
      { status: 500 }
    );
  }
}

// DELETE handler for dynamic route /api/publication-tenders/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const publicationTenderId = parseInt(id, 10);
    if (isNaN(publicationTenderId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Check if the publication tender exists
    const existingPublicationTender = await publicationTenderService.getById(publicationTenderId);
    if (!existingPublicationTender) {
      return NextResponse.json(
        { error: 'Publication Tender not found' },
        { status: 404 }
      );
    }
    
    const success = await publicationTenderService.delete(publicationTenderId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Publication Tender not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/publication-tenders/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete publication tender' },
      { status: 500 }
    );
  }
} 