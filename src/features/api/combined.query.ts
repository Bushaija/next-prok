import { useQuery } from '@tanstack/react-query';
import { 
  ItemIdentification, 
  Planning, 
  Publication, 
  PublicationTender 
} from '@/db/schema';

// Type definitions for combined data
export type ProcurementProcess = {
  identification: ItemIdentification | null;
  planning: Planning | null;
  publication: Publication | null;
  publicationTender: PublicationTender | null;
};

export type ProcurementSummary = {
  id: number;
  tenderTitle: string;
  division?: string;
  status?: string;
  budget?: number;
  estimatedBudget?: number;
  planningStatus?: string;
  dateOfTenderPublication?: Date;
  stage: 'identification' | 'planning' | 'publication' | 'publicationTender';
};

// API request functions
const fetchCompleteProcurementProcess = async (identificationId: number): Promise<ProcurementProcess> => {
  const response = await fetch(`/api/procurement/complete-process?identificationId=${identificationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch complete procurement process');
  }
  return response.json();
};

const fetchProcurementSummaries = async (): Promise<ProcurementSummary[]> => {
  const response = await fetch('/api/procurement/summaries');
  if (!response.ok) {
    throw new Error('Failed to fetch procurement summaries');
  }
  return response.json();
};

const fetchProcurementByStage = async (stage: string): Promise<ProcurementSummary[]> => {
  const response = await fetch(`/api/procurement/by-stage?stage=${stage}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch procurement items in ${stage} stage`);
  }
  return response.json();
};

const fetchProcurementByDivision = async (division: string): Promise<ProcurementSummary[]> => {
  const response = await fetch(`/api/procurement/by-division?division=${division}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch procurement items for division: ${division}`);
  }
  return response.json();
};

const fetchProcurementTimeline = async (identificationId: number): Promise<any[]> => {
  const response = await fetch(`/api/procurement/timeline?identificationId=${identificationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch procurement timeline');
  }
  return response.json();
};

// Combined React Query Hooks
export const useCompleteProcurementProcess = (identificationId: number) => {
  return useQuery<ProcurementProcess, Error>({
    queryKey: ['procurement', 'complete-process', identificationId],
    queryFn: () => fetchCompleteProcurementProcess(identificationId),
    enabled: !!identificationId, // Only run the query if identificationId is provided
  });
};

export const useProcurementSummaries = () => {
  return useQuery<ProcurementSummary[], Error>({
    queryKey: ['procurement', 'summaries'],
    queryFn: fetchProcurementSummaries,
  });
};

export const useProcurementByStage = (stage: 'identification' | 'planning' | 'publication' | 'publicationTender') => {
  return useQuery<ProcurementSummary[], Error>({
    queryKey: ['procurement', 'by-stage', stage],
    queryFn: () => fetchProcurementByStage(stage),
    enabled: !!stage, // Only run the query if stage is provided
  });
};

export const useProcurementByDivision = (division: string) => {
  return useQuery<ProcurementSummary[], Error>({
    queryKey: ['procurement', 'by-division', division],
    queryFn: () => fetchProcurementByDivision(division),
    enabled: !!division, // Only run the query if division is provided
  });
};

export const useProcurementTimeline = (identificationId: number) => {
  return useQuery<any[], Error>({
    queryKey: ['procurement', 'timeline', identificationId],
    queryFn: () => fetchProcurementTimeline(identificationId),
    enabled: !!identificationId, // Only run the query if identificationId is provided
  });
};

// Hook to fetch all procurement items with their current stage
export const useAllProcurementItems = () => {
  return useQuery<ProcurementSummary[], Error>({
    queryKey: ['procurement', 'all-items'],
    queryFn: async () => {
      const response = await fetch('/api/procurement/all-items');
      if (!response.ok) {
        throw new Error('Failed to fetch all procurement items');
      }
      return response.json();
    },
  });
};

// Hook to fetch procurement statistics
export const useProcurementStatistics = () => {
  return useQuery<{
    totalItems: number;
    byStage: Record<string, number>;
    byDivision: Record<string, number>;
    byStatus: Record<string, number>;
  }, Error>({
    queryKey: ['procurement', 'statistics'],
    queryFn: async () => {
      const response = await fetch('/api/procurement/statistics');
      if (!response.ok) {
        throw new Error('Failed to fetch procurement statistics');
      }
      return response.json();
    },
  });
};

// Hook to fetch procurement items by status
export const useProcurementByStatus = (status: string) => {
  return useQuery<ProcurementSummary[], Error>({
    queryKey: ['procurement', 'by-status', status],
    queryFn: async () => {
      const response = await fetch(`/api/procurement/by-status?status=${status}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch procurement items with status: ${status}`);
      }
      return response.json();
    },
    enabled: !!status, // Only run the query if status is provided
  });
}; 