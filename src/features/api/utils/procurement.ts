import { 
  ItemIdentification, 
  Planning, 
  Publication, 
  PublicationTender 
} from '@/db/schema';

export type ProcurementStage = 'identification' | 'planning' | 'publication' | 'publicationTender';

export type ProcurementSummary = {
  id: number;
  tenderTitle: string;
  division?: string;
  status?: string;
  budget?: number;
  estimatedBudget?: number;
  planningStatus?: string;
  dateOfTenderPublication?: Date;
  stage: ProcurementStage;
};

export type ProcurementProcess = {
  identification: ItemIdentification | null;
  planning: Planning | null;
  publication: Publication | null;
  publicationTender: PublicationTender | null;
};

export type TimelineEvent = {
  stage: ProcurementStage;
  title: string;
  date: Date;
  status: string;
};

/**
 * Determine the current stage of a procurement process
 */
export function determineProcurementStage(
  identification: ItemIdentification | null,
  planning: Planning | null,
  publication: Publication | null,
  publicationTender: PublicationTender | null
): ProcurementStage {
  if (publicationTender) {
    return 'publicationTender';
  } else if (publication) {
    return 'publication';
  } else if (planning) {
    return 'planning';
  } else {
    return 'identification';
  }
}

/**
 * Create a procurement summary from the given data
 */
export function createProcurementSummary(
  identification: ItemIdentification,
  planning: Planning | null,
  publication: Publication | null,
  publicationTender: PublicationTender | null
): ProcurementSummary {
  const stage = determineProcurementStage(identification, planning, publication, publicationTender);
  
  return {
    id: identification.id,
    tenderTitle: identification.tenderTitle,
    division: identification.division,
    status: identification.status,
    budget: identification.budget,
    estimatedBudget: planning?.estimatedBudget,
    planningStatus: planning?.planningStatus,
    dateOfTenderPublication: publicationTender?.dateOfTenderPublication,
    stage
  };
}

/**
 * Create a timeline of events for a procurement process
 */
export function createProcurementTimeline(
  identification: ItemIdentification,
  planning: Planning | null,
  publication: Publication | null,
  publicationTender: PublicationTender | null
): TimelineEvent[] {
  const timeline: TimelineEvent[] = [
    {
      stage: 'identification',
      title: 'Identification Created',
      date: identification.createdAt,
      status: identification.status
    }
  ];

  if (planning) {
    timeline.push({
      stage: 'planning',
      title: 'Planning Created',
      date: planning.createdAt,
      status: planning.planningStatus
    });

    // Add planned dates to timeline
    if (planning.plannedTenderDocumentPreparation) {
      timeline.push({
        stage: 'planning',
        title: 'Planned Tender Document Preparation',
        date: planning.plannedTenderDocumentPreparation,
        status: 'planned'
      });
    }

    if (planning.plannedPublicationDate) {
      timeline.push({
        stage: 'planning',
        title: 'Planned Publication Date',
        date: planning.plannedPublicationDate,
        status: 'planned'
      });
    }

    if (planning.plannedBidOpeningDate) {
      timeline.push({
        stage: 'planning',
        title: 'Planned Bid Opening Date',
        date: planning.plannedBidOpeningDate,
        status: 'planned'
      });
    }

    if (planning.plannedEvaluationDate) {
      timeline.push({
        stage: 'planning',
        title: 'Planned Evaluation Date',
        date: planning.plannedEvaluationDate,
        status: 'planned'
      });
    }

    if (planning.plannedNotificationDate) {
      timeline.push({
        stage: 'planning',
        title: 'Planned Notification Date',
        date: planning.plannedNotificationDate,
        status: 'planned'
      });
    }

    if (planning.plannedContractClosureDate) {
      timeline.push({
        stage: 'planning',
        title: 'Planned Contract Closure Date',
        date: planning.plannedContractClosureDate,
        status: 'planned'
      });
    }
  }

  if (publication) {
    timeline.push({
      stage: 'publication',
      title: 'Publication Created',
      date: publication.createdAt,
      status: 'active'
    });

    if (publication.initialProcurementPlanPublication) {
      timeline.push({
        stage: 'publication',
        title: 'Initial Procurement Plan Publication',
        date: publication.initialProcurementPlanPublication,
        status: 'completed'
      });
    }

    if (publication.quarterIIProcurementPlanPublication) {
      timeline.push({
        stage: 'publication',
        title: 'Quarter II Procurement Plan Publication',
        date: publication.quarterIIProcurementPlanPublication,
        status: 'completed'
      });
    }

    if (publication.quarterIIIProcurementPlanPublication) {
      timeline.push({
        stage: 'publication',
        title: 'Quarter III Procurement Plan Publication',
        date: publication.quarterIIIProcurementPlanPublication,
        status: 'completed'
      });
    }
  }

  if (publicationTender) {
    timeline.push({
      stage: 'publicationTender',
      title: 'Publication Tender Created',
      date: publicationTender.createdAt,
      status: 'active'
    });

    if (publicationTender.dateOfPreparationOfTenderDocument) {
      timeline.push({
        stage: 'publicationTender',
        title: 'Preparation of Tender Document',
        date: publicationTender.dateOfPreparationOfTenderDocument,
        status: 'completed'
      });
    }

    if (publicationTender.dateOfSubmissionOfTheDocumentCommitteeForApproval) {
      timeline.push({
        stage: 'publicationTender',
        title: 'Submission of Document Committee for Approval',
        date: publicationTender.dateOfSubmissionOfTheDocumentCommitteeForApproval,
        status: 'completed'
      });
    }

    if (publicationTender.dateOfCBMApproval) {
      timeline.push({
        stage: 'publicationTender',
        title: 'CBM Approval',
        date: publicationTender.dateOfCBMApproval,
        status: 'completed'
      });
    }

    if (publicationTender.dateOfTenderPublication) {
      timeline.push({
        stage: 'publicationTender',
        title: 'Tender Publication',
        date: publicationTender.dateOfTenderPublication,
        status: 'completed'
      });
    }
  }

  // Sort timeline by date
  return timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Get a color for a status
 */
export function getStatusColor(status: string | null | undefined): string {
  if (!status) return 'gray';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('approved') || statusLower.includes('completed') || statusLower === 'active') {
    return 'green';
  } else if (statusLower.includes('pending') || statusLower.includes('planned')) {
    return 'yellow';
  } else if (statusLower.includes('rejected') || statusLower.includes('failed')) {
    return 'red';
  } else {
    return 'blue';
  }
}

/**
 * Calculate the progress of a procurement process (0-100)
 */
export function calculateProcurementProgress(
  identification: ItemIdentification | null,
  planning: Planning | null,
  publication: Publication | null,
  publicationTender: PublicationTender | null
): number {
  if (!identification) return 0;
  
  // Base progress for having an identification
  let progress = 25;
  
  if (planning) {
    progress += 25;
  }
  
  if (publication) {
    progress += 25;
  }
  
  if (publicationTender) {
    progress += 25;
  }
  
  return progress;
} 