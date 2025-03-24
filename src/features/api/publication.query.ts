import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Publication, 
  NewPublication, 
  UpdatePublication,
  Planning
} from '@/db/schema';

// API request functions
const fetchPublications = async (): Promise<Publication[]> => {
  const response = await fetch('/api/publications');
  if (!response.ok) {
    throw new Error('Failed to fetch publications');
  }
  return response.json();
};

const fetchPublicationById = async (id: number): Promise<Publication> => {
  // Special case for placeholder IDs
  if (id < 0) {
    // Return empty data or throw a controlled error
    throw new Error('Invalid publication ID');
  }
  
  // Use the dynamic route format for valid IDs
  const response = await fetch(`/api/publications/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch publication');
  }
  return response.json();
};

const createPublication = async (data: NewPublication): Promise<Publication> => {
  const response = await fetch('/api/publications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create publication');
  }
  
  return response.json();
};

const updatePublication = async ({ 
  id, 
  data 
}: { 
  id: number; 
  data: UpdatePublication;
}): Promise<Publication> => {
  const response = await fetch(`/api/publications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update publication');
  }
  
  return response.json();
};

const deletePublication = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/publications/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete publication');
  }
  
  return response.json();
};

// New API request functions
const fetchPublicationWithPlanning = async (id: number): Promise<{ publication: Publication; planning: Planning | null }> => {
  const response = await fetch(`/api/publications/with-planning?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch publication with planning');
  }
  return response.json();
};

const fetchPublicationsWithPagination = async ({ 
  page = 1, 
  limit = 10 
}: { 
  page?: number; 
  limit?: number 
}): Promise<{ data: Publication[]; total: number; page: number; totalPages: number }> => {
  const response = await fetch(`/api/publications/paginated?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch paginated publications');
  }
  return response.json();
};

const fetchPublicationsWithSorting = async ({ 
  sortBy = 'createdAt', 
  sortOrder = 'desc' 
}: { 
  sortBy?: string; 
  sortOrder?: 'asc' | 'desc' 
}): Promise<Publication[]> => {
  const response = await fetch(`/api/publications/sorted?sortBy=${sortBy}&sortOrder=${sortOrder}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sorted publications');
  }
  return response.json();
};

// React Query Hooks
export const usePublications = () => {
  return useQuery<Publication[], Error>({
    queryKey: ['publications'],
    queryFn: fetchPublications,
  });
};

export const usePublication = (id: number) => {
  return useQuery<Publication, Error>({
    queryKey: ['publication', id],
    queryFn: () => fetchPublicationById(id),
    enabled: !!id && id > 0, // Only run the query if id is valid (positive)
  });
};

export const useCreatePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Publication, Error, NewPublication>({
    mutationFn: createPublication,
    onSuccess: () => {
      // Invalidate and refetch the publications list
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
};

export const useUpdatePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    Publication, 
    Error, 
    { id: number; data: UpdatePublication }
  >({
    mutationFn: updatePublication,
    onSuccess: (data) => {
      // Update the cache for the specific publication
      queryClient.setQueryData(['publication', data.id], data);
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
};

export const useDeletePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deletePublication,
    onSuccess: (_, id) => {
      // Remove the deleted item from the cache
      queryClient.removeQueries({ queryKey: ['publication', id] });
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
};

// Search hook
export const useSearchPublications = (criteria: Partial<Publication>) => {
  const searchParams = new URLSearchParams();
  
  // Add search criteria to query params
  Object.entries(criteria).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const searchQuery = searchParams.toString();
  
  return useQuery<Publication[], Error>({
    queryKey: ['publications', 'search', criteria],
    queryFn: async () => {
      const response = await fetch(`/api/publications?${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to search publications');
      }
      return response.json();
    },
    enabled: Object.keys(criteria).length > 0, // Only run if criteria is provided
  });
};

// New React Query Hooks
export const usePublicationWithPlanning = (id: number) => {
  return useQuery<{ publication: Publication; planning: Planning | null }, Error>({
    queryKey: ['publication', id, 'with-planning'],
    queryFn: () => fetchPublicationWithPlanning(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const usePaginatedPublications = (page: number = 1, limit: number = 10) => {
  return useQuery<{ data: Publication[]; total: number; page: number; totalPages: number }, Error>({
    queryKey: ['publications', 'paginated', { page, limit }],
    queryFn: () => fetchPublicationsWithPagination({ page, limit }),
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

export const useSortedPublications = (sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') => {
  return useQuery<Publication[], Error>({
    queryKey: ['publications', 'sorted', { sortBy, sortOrder }],
    queryFn: () => fetchPublicationsWithSorting({ sortBy, sortOrder }),
  });
};

// Hook to fetch publications by planning ID
export const usePublicationsByPlanningId = (planningId: number) => {
  return useQuery<Publication[], Error>({
    queryKey: ['publications', 'by-planning', planningId],
    queryFn: async () => {
      const response = await fetch(`/api/publications?planningId=${planningId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch publications by planning ID');
      }
      return response.json();
    },
    enabled: !!planningId, // Only run the query if planningId is provided
  });
};

// Hook to fetch publications by revision
export const usePublicationsByRevision = (revision: string) => {
  return useQuery<Publication[], Error>({
    queryKey: ['publications', 'by-revision', revision],
    queryFn: async () => {
      const response = await fetch(`/api/publications?revision=${revision}`);
      if (!response.ok) {
        throw new Error('Failed to fetch publications by revision');
      }
      return response.json();
    },
    enabled: !!revision, // Only run the query if revision is provided
  });
}; 