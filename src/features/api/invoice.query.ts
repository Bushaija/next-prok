import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Invoice, 
  NewInvoice, 
  UpdateInvoice 
} from '@/db/schema';

// API request functions
const fetchInvoices = async (): Promise<Invoice[]> => {
  const response = await fetch('/api/invoices');
  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }
  return response.json();
};

const fetchInvoiceById = async (id: number): Promise<Invoice> => {
  // Special case for placeholder IDs
  if (id < 0) {
    // Return empty data or throw a controlled error
    throw new Error('Invalid invoice ID');
  }
  
  // Use the dynamic route format for valid IDs
  const response = await fetch(`/api/invoices/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch invoice');
  }
  const data = await response.json();
  if (!data) {
    throw new Error('Invoice not found');
  }
  return data;
};

const fetchInvoicesByContractManagementId = async (contractManagementId: number): Promise<Invoice[]> => {
  const response = await fetch(`/api/invoices?contractManagementId=${contractManagementId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch invoices for contract management');
  }
  return response.json();
};

const fetchInvoicesByStatus = async (status: string): Promise<Invoice[]> => {
  const response = await fetch(`/api/invoices?status=${status}`);
  if (!response.ok) {
    throw new Error('Failed to fetch invoices by status');
  }
  return response.json();
};

const fetchInvoicesByDateRange = async (
  params: { dateFrom: Date, dateTo: Date }
): Promise<Invoice[]> => {
  const { dateFrom, dateTo } = params;
  const response = await fetch(
    `/api/invoices?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch invoices by date range');
  }
  return response.json();
};

const createInvoice = async (data: NewInvoice): Promise<Invoice> => {
  const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create invoice');
  }
  
  return response.json();
};

const updateInvoice = async ({ 
  id, 
  data 
}: { 
  id: number; 
  data: UpdateInvoice;
}): Promise<Invoice> => {
  const response = await fetch(`/api/invoices/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update invoice');
  }
  
  return response.json();
};

const deleteInvoice = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/invoices/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete invoice');
  }
  
  return response.json();
};

// React Query hooks
export const useInvoices = () => {
  return useQuery<Invoice[], Error>({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
};

export const useInvoice = (id: number) => {
  return useQuery<Invoice, Error>({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceById(id),
    enabled: !!id && id > 0, // Only run query if ID is valid (positive)
  });
};

export const useInvoicesByContractManagementId = (contractManagementId: number) => {
  return useQuery<Invoice[], Error>({
    queryKey: ['invoices', 'contractManagement', contractManagementId],
    queryFn: () => fetchInvoicesByContractManagementId(contractManagementId),
    enabled: !!contractManagementId, // Only run query if contractManagementId is provided
  });
};

export const useInvoicesByStatus = (status: string) => {
  return useQuery<Invoice[], Error>({
    queryKey: ['invoices', 'status', status],
    queryFn: () => fetchInvoicesByStatus(status),
    enabled: !!status, // Only run query if status is provided
  });
};

export const useInvoicesByDateRange = (dateFrom?: Date, dateTo?: Date) => {
  return useQuery<Invoice[], Error>({
    queryKey: ['invoices', 'dateRange', dateFrom, dateTo],
    queryFn: () => fetchInvoicesByDateRange({ dateFrom: dateFrom!, dateTo: dateTo! }),
    enabled: !!(dateFrom && dateTo), // Only run query if both dates are provided
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Invoice, Error, NewInvoice>({
    mutationFn: createInvoice,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Invoice, Error, { id: number; data: UpdateInvoice }>({
    mutationFn: updateInvoice,
    onSuccess: (data) => {
      // Invalidate and update relevant queries
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
      
      if (data.contractManagementId) {
        queryClient.invalidateQueries({ 
          queryKey: ['invoices', 'contractManagement', data.contractManagementId] 
        });
      }
      
      if (data.status) {
        queryClient.invalidateQueries({ 
          queryKey: ['invoices', 'status', data.status] 
        });
      }
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}; 