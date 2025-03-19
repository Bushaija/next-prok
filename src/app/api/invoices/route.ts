import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/services/invoiceService';
import { 
  invoiceSchema,
  newInvoiceSchema, 
  updateInvoiceSchema 
} from '@/db/schema';

const invoiceService = new InvoiceService();

// GET handler to retrieve all invoices or filter by ID or other criteria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const contractManagementId = searchParams.get('contractManagementId');
    const invoiceNumber = searchParams.get('invoiceNumber');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const contractor = searchParams.get('contractor');
    const amountMin = searchParams.get('amountMin');
    const amountMax = searchParams.get('amountMax');
    
    // If ID is provided, fetch a specific invoice
    if (id) {
      const invoiceId = parseInt(id, 10);
      if (isNaN(invoiceId)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      
      const invoice = await invoiceService.getById(invoiceId);
      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      
      return NextResponse.json(invoice);
    }
    
    // If search parameters are provided, use search function
    if (contractManagementId || invoiceNumber || status || dateFrom || dateTo || contractor || amountMin || amountMax) {
      const searchCriteria: any = {};
      
      if (contractManagementId) {
        const parsedId = parseInt(contractManagementId, 10);
        if (!isNaN(parsedId)) {
          searchCriteria.contractManagementId = parsedId;
        }
      }
      
      if (invoiceNumber) {
        searchCriteria.invoiceNumber = invoiceNumber;
      }
      
      if (status) {
        searchCriteria.status = status;
      }
      
      if (contractor) {
        searchCriteria.contractor = contractor;
      }
      
      if (amountMin) {
        const min = parseFloat(amountMin);
        if (!isNaN(min)) {
          searchCriteria.amountMin = min;
        }
      }
      
      if (amountMax) {
        const max = parseFloat(amountMax);
        if (!isNaN(max)) {
          searchCriteria.amountMax = max;
        }
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
      
      const results = await invoiceService.search(searchCriteria);
      return NextResponse.json(results);
    }
    
    // Otherwise, fetch all invoices
    const invoices = await invoiceService.getAll();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST handler to create a new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body using Zod
    const validationResult = newInvoiceSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Create the new invoice
    const newInvoice = await invoiceService.create(validationResult.data);
    
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

// PUT handler to update an existing invoice
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
    const validationResult = updateInvoiceSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    // Check if the invoice exists
    const existingInvoice = await invoiceService.getById(id);
    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    // Update the invoice
    const updatedInvoice = await invoiceService.update(id, validationResult.data);
    
    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

// DELETE handler to delete an invoice
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
    
    // Check if the invoice exists
    const existingInvoice = await invoiceService.getById(id);
    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    
    // Delete the invoice
    const success = await invoiceService.delete(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
} 