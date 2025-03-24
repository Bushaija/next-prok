import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  PublicationTender, 
  NewPublicationTender, 
  UpdatePublicationTender,
  Publication
} from '@/db/schema';

// API request functions
const fetchPublicationTenders = async (): Promise<PublicationTender[]> => {
  const response = await fetch('/api/publication-tenders');
  if (!response.ok) {
    throw new Error('Failed to fetch publication tenders');
  }
  return response.json();
};

const fetchPublicationTenderById = async (id: number): Promise<PublicationTender> => {
  // Special case for placeholder IDs
  if (id < 0) {
    // Return empty data or throw a controlled error
    throw new Error('Invalid publication tender ID');
  }
  
  // Use the dynamic route format for valid IDs
  const response = await fetch(`/api/publication-tenders/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch publication tender');
  }
  return response.json();
};

const createPublicationTender = async (data: NewPublicationTender): Promise<PublicationTender> => {
  const response = await fetch('/api/publication-tenders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create publication tender');
  }
  
  return response.json();
};

const updatePublicationTender = async ({ 
  id, 
  data 
}: { 
  id: number; 
  data: UpdatePublicationTender;
}): Promise<PublicationTender> => {
  const response = await fetch(`/api/publication-tenders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update publication tender');
  }
  
  return response.json();
};

const deletePublicationTender = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/publication-tenders/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete publication tender');
  }
  
  return response.json();
};

// New API request functions
const fetchPublicationTenderWithPublication = async (id: number): Promise<{ publicationTender: PublicationTender; publication: Publication | null }> => {
  const response = await fetch(`/api/publication-tenders/with-publication?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch publication tender with publication');
  }
  return response.json();
};

const fetchPublicationTendersWithPagination = async ({ 
  page = 1, 
  limit = 10 
}: { 
  page?: number; 
  limit?: number 
}): Promise<{ data: PublicationTender[]; total: number; page: number; totalPages: number }> => {
  const response = await fetch(`/api/publication-tenders/paginated?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch paginated publication tenders');
  }
  return response.json();
};

const fetchPublicationTendersWithSorting = async ({ 
  sortBy = 'createdAt', 
  sortOrder = 'desc' 
}: { 
  sortBy?: string; 
  sortOrder?: 'asc' | 'desc' 
}): Promise<PublicationTender[]> => {
  const response = await fetch(`/api/publication-tenders/sorted?sortBy=${sortBy}&sortOrder=${sortOrder}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sorted publication tenders');
  }
  return response.json();
};

// React Query Hooks
export const usePublicationTenders = () => {
  return useQuery<PublicationTender[], Error>({
    queryKey: ['publicationTenders'],
    queryFn: fetchPublicationTenders,
  });
};

export const usePublicationTender = (id: number) => {
  return useQuery<PublicationTender, Error>({
    queryKey: ['publicationTender', id],
    queryFn: () => fetchPublicationTenderById(id),
    enabled: !!id && id > 0, // Only run the query if id is valid (positive)
  });
};

export const useCreatePublicationTender = () => {
  const queryClient = useQueryClient();
  
  return useMutation<PublicationTender, Error, NewPublicationTender>({
    mutationFn: createPublicationTender,
    onSuccess: () => {
      // Invalidate and refetch the publication tenders list
      queryClient.invalidateQueries({ queryKey: ['publicationTenders'] });
    },
  });
};

export const useUpdatePublicationTender = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    PublicationTender, 
    Error, 
    { id: number; data: UpdatePublicationTender }
  >({
    mutationFn: updatePublicationTender,
    onSuccess: (data) => {
      // Update the cache for the specific publication tender
      queryClient.setQueryData(['publicationTender', data.id], data);
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ['publicationTenders'] });
    },
  });
};

export const useDeletePublicationTender = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deletePublicationTender,
    onSuccess: (_, id) => {
      // Remove the deleted item from the cache
      queryClient.removeQueries({ queryKey: ['publicationTender', id] });
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ['publicationTenders'] });
    },
  });
};

// Search hook
export const useSearchPublicationTenders = (criteria: Partial<PublicationTender>) => {
  const searchParams = new URLSearchParams();
  
  // Add search criteria to query params
  Object.entries(criteria).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const searchQuery = searchParams.toString();
  
  return useQuery<PublicationTender[], Error>({
    queryKey: ['publicationTenders', 'search', criteria],
    queryFn: async () => {
      const response = await fetch(`/api/publication-tenders?${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to search publication tenders');
      }
      return response.json();
    },
    enabled: Object.keys(criteria).length > 0, // Only run if criteria is provided
  });
};

// New React Query Hooks
export const usePublicationTenderWithPublication = (id: number) => {
  return useQuery<{ publicationTender: PublicationTender; publication: Publication | null }, Error>({
    queryKey: ['publicationTender', id, 'with-publication'],
    queryFn: () => fetchPublicationTenderWithPublication(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const usePaginatedPublicationTenders = (page: number = 1, limit: number = 10) => {
  return useQuery<{ data: PublicationTender[]; total: number; page: number; totalPages: number }, Error>({
    queryKey: ['publicationTenders', 'paginated', { page, limit }],
    queryFn: () => fetchPublicationTendersWithPagination({ page, limit }),
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

export const useSortedPublicationTenders = (sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') => {
  return useQuery<PublicationTender[], Error>({
    queryKey: ['publicationTenders', 'sorted', { sortBy, sortOrder }],
    queryFn: () => fetchPublicationTendersWithSorting({ sortBy, sortOrder }),
  });
};

// Hook to fetch publication tenders by publication ID
export const usePublicationTendersByPublicationId = (publicationId: number) => {
  return useQuery<PublicationTender[], Error>({
    queryKey: ['publicationTenders', 'by-publication', publicationId],
    queryFn: async () => {
      const response = await fetch(`/api/publication-tenders?publicationId=${publicationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch publication tenders by publication ID');
      }
      return response.json();
    },
    enabled: !!publicationId, // Only run the query if publicationId is provided
  });
};

// Hook to fetch publication tenders by date range
export const usePublicationTendersByDateRange = (startDate: Date, endDate: Date) => {
  return useQuery<PublicationTender[], Error>({
    queryKey: ['publicationTenders', 'by-date-range', { startDate, endDate }],
    queryFn: async () => {
      const response = await fetch(
        `/api/publication-tenders/by-date-range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch publication tenders by date range');
      }
      return response.json();
    },
    enabled: !!(startDate && endDate), // Only run the query if both dates are provided
  });
};