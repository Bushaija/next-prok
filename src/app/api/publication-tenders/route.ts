import { NextRequest, NextResponse } from 'next/server';
import { PublicationTenderService } from '@/services/publicationTenderService';
import { newPublicationTenderSchema, updatePublicationTenderSchema } from '@/db/schema';
import { z } from 'zod';

const publicationTenderService = new PublicationTenderService();

// GET handler - fetch all publication tenders or a specific publication tender by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, fetch a specific publication tender
    if (id) {
      const publicationTenderId = parseInt(id, 10);
      
      // Validate ID format
      if (isNaN(publicationTenderId)) {
        return NextResponse.json(
          { error: 'Invalid ID format' },
          { status: 400 }
        );
      }
      
      const publicationTender = await publicationTenderService.getById(publicationTenderId);
      
      if (!publicationTender) {
        return NextResponse.json(
          { error: 'Publication tender not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(publicationTender);
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
      const results = await publicationTenderService.search(searchCriteria);
      return NextResponse.json(results);
    }
    
    // Otherwise, fetch all publication tenders
    const publicationTenders = await publicationTenderService.getAll();
    return NextResponse.json(publicationTenders);
  } catch (error) {
    console.error('Error in GET /api/publication-tenders:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch publication tenders' },
      { status: 500 }
    );
  }
}

// POST handler - create a new publication tender
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = newPublicationTenderSchema.parse(body);
    
    // Convert date string to Date object if needed
    if (validatedData.dateOfTenderPublication && typeof validatedData.dateOfTenderPublication === 'string') {
      validatedData.dateOfTenderPublication = new Date(validatedData.dateOfTenderPublication);
    }
    
    const publicationTender = await publicationTenderService.create(validatedData);
    
    return NextResponse.json(publicationTender, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/publication-tenders:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create publication tender' },
      { status: 500 }
    );
  }
}

// PUT handler - update an existing publication tender
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
    
    const publicationTenderId = parseInt(id, 10);
    
    // Validate ID format
    if (isNaN(publicationTenderId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = updatePublicationTenderSchema.parse(body);
    
    // Convert date string to Date object if needed
    if (validatedData.dateOfTenderPublication && typeof validatedData.dateOfTenderPublication === 'string') {
      validatedData.dateOfTenderPublication = new Date(validatedData.dateOfTenderPublication);
    }
    
    const publicationTender = await publicationTenderService.update(publicationTenderId, validatedData);
    
    if (!publicationTender) {
      return NextResponse.json(
        { error: 'Publication tender not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(publicationTender);
  } catch (error) {
    console.error('Error in PUT /api/publication-tenders:', error);
    
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

// DELETE handler - delete a publication tender
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
    
    const publicationTenderId = parseInt(id, 10);
    
    // Validate ID format
    if (isNaN(publicationTenderId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const success = await publicationTenderService.delete(publicationTenderId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Publication tender not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/publication-tenders:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete publication tender' },
      { status: 500 }
    );
  }
} 