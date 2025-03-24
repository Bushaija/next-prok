import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ContractSigning, 
  NewContractSigning, 
  UpdateContractSigning 
} from '@/db/schema';

// API request functions
const fetchContractSignings = async (): Promise<ContractSigning[]> => {
  const response = await fetch('/api/contract-signings');
  if (!response.ok) {
    throw new Error('Failed to fetch contract signings');
  }
  return response.json();
};

const fetchContractSigningById = async (id: number): Promise<ContractSigning> => {
  // Special case for placeholder IDs
  if (id < 0) {
    // Return empty data or throw a controlled error
    throw new Error('Invalid contract signing ID');
  }
  
  // Use the dynamic route format for valid IDs
  const response = await fetch(`/api/contract-signings/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contract signing');
  }
  const data = await response.json();
  if (!data) {
    throw new Error('Contract signing not found');
  }
  return data;
};

const fetchContractSigningsByBidEvaluationId = async (bidEvaluationId: number): Promise<ContractSigning[]> => {
  const response = await fetch(`/api/contract-signings?bidEvaluationId=${bidEvaluationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contract signings for bid evaluation');
  }
  return response.json();
};

const fetchContractSigningsByStatus = async (status: string): Promise<ContractSigning[]> => {
  const response = await fetch(`/api/contract-signings?status=${status}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contract signings by status');
  }
  return response.json();
};

const fetchContractSigningsByDateRange = async (
  params: { dateFrom: Date, dateTo: Date }
): Promise<ContractSigning[]> => {
  const { dateFrom, dateTo } = params;
  const response = await fetch(
    `/api/contract-signings?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch contract signings by date range');
  }
  return response.json();
};

const createContractSigning = async (data: NewContractSigning): Promise<ContractSigning> => {
  const response = await fetch('/api/contract-signings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create contract signing');
  }
  
  return response.json();
};

const updateContractSigning = async ({ 
  id, 
  data 
}: { 
  id: number; 
  data: UpdateContractSigning;
}): Promise<ContractSigning> => {
  const response = await fetch(`/api/contract-signings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update contract signing');
  }
  
  return response.json();
};

const deleteContractSigning = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/contract-signings/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete contract signing');
  }
  
  return response.json();
};

// React Query hooks
export const useContractSignings = () => {
  return useQuery<ContractSigning[], Error>({
    queryKey: ['contractSignings'],
    queryFn: fetchContractSignings,
  });
};

export const useContractSigning = (id: number) => {
  return useQuery<ContractSigning, Error>({
    queryKey: ['contractSigning', id],
    queryFn: () => fetchContractSigningById(id),
    enabled: !!id && id > 0, // Only run query if ID is valid (positive)
  });
};

export const useContractSigningsByBidEvaluationId = (bidEvaluationId: number) => {
  return useQuery<ContractSigning[], Error>({
    queryKey: ['contractSignings', 'bidEvaluation', bidEvaluationId],
    queryFn: () => fetchContractSigningsByBidEvaluationId(bidEvaluationId),
    enabled: !!bidEvaluationId, // Only run query if bidEvaluationId is provided
  });
};

export const useContractSigningsByStatus = (status: string) => {
  return useQuery<ContractSigning[], Error>({
    queryKey: ['contractSignings', 'status', status],
    queryFn: () => fetchContractSigningsByStatus(status),
    enabled: !!status, // Only run query if status is provided
  });
};

export const useContractSigningsByDateRange = (dateFrom?: Date, dateTo?: Date) => {
  return useQuery<ContractSigning[], Error>({
    queryKey: ['contractSignings', 'dateRange', dateFrom, dateTo],
    queryFn: () => fetchContractSigningsByDateRange({ dateFrom: dateFrom!, dateTo: dateTo! }),
    enabled: !!(dateFrom && dateTo), // Only run query if both dates are provided
  });
};

export const useCreateContractSigning = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContractSigning, Error, NewContractSigning>({
    mutationFn: createContractSigning,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['contractSignings'] });
    },
  });
};

export const useUpdateContractSigning = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContractSigning, Error, { id: number; data: UpdateContractSigning }>({
    mutationFn: updateContractSigning,
    onSuccess: (data) => {
      // Invalidate and update relevant queries
      queryClient.invalidateQueries({ queryKey: ['contractSignings'] });
      queryClient.invalidateQueries({ queryKey: ['contractSigning', data.id] });
      
      if (data.bidEvaluationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['contractSignings', 'bidEvaluation', data.bidEvaluationId] 
        });
      }
      
      if (data.status) {
        queryClient.invalidateQueries({ 
          queryKey: ['contractSignings', 'status', data.status] 
        });
      }
    },
  });
};

export const useDeleteContractSigning = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deleteContractSigning,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['contractSignings'] });
    },
  });
}; 