import { NextRequest, NextResponse } from 'next/server';
import { PublicationService } from '@/services/publicationService';
import { newPublicationSchema, updatePublicationSchema } from '@/db/schema';
import { z } from 'zod';

const publicationService = new PublicationService();

// GET handler - fetch all publications or a specific publication by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, fetch a specific publication
    if (id) {
      const publicationId = parseInt(id, 10);
      
      // Validate ID format
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
      const results = await publicationService.search(searchCriteria);
      return NextResponse.json(results);
    }
    
    // Otherwise, fetch all publications
    const publications = await publicationService.getAll();
    return NextResponse.json(publications);
  } catch (error) {
    console.error('Error in GET /api/publications:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}

// POST handler - create a new publication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = newPublicationSchema.parse(body);
    
    const publication = await publicationService.create(validatedData);
    
    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/publications:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create publication' },
      { status: 500 }
    );
  }
}

// PUT handler - update an existing publication
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
    
    const publicationId = parseInt(id, 10);
    
    // Validate ID format
    if (isNaN(publicationId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = updatePublicationSchema.parse(body);
    
    const publication = await publicationService.update(publicationId, validatedData);
    
    if (!publication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(publication);
  } catch (error) {
    console.error('Error in PUT /api/publications:', error);
    
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

// DELETE handler - delete a publication
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
    
    const publicationId = parseInt(id, 10);
    
    // Validate ID format
    if (isNaN(publicationId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
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
    console.error('Error in DELETE /api/publications:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
} 