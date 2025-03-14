import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Planning, 
  NewPlanning, 
  UpdatePlanning,
  ItemIdentification
} from '@/db/schema';

// API request functions
const fetchPlannings = async (): Promise<Planning[]> => {
  const response = await fetch('/api/plannings');
  if (!response.ok) {
    throw new Error('Failed to fetch plannings');
  }
  return response.json();
};

const fetchPlanningById = async (id: number): Promise<Planning> => {
  const response = await fetch(`/api/plannings?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch planning');
  }
  return response.json();
};

const createPlanning = async (data: NewPlanning): Promise<Planning> => {
  const response = await fetch('/api/plannings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create planning');
  }
  
  return response.json();
};

const updatePlanning = async ({ 
  id, 
  data 
}: { 
  id: number; 
  data: UpdatePlanning;
}): Promise<Planning> => {
  const response = await fetch(`/api/plannings?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update planning');
  }
  
  return response.json();
};

const deletePlanning = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/plannings?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete planning');
  }
  
  return response.json();
};

// New API request functions
const fetchPlanningWithIdentification = async (id: number): Promise<{ planning: Planning; identification: ItemIdentification | null }> => {
  const response = await fetch(`/api/plannings/with-identification?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch planning with identification');
  }
  return response.json();
};

const fetchPlanningsWithPagination = async ({ 
  page = 1, 
  limit = 10 
}: { 
  page?: number; 
  limit?: number 
}): Promise<{ data: Planning[]; total: number; page: number; totalPages: number }> => {
  const response = await fetch(`/api/plannings/paginated?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch paginated plannings');
  }
  return response.json();
};

const fetchPlanningsWithSorting = async ({ 
  sortBy = 'createdAt', 
  sortOrder = 'desc' 
}: { 
  sortBy?: string; 
  sortOrder?: 'asc' | 'desc' 
}): Promise<Planning[]> => {
  const response = await fetch(`/api/plannings/sorted?sortBy=${sortBy}&sortOrder=${sortOrder}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sorted plannings');
  }
  return response.json();
};

// React Query Hooks
export const usePlannings = () => {
  return useQuery<Planning[], Error>({
    queryKey: ['plannings'],
    queryFn: fetchPlannings,
  });
};

export const usePlanning = (id: number) => {
  return useQuery<Planning, Error>({
    queryKey: ['planning', id],
    queryFn: () => fetchPlanningById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const useCreatePlanning = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Planning, Error, NewPlanning>({
    mutationFn: createPlanning,
    onSuccess: () => {
      // Invalidate and refetch the plannings list
      queryClient.invalidateQueries({ queryKey: ['plannings'] });
    },
  });
};

export const useUpdatePlanning = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    Planning, 
    Error, 
    { id: number; data: UpdatePlanning }
  >({
    mutationFn: updatePlanning,
    onSuccess: (data) => {
      // Update the cache for the specific planning
      queryClient.setQueryData(['planning', data.id], data);
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ['plannings'] });
    },
  });
};

export const useDeletePlanning = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deletePlanning,
    onSuccess: (_, id) => {
      // Remove the deleted item from the cache
      queryClient.removeQueries({ queryKey: ['planning', id] });
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ['plannings'] });
    },
  });
};

// Search hook
export const useSearchPlannings = (criteria: Partial<Planning>) => {
  const searchParams = new URLSearchParams();
  
  // Add search criteria to query params
  Object.entries(criteria).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const searchQuery = searchParams.toString();
  
  return useQuery<Planning[], Error>({
    queryKey: ['plannings', 'search', criteria],
    queryFn: async () => {
      const response = await fetch(`/api/plannings?${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to search plannings');
      }
      return response.json();
    },
    enabled: Object.keys(criteria).length > 0, // Only run if criteria is provided
  });
};

// New React Query Hooks
export const usePlanningWithIdentification = (id: number) => {
  return useQuery<{ planning: Planning; identification: ItemIdentification | null }, Error>({
    queryKey: ['planning', id, 'with-identification'],
    queryFn: () => fetchPlanningWithIdentification(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const usePaginatedPlannings = (page: number = 1, limit: number = 10) => {
  return useQuery<{ data: Planning[]; total: number; page: number; totalPages: number }, Error>({
    queryKey: ['plannings', 'paginated', { page, limit }],
    queryFn: () => fetchPlanningsWithPagination({ page, limit }),
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

export const useSortedPlannings = (sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') => {
  return useQuery<Planning[], Error>({
    queryKey: ['plannings', 'sorted', { sortBy, sortOrder }],
    queryFn: () => fetchPlanningsWithSorting({ sortBy, sortOrder }),
  });
};

// Hook to fetch plannings by identification ID
export const usePlanningsByIdentificationId = (identificationId: number) => {
  return useQuery<Planning[], Error>({
    queryKey: ['plannings', 'by-identification', identificationId],
    queryFn: async () => {
      const response = await fetch(`/api/plannings?identificationId=${identificationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch plannings by identification ID');
      }
      return response.json();
    },
    enabled: !!identificationId, // Only run the query if identificationId is provided
  });
};

// Hook to fetch plannings by status
export const usePlanningsByStatus = (status: string) => {
  return useQuery<Planning[], Error>({
    queryKey: ['plannings', 'by-status', status],
    queryFn: async () => {
      const response = await fetch(`/api/plannings?planningStatus=${status}`);
      if (!response.ok) {
        throw new Error('Failed to fetch plannings by status');
      }
      return response.json();
    },
    enabled: !!status, // Only run the query if status is provided
  });
}; 