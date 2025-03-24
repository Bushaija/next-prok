import { NextRequest, NextResponse } from 'next/server';
import { PublicationService } from '@/services/publicationService';
import { z } from 'zod';
import { updatePublicationSchema } from '@/db/schema';

const publicationService = new PublicationService();

// GET handler for dynamic route /api/publications/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("Dynamic route ID:", id);
    
    // Validate ID format
    const publicationId = parseInt(id, 10);
    if (isNaN(publicationId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const publication = await publicationService.getById(publicationId);
    
    if (!publication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error in GET /api/publications/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch publication' },
      { status: 500 }
    );
  }
}

// PUT handler for dynamic route /api/publications/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const publicationId = parseInt(id, 10);
    if (isNaN(publicationId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = updatePublicationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the publication exists
    const existingPublication = await publicationService.getById(publicationId);
    if (!existingPublication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }
    
    const publication = await publicationService.update(publicationId, validationResult.data);
    
    if (!publication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error in PUT /api/publications/[id]:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update publication' },
      { status: 500 }
    );
  }
}

// DELETE handler for dynamic route /api/publications/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const publicationId = parseInt(id, 10);
    if (isNaN(publicationId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Check if the publication exists
    const existingPublication = await publicationService.getById(publicationId);
    if (!existingPublication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }
    
    const success = await publicationService.delete(publicationId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/publications/[id]:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
} 