import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  OpeningBid, 
  NewOpeningBid, 
  UpdateOpeningBid 
} from '@/db/schema';

// API request functions
const fetchOpenBids = async (): Promise<OpeningBid[]> => {
  const response = await fetch('/api/open-bids');
  if (!response.ok) {
    throw new Error('Failed to fetch opening bids');
  }
  return response.json();
};

const fetchOpenBidById = async (id: number): Promise<OpeningBid> => {
  const response = await fetch(`/api/open-bids?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch opening bid');
  }
  return response.json();
};

const fetchOpenBidsByPublicationTenderId = async (publicationTenderId: number): Promise<OpeningBid[]> => {
  const response = await fetch(`/api/open-bids?publicationTenderId=${publicationTenderId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch opening bids for publication tender');
  }
  return response.json();
};

const fetchOpenBidsByStatus = async (status: string): Promise<OpeningBid[]> => {
  const response = await fetch(`/api/open-bids?status=${status}`);
  if (!response.ok) {
    throw new Error('Failed to fetch opening bids by status');
  }
  return response.json();
};

const fetchOpenBidsByDateRange = async ({ dateFrom, dateTo }: { dateFrom: Date, dateTo: Date }): Promise<OpeningBid[]> => {
  const response = await fetch(`/api/open-bids?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch opening bids by date range');
  }
  return response.json();
};

const createOpenBid = async (data: NewOpeningBid): Promise<OpeningBid> => {
  const response = await fetch('/api/open-bids', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create opening bid');
  }
  
  return response.json();
};

const updateOpenBid = async ({ 
  id, 
  data 
}: { 
  id: number; 
  data: UpdateOpeningBid;
}): Promise<OpeningBid> => {
  const response = await fetch(`/api/open-bids?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update opening bid');
  }
  
  return response.json();
};

const deleteOpenBid = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/open-bids?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete opening bid');
  }
  
  return response.json();
};

// React Query hooks
export const useOpenBids = () => {
  return useQuery<OpeningBid[], Error>({
    queryKey: ['openBids'],
    queryFn: fetchOpenBids,
  });
};

export const useOpenBid = (id: number) => {
  return useQuery<OpeningBid, Error>({
    queryKey: ['openBid', id],
    queryFn: () => fetchOpenBidById(id),
    enabled: !!id, // Only run query if ID is provided
  });
};

export const useOpenBidsByPublicationTenderId = (publicationTenderId: number) => {
  return useQuery<OpeningBid[], Error>({
    queryKey: ['openBids', 'publicationTender', publicationTenderId],
    queryFn: () => fetchOpenBidsByPublicationTenderId(publicationTenderId),
    enabled: !!publicationTenderId, // Only run query if publicationTenderId is provided
  });
};

export const useOpenBidsByStatus = (status: string) => {
  return useQuery<OpeningBid[], Error>({
    queryKey: ['openBids', 'status', status],
    queryFn: () => fetchOpenBidsByStatus(status),
    enabled: !!status, // Only run query if status is provided
  });
};

export const useOpenBidsByDateRange = (dateFrom?: Date, dateTo?: Date) => {
  return useQuery<OpeningBid[], Error>({
    queryKey: ['openBids', 'dateRange', dateFrom, dateTo],
    queryFn: () => fetchOpenBidsByDateRange({ dateFrom: dateFrom!, dateTo: dateTo! }),
    enabled: !!(dateFrom && dateTo), // Only run query if both dates are provided
  });
};

export const useCreateOpenBid = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OpeningBid, Error, NewOpeningBid>({
    mutationFn: createOpenBid,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['openBids'] });
    },
  });
};

export const useUpdateOpenBid = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OpeningBid, Error, { id: number; data: UpdateOpeningBid }>({
    mutationFn: updateOpenBid,
    onSuccess: (data) => {
      // Invalidate and update relevant queries
      queryClient.invalidateQueries({ queryKey: ['openBids'] });
      queryClient.invalidateQueries({ queryKey: ['openBid', data.id] });
      
      if (data.publicationTenderId) {
        queryClient.invalidateQueries({ 
          queryKey: ['openBids', 'publicationTender', data.publicationTenderId] 
        });
      }
      
      if (data.status) {
        queryClient.invalidateQueries({ 
          queryKey: ['openBids', 'status', data.status] 
        });
      }
    },
  });
};

export const useDeleteOpenBid = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deleteOpenBid,
    onSuccess: (_, id) => {
      // Get the deleted item from the cache before invalidating
      const deletedItem = queryClient.getQueryData<OpeningBid>(['openBid', id]);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['openBids'] });
      queryClient.invalidateQueries({ queryKey: ['openBid', id] });
      
      if (deletedItem?.publicationTenderId) {
        queryClient.invalidateQueries({ 
          queryKey: ['openBids', 'publicationTender', deletedItem.publicationTenderId] 
        });
      }
      
      if (deletedItem?.status) {
        queryClient.invalidateQueries({ 
          queryKey: ['openBids', 'status', deletedItem.status] 
        });
      }
    },
  });
}; 