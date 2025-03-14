import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ItemIdentification, 
  NewItemIdentification, 
  UpdateItemIdentification 
} from '@/db/schema';

// API request functions
const fetchIdentifications = async (): Promise<ItemIdentification[]> => {
  const response = await fetch('/api/item-identifications');
  if (!response.ok) {
    throw new Error('Failed to fetch identifications');
  }
  return response.json();
};

const fetchIdentificationById = async (id: number): Promise<ItemIdentification> => {
  const response = await fetch(`/api/item-identifications?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch identification');
  }
  return response.json();
};

const createIdentification = async (data: NewItemIdentification): Promise<ItemIdentification> => {
  const response = await fetch('/api/item-identifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create identification');
  }
  
  return response.json();
};

const updateIdentification = async ({ 
  id, 
  data 
}: { 
  id: number; 
  data: UpdateItemIdentification;
}): Promise<ItemIdentification> => {
  const response = await fetch(`/api/item-identifications?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update identification');
  }
  
  return response.json();
};

const deleteIdentification = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/item-identifications?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete identification');
  }
  
  return response.json();
};

// React Query Hooks
export const useIdentifications = () => {
  return useQuery<ItemIdentification[], Error>({
    queryKey: ['identifications'],
    queryFn: fetchIdentifications,
  });
};

export const useIdentification = (id: number) => {
  return useQuery<ItemIdentification, Error>({
    queryKey: ['identification', id],
    queryFn: () => fetchIdentificationById(id),
    enabled: !!id, // Only run the query if id is provided
  });
};

export const useCreateIdentification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ItemIdentification, Error, NewItemIdentification>({
    mutationFn: createIdentification,
    onSuccess: () => {
      // Invalidate and refetch the identifications list
      queryClient.invalidateQueries({ queryKey: ['identifications'] });
    },
  });
};

export const useUpdateIdentification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    ItemIdentification, 
    Error, 
    { id: number; data: UpdateItemIdentification }
  >({
    mutationFn: updateIdentification,
    onSuccess: (data) => {
      // Update the cache for the specific identification
      queryClient.setQueryData(['identification', data.id], data);
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ['identifications'] });
    },
  });
};

export const useDeleteIdentification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deleteIdentification,
    onSuccess: (_, id) => {
      // Remove the deleted item from the cache
      queryClient.removeQueries({ queryKey: ['identification', id] });
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: ['identifications'] });
    },
  });
};

// Search hook
export const useSearchIdentifications = (criteria: Partial<ItemIdentification>) => {
  const searchParams = new URLSearchParams();
  
  // Add search criteria to query params
  Object.entries(criteria).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const searchQuery = searchParams.toString();
  
  return useQuery<ItemIdentification[], Error>({
    queryKey: ['identifications', 'search', criteria],
    queryFn: async () => {
      const response = await fetch(`/api/item-identifications?${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to search identifications');
      }
      return response.json();
    },
    enabled: Object.keys(criteria).length > 0, // Only run if criteria is provided
  });
};
