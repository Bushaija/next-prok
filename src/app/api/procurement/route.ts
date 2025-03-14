import { NextRequest, NextResponse } from 'next/server';
import { PlanningService } from '@/services/planningService';
import { PublicationService } from '@/services/publicationService';
import { PublicationTenderService } from '@/services/publicationTenderService';
import { ItemIdentificationService } from '@/services/itemIdentificationService';
import { z } from 'zod';

const planningService = new PlanningService();
const publicationService = new PublicationService();
const publicationTenderService = new PublicationTenderService();
const itemIdentificationService = new ItemIdentificationService();

// GET handler - fetch procurement data based on query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'complete-process': {
        const identificationIdParam = searchParams.get('identificationId');
        if (!identificationIdParam) {
          return NextResponse.json(
            { error: 'Identification ID is required' },
            { status: 400 }
          );
        }

        const identificationId = parseInt(identificationIdParam, 10);
        if (isNaN(identificationId)) {
          return NextResponse.json(
            { error: 'Invalid identification ID format' },
            { status: 400 }
          );
        }

        // Fetch the identification
        const identification = await itemIdentificationService.getById(identificationId);

        // Fetch associated planning records
        const plannings = await planningService.search({ identificationId });
        const planning = plannings.length > 0 ? plannings[0] : null;

        // If planning exists, fetch associated publication records
        let publication = null;
        if (planning) {
          const publications = await publicationService.search({ planningId: planning.id });
          publication = publications.length > 0 ? publications[0] : null;
        }

        // If publication exists, fetch associated publication tender records
        let publicationTender = null;
        if (publication) {
          const publicationTenders = await publicationTenderService.search({ publicationId: publication.id });
          publicationTender = publicationTenders.length > 0 ? publicationTenders[0] : null;
        }

        return NextResponse.json({
          identification,
          planning,
          publication,
          publicationTender
        });
      }

      case 'summaries': {
        // Fetch all identifications
        const identifications = await itemIdentificationService.getAll();
        
        // Create summaries
        const summaries = await Promise.all(
          identifications.map(async (identification) => {
            // Check if there's a planning for this identification
            const plannings = await planningService.search({ identificationId: identification.id });
            const planning = plannings.length > 0 ? plannings[0] : null;

            // Check if there's a publication for this planning
            let publication = null;
            if (planning) {
              const publications = await publicationService.search({ planningId: planning.id });
              publication = publications.length > 0 ? publications[0] : null;
            }

            // Check if there's a publication tender for this publication
            let publicationTender = null;
            if (publication) {
              const publicationTenders = await publicationTenderService.search({ publicationId: publication.id });
              publicationTender = publicationTenders.length > 0 ? publicationTenders[0] : null;
            }

            // Determine the current stage
            let stage = 'identification';
            if (publicationTender) {
              stage = 'publicationTender';
            } else if (publication) {
              stage = 'publication';
            } else if (planning) {
              stage = 'planning';
            }

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
          })
        );

        return NextResponse.json(summaries);
      }

      case 'by-stage': {
        const stage = searchParams.get('stage');
        if (!stage) {
          return NextResponse.json(
            { error: 'Stage parameter is required' },
            { status: 400 }
          );
        }

        // Fetch all identifications
        const identifications = await itemIdentificationService.getAll();
        
        // Filter and create summaries based on stage
        const summaries = await Promise.all(
          identifications.map(async (identification) => {
            // Check if there's a planning for this identification
            const plannings = await planningService.search({ identificationId: identification.id });
            const planning = plannings.length > 0 ? plannings[0] : null;

            // Check if there's a publication for this planning
            let publication = null;
            if (planning) {
              const publications = await publicationService.search({ planningId: planning.id });
              publication = publications.length > 0 ? publications[0] : null;
            }

            // Check if there's a publication tender for this publication
            let publicationTender = null;
            if (publication) {
              const publicationTenders = await publicationTenderService.search({ publicationId: publication.id });
              publicationTender = publicationTenders.length > 0 ? publicationTenders[0] : null;
            }

            // Determine the current stage
            let currentStage = 'identification';
            if (publicationTender) {
              currentStage = 'publicationTender';
            } else if (publication) {
              currentStage = 'publication';
            } else if (planning) {
              currentStage = 'planning';
            }

            // Only include items in the requested stage
            if (currentStage === stage) {
              return {
                id: identification.id,
                tenderTitle: identification.tenderTitle,
                division: identification.division,
                status: identification.status,
                budget: identification.budget,
                estimatedBudget: planning?.estimatedBudget,
                planningStatus: planning?.planningStatus,
                dateOfTenderPublication: publicationTender?.dateOfTenderPublication,
                stage: currentStage
              };
            }
            
            return null;
          })
        );

        // Filter out null values
        const filteredSummaries = summaries.filter(summary => summary !== null);

        return NextResponse.json(filteredSummaries);
      }

      case 'by-division': {
        const division = searchParams.get('division');
        if (!division) {
          return NextResponse.json(
            { error: 'Division parameter is required' },
            { status: 400 }
          );
        }

        // Fetch identifications by division
        const identifications = await itemIdentificationService.search({ division });
        
        // Create summaries
        const summaries = await Promise.all(
          identifications.map(async (identification) => {
            // Check if there's a planning for this identification
            const plannings = await planningService.search({ identificationId: identification.id });
            const planning = plannings.length > 0 ? plannings[0] : null;

            // Check if there's a publication for this planning
            let publication = null;
            if (planning) {
              const publications = await publicationService.search({ planningId: planning.id });
              publication = publications.length > 0 ? publications[0] : null;
            }

            // Check if there's a publication tender for this publication
            let publicationTender = null;
            if (publication) {
              const publicationTenders = await publicationTenderService.search({ publicationId: publication.id });
              publicationTender = publicationTenders.length > 0 ? publicationTenders[0] : null;
            }

            // Determine the current stage
            let stage = 'identification';
            if (publicationTender) {
              stage = 'publicationTender';
            } else if (publication) {
              stage = 'publication';
            } else if (planning) {
              stage = 'planning';
            }

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
          })
        );

        return NextResponse.json(summaries);
      }

      case 'timeline': {
        const identificationIdParam = searchParams.get('identificationId');
        if (!identificationIdParam) {
          return NextResponse.json(
            { error: 'Identification ID is required' },
            { status: 400 }
          );
        }

        const identificationId = parseInt(identificationIdParam, 10);
        if (isNaN(identificationId)) {
          return NextResponse.json(
            { error: 'Invalid identification ID format' },
            { status: 400 }
          );
        }

        // Fetch the identification
        const identification = await itemIdentificationService.getById(identificationId);
        if (!identification) {
          return NextResponse.json(
            { error: 'Identification not found' },
            { status: 404 }
          );
        }

        // Start building the timeline
        const timeline = [
          {
            stage: 'identification',
            title: 'Identification Created',
            date: identification.createdAt,
            status: identification.status
          }
        ];

        // Fetch associated planning records
        const plannings = await planningService.search({ identificationId });
        const planning = plannings.length > 0 ? plannings[0] : null;

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

        // Fetch associated publication records
        let publication = null;
        if (planning) {
          const publications = await publicationService.search({ planningId: planning.id });
          publication = publications.length > 0 ? publications[0] : null;

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
        }

        // Fetch associated publication tender records
        let publicationTender = null;
        if (publication) {
          const publicationTenders = await publicationTenderService.search({ publicationId: publication.id });
          publicationTender = publicationTenders.length > 0 ? publicationTenders[0] : null;

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
        }

        // Sort timeline by date
        timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return NextResponse.json(timeline);
      }

      case 'statistics': {
        // Fetch all identifications
        const identifications = await itemIdentificationService.getAll();
        
        // Initialize statistics
        const statistics = {
          totalItems: identifications.length,
          byStage: {
            identification: 0,
            planning: 0,
            publication: 0,
            publicationTender: 0
          },
          byDivision: {} as Record<string, number>,
          byStatus: {} as Record<string, number>
        };

        // Process each identification
        for (const identification of identifications) {
          // Count by division
          const division = identification.division || 'Unknown';
          statistics.byDivision[division] = (statistics.byDivision[division] || 0) + 1;

          // Count by status
          const status = identification.status || 'Unknown';
          statistics.byStatus[status] = (statistics.byStatus[status] || 0) + 1;

          // Check if there's a planning for this identification
          const plannings = await planningService.search({ identificationId: identification.id });
          const planning = plannings.length > 0 ? plannings[0] : null;

          // Check if there's a publication for this planning
          let publication = null;
          if (planning) {
            const publications = await publicationService.search({ planningId: planning.id });
            publication = publications.length > 0 ? publications[0] : null;
          }

          // Check if there's a publication tender for this publication
          let publicationTender = null;
          if (publication) {
            const publicationTenders = await publicationTenderService.search({ publicationId: publication.id });
            publicationTender = publicationTenders.length > 0 ? publicationTenders[0] : null;
          }

          // Determine the current stage and count
          if (publicationTender) {
            statistics.byStage.publicationTender++;
          } else if (publication) {
            statistics.byStage.publication++;
          } else if (planning) {
            statistics.byStage.planning++;
          } else {
            statistics.byStage.identification++;
          }
        }

        return NextResponse.json(statistics);
      }

      case 'by-status': {
        const status = searchParams.get('status');
        if (!status) {
          return NextResponse.json(
            { error: 'Status parameter is required' },
            { status: 400 }
          );
        }

        // Fetch identifications by status
        const identifications = await itemIdentificationService.search({ status });
        
        // Create summaries
        const summaries = await Promise.all(
          identifications.map(async (identification) => {
            // Check if there's a planning for this identification
            const plannings = await planningService.search({ identificationId: identification.id });
            const planning = plannings.length > 0 ? plannings[0] : null;

            // Check if there's a publication for this planning
            let publication = null;
            if (planning) {
              const publications = await publicationService.search({ planningId: planning.id });
              publication = publications.length > 0 ? publications[0] : null;
            }

            // Check if there's a publication tender for this publication
            let publicationTender = null;
            if (publication) {
              const publicationTenders = await publicationTenderService.search({ publicationId: publication.id });
              publicationTender = publicationTenders.length > 0 ? publicationTenders[0] : null;
            }

            // Determine the current stage
            let stage = 'identification';
            if (publicationTender) {
              stage = 'publicationTender';
            } else if (publication) {
              stage = 'publication';
            } else if (planning) {
              stage = 'planning';
            }

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
          })
        );

        return NextResponse.json(summaries);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in GET /api/procurement:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.format() },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch procurement data' },
      { status: 500 }
    );
  }
} 