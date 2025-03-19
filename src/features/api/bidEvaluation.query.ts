import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  BidEvaluation, 
  NewBidEvaluation, 
  UpdateBidEvaluation 
} from '@/db/schema';

// API request functions
const fetchBidEvaluations = async (): Promise<BidEvaluation[]> => {
  const response = await fetch('/api/bid-evaluations');
  if (!response.ok) {
    throw new Error('Failed to fetch bid evaluations');
  }
  return response.json();
};

const fetchBidEvaluationById = async (id: number): Promise<BidEvaluation> => {
  const response = await fetch(`/api/bid-evaluations?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch bid evaluation');
  }
  const data = await response.json();
  if (!data) {
    throw new Error('Bid evaluation not found');
  }
  return data;
};

const fetchBidEvaluationsByOpenBidId = async (openBidId: number): Promise<BidEvaluation[]> => {
  const response = await fetch(`/api/bid-evaluations?openBidId=${openBidId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch bid evaluations for open bid');
  }
  return response.json();
};

const fetchBidEvaluationsByStatus = async (status: string): Promise<BidEvaluation[]> => {
  const response = await fetch(`/api/bid-evaluations?status=${status}`);
  if (!response.ok) {
    throw new Error('Failed to fetch bid evaluations by status');
  }
  return response.json();
};

const fetchBidEvaluationsByDateRange = async (
  params: { dateFrom: Date, dateTo: Date }
): Promise<BidEvaluation[]> => {
  const { dateFrom, dateTo } = params;
  const response = await fetch(
    `/api/bid-evaluations?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch bid evaluations by date range');
  }
  return response.json();
};

const createBidEvaluation = async (data: NewBidEvaluation): Promise<BidEvaluation> => {
  const response = await fetch('/api/bid-evaluations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create bid evaluation');
  }
  
  return response.json();
};

const updateBidEvaluation = async (
  { id, data }: { id: number; data: UpdateBidEvaluation }
): Promise<BidEvaluation> => {
  const response = await fetch(`/api/bid-evaluations?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update bid evaluation');
  }
  
  return response.json();
};

const deleteBidEvaluation = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/bid-evaluations?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete bid evaluation');
  }
  
  return response.json();
};

// React Query hooks
export const useBidEvaluations = () => {
  return useQuery<BidEvaluation[], Error>({
    queryKey: ['bidEvaluations'],
    queryFn: fetchBidEvaluations,
  });
};

export const useBidEvaluation = (id: number) => {
  return useQuery<BidEvaluation, Error>({
    queryKey: ['bidEvaluation', id],
    queryFn: () => fetchBidEvaluationById(id),
    enabled: !!id, // Only run query if ID is provided
  });
};

export const useBidEvaluationsByOpenBidId = (openBidId: number) => {
  return useQuery<BidEvaluation[], Error>({
    queryKey: ['bidEvaluations', 'openBid', openBidId],
    queryFn: () => fetchBidEvaluationsByOpenBidId(openBidId),
    enabled: !!openBidId, // Only run query if openBidId is provided
  });
};

export const useBidEvaluationsByStatus = (status: string) => {
  return useQuery<BidEvaluation[], Error>({
    queryKey: ['bidEvaluations', 'status', status],
    queryFn: () => fetchBidEvaluationsByStatus(status),
    enabled: !!status, // Only run query if status is provided
  });
};

export const useBidEvaluationsByDateRange = (dateFrom?: Date, dateTo?: Date) => {
  return useQuery<BidEvaluation[], Error>({
    queryKey: ['bidEvaluations', 'dateRange', dateFrom, dateTo],
    queryFn: () => fetchBidEvaluationsByDateRange({ dateFrom: dateFrom!, dateTo: dateTo! }),
    enabled: !!(dateFrom && dateTo), // Only run query if both dates are provided
  });
};

export const useCreateBidEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BidEvaluation, Error, NewBidEvaluation>({
    mutationFn: createBidEvaluation,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['bidEvaluations'] });
    },
  });
};

export const useUpdateBidEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<BidEvaluation, Error, { id: number; data: UpdateBidEvaluation }>({
    mutationFn: updateBidEvaluation,
    onSuccess: (data) => {
      // Invalidate and update relevant queries
      queryClient.invalidateQueries({ queryKey: ['bidEvaluations'] });
      queryClient.invalidateQueries({ queryKey: ['bidEvaluation', data.id] });
      
      if (data.openingBidId) {
        queryClient.invalidateQueries({ 
          queryKey: ['bidEvaluations', 'openBid', data.openingBidId] 
        });
      }
      
      if (data.status) {
        queryClient.invalidateQueries({ 
          queryKey: ['bidEvaluations', 'status', data.status] 
        });
      }
    },
  });
};

export const useDeleteBidEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: deleteBidEvaluation,
    onSuccess: () => {
      // Invalidate related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['bidEvaluations'] });
    },
  });
}; 