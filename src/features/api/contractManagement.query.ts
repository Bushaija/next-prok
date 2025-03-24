import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ContractManagement, 
  NewContractManagement, 
  UpdateContractManagement 
} from '@/db/schema';

// API request functions
const fetchContractManagements = async (): Promise<ContractManagement[]> => {
  const response = await fetch('/api/contract-managements');
  if (!response.ok) {
    throw new Error('Failed to fetch contract managements');
  }
  return response.json();
};

const fetchContractManagementById = async (id: number): Promise<ContractManagement> => {
  // Special case for placeholder IDs
  if (id < 0) {
    // Return empty data or throw a controlled error
    throw new Error('Invalid contract management ID');
  }
  
  // Use the dynamic route format for valid IDs
  const response = await fetch(`/api/contract-managements/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contract management');
  }
  const data = await response.json();
  if (!data) {
    throw new Error('Contract management not found');
  }
  return data;
};

const fetchContractManagementsByContractSigningId = async (contractSigningId: number): Promise<ContractManagement[]> => {
  const response = await fetch(`/api/contract-managements?contractSigningId=${contractSigningId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contract managements for contract signing');
  }
  return response.json();
};

const fetchContractManagementsByStatus = async (status: string): Promise<ContractManagement[]> => {
  const response = await fetch(`/api/contract-managements?status=${status}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contract managements by status');
  }
  return response.json();
};

const fetchContractManagementsByDateRange = async (
  params: { dateFrom: Date, dateTo: Date }
): Promise<ContractManagement[]> => {
  const { dateFrom, dateTo } = params;
  const response = await fetch(
    `/api/contract-managements?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch contract managements by date range');
  }
  return response.json();
};

const createContractManagement = async (data: NewContractManagement): Promise<ContractManagement> => {
  const response = await fetch('/api/contract-managements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create contract management');
  }
  
  return response.json();
};

const updateContractManagement = async ({ 
  id, 
  data 
}: { 
  id: number; 
  data: UpdateContractManagement;
}): Promise<ContractManagement> => {
  const response = await fetch(`/api/contract-managements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update contract management');
  }
  
  return response.json();
};

const deleteContractManagement = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/contract-managements/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete contract management');
  }
  
  return response.json();
};

// React Query hooks
export const useContractManagements = () => {
  return useQuery<ContractManagement[], Error>({
    queryKey: ['contractManagements'],
    queryFn: fetchContractManagements,
  });
};

export const useContractManagement = (id: number) => {
  return useQuery<ContractManagement, Error>({
    queryKey: ['contractManagement', id],
    queryFn: () => fetchContractManagementById(id),
    enabled: !!id && id > 0, // Only run query if ID is valid (positive)
  });
};

export const useContractManagementsByContractSigningId = (contractSigningId: number) => {
  return useQuery<ContractManagement[], Error>({
    queryKey: ['contractManagements', 'contractSigning', contractSigningId],
    queryFn: () => fetchContractManagementsByContractSigningId(contractSigningId),
    enabled: !!contractSigningId, // Only run query if contractSigningId is provided
  });
};

export const useContractManagementsByStatus = (status: string) => {
  return useQuery<ContractManagement[], Error>({
    queryKey: ['contractManagements', 'status', status],
    queryFn: () => fetchContractManagementsByStatus(status),
    enabled: !!status, // Only run query if status is provided
  });
};

export const useContractManagementsByDateRange = (dateFrom?: Date, dateTo?: Date) => {
  return useQuery<ContractManagement[], Error>({
    queryKey: ['contractManagements', 'dateRange', dateFrom, dateTo],
    queryFn: () => fetchContractManagementsByDateRange({ dateFrom: dateFrom!, dateTo: dateTo! }),
    enabled: !!(dateFrom && dateTo), // Only run query if both dates are provided
  });
};

export const useCreateContractManagement = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContractManagement, Error, NewContractManagement>({
    mutationFn: createContractManagement,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['contractManagements'] });
    },
  });
};

export const useUpdateContractManagement = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ContractManagement, Error, { id: number; data: UpdateContractManagement }>({
    mutationFn: updateContractManagement,
    onSuccess: (data) => {
      // Invalidate and update relevant queries
      queryClient.invalidateQueries({ queryKey: ['contractManagements'] });
      queryClient.invalidateQueries({ queryKey: ['contractManagement', data.id] });
      
      if (data.contractSigningId) {
        queryClient.invalidateQueries({ 
          queryKey: ['contractManagements', 'contractSigning', data.contractSigningId] 
        });
      }
      
      if (data.status) {
        queryClient.invalidateQueries({ 
          queryKey: ['contractManagements', 'status', data.status] 
        });
      }
    },
  });
};

export const useDeleteContractManagement = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deleteContractManagement,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['contractManagements'] });
    },
  });
}; 