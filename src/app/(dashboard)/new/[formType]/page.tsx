"use client"
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Form } from "@/components/form";
import { getFormFieldsByType, formTitles, FormType, FormField } from "@/constants/form-data-object";
import { FormMenu } from "@/components/FormMenu";
import { useCreateIdentification, useIdentifications } from "@/features/api/identification.query";
import { useCreatePlanning, usePlannings } from "@/features/api/planning.query";
import { useCreatePublication, usePublications } from "@/features/api/publication.query";
import { useCreatePublicationTender, usePublicationTenders } from "@/features/api/publicationTender.query";
import { useCreateOpenBid, useOpenBids } from "@/features/api/openBid.query";
import { useCreateBidEvaluation, useBidEvaluations } from "@/features/api/bidEvaluation.query";
import { useCreateContractSigning, useContractSignings } from "@/features/api/contractSigning.query";
import { useCreateContractManagement, useContractManagements } from "@/features/api/contractManagement.query";
import { useCreateInvoice, useInvoices } from "@/features/api/invoice.query";
import { 
  NewItemIdentification, 
  NewPlanning, 
  NewPublication, 
  NewPublicationTender, 
  NewOpeningBid, 
  NewBidEvaluation,
  NewContractSigning,
  NewContractManagement,
  NewInvoice 
} from "@/db/schema";
import { Loader2, AlertCircle } from "lucide-react";
import { NavMenu }  from "@/components/nav-menu";
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function DynamicForm() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = params.formType as FormType;
  
  // Get parentId from URL query parameters (if available)
  // This will be used to establish relationships between entities
  const parentId = searchParams.get('parentId') ? parseInt(searchParams.get('parentId')!, 10) : null;
  const parentType = searchParams.get('parentType') as FormType | null;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [prefillData, setPrefillData] = useState<Record<string, any>>({});
  const [isLoadingPrefill, setIsLoadingPrefill] = useState(false);
  
  const formFields = getFormFieldsByType(formType);
  const formTitle = formTitles[formType] || "Form";

  // React Query mutations
  const createIdentification = useCreateIdentification();
  const createPlanning = useCreatePlanning();
  const createPublication = useCreatePublication();
  const createPublicationTender = useCreatePublicationTender();
  const createOpenBid = useCreateOpenBid();
  const createBidEvaluation = useCreateBidEvaluation();
  const createContractSigning = useCreateContractSigning();
  const createContractManagement = useCreateContractManagement();
  const createInvoice = useCreateInvoice();

  // Queries for prefilling data
  const { data: identifications } = useIdentifications();
  const { data: plannings } = usePlannings();
  const { data: publications } = usePublications();
  const { data: publicationTenders } = usePublicationTenders();
  const { data: openBids } = useOpenBids();
  const { data: bidEvaluations } = useBidEvaluations();
  const { data: contractSignings } = useContractSignings();
  const { data: contractManagements } = useContractManagements();

  // Function to load prefill data based on form type and parent
  useEffect(() => {
    const loadPrefillData = async () => {
      if (!parentId || !parentType) return;
      
      setIsLoadingPrefill(true);
      try {
        // For each form type, determine what to prefill based on the parent type
        const prefillValues: Record<string, any> = {};
        
        // Determine prefill data based on form type and parent type
        switch (formType) {
          case 'planning':
            if (parentType === 'identification' && identifications) {
              const identification = identifications.find(i => i.id === parentId);
              if (identification) {
                prefillValues.tenderTitle = identification.tenderTitle;
                prefillValues.identificationId = identification.id;
                prefillValues.estimatedBudget = identification.budget;
              }
            }
            break;
          
          case 'publication':
            if (parentType === 'planning' && plannings) {
              const planning = plannings.find(p => p.id === parentId);
              if (planning) {
                prefillValues.tenderTitle = planning.tenderTitle;
                prefillValues.planningId = planning.id;
              }
            }
            break;
          
          case 'publicationTender':
            if (parentType === 'publication' && publications) {
              const publication = publications.find(p => p.id === parentId);
              if (publication) {
                prefillValues.tenderTitle = publication.tenderTitle;
                prefillValues.publicationId = publication.id;
              }
            }
            break;
          
          case 'openBid':
            if (parentType === 'publicationTender' && publicationTenders) {
              const publicationTender = publicationTenders.find(pt => pt.id === parentId);
              if (publicationTender) {
                prefillValues.tenderTitle = publicationTender.tenderTitle;
                prefillValues.publicationTenderId = publicationTender.id;
              }
            }
            break;
          
          case 'bidEvaluation':
            if (parentType === 'openBid' && openBids) {
              const openBid = openBids.find(ob => ob.id === parentId);
              if (openBid) {
                prefillValues.tenderTitle = openBid.tenderTitle;
                prefillValues.openingBidId = openBid.id;
              }
            }
            break;
          
          case 'contractSigning':
            if (parentType === 'bidEvaluation' && bidEvaluations) {
              const bidEvaluation = bidEvaluations.find(be => be.id === parentId);
              if (bidEvaluation) {
                prefillValues.tenderTitle = bidEvaluation.tenderTitle;
                prefillValues.bidEvaluationId = bidEvaluation.id;
              }
            }
            break;
          
          case 'contractManagement':
            if (parentType === 'contractSigning' && contractSignings) {
              const contractSigning = contractSignings.find(cs => cs.id === parentId);
              if (contractSigning) {
                prefillValues.tenderTitle = contractSigning.tenderTitle;
                prefillValues.contractSigningId = contractSigning.id;
                prefillValues.tenderExecutionStartDate = contractSigning.contractStartDate;
                prefillValues.tenderExecutionEndDate = contractSigning.contractEndDate;
              }
            }
            break;
          
          case 'invoice':
            if (parentType === 'contractManagement' && contractManagements) {
              const contractManagement = contractManagements.find(cm => cm.id === parentId);
              if (contractManagement) {
                prefillValues.tenderTitle = contractManagement.tenderTitle;
                prefillValues.contractManagementId = contractManagement.id;
              }
            }
            break;
        }
        
        setPrefillData(prefillValues);
      } catch (error) {
        console.error("Error loading prefill data:", error);
        setError("Failed to load related data for prefilling");
      } finally {
        setIsLoadingPrefill(false);
      }
    };
    
    loadPrefillData();
  }, [
    formType, parentId, parentType, 
    identifications, plannings, publications, publicationTenders, 
    openBids, bidEvaluations, contractSignings, contractManagements
  ]);

  const handleFormSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Merge the form data with prefill data
      const mergedData = { ...prefillData, ...data };
      
      // Format date fields to ISO strings
      const formattedData = formatFormData(mergedData, formFields);
      
      // Handle different form types
      switch (formType) {
        case 'identification':
          await submitIdentificationForm(formattedData);
          break;
        case 'planning':
          await submitPlanningForm(formattedData);
          break;
        case 'publication':
          await submitPublicationForm(formattedData);
          break;
        case 'publicationTender':
          await submitPublicationTenderForm(formattedData);
          break;
        case 'openBid':
          await submitOpeningBidsForm(formattedData);
          break;
        case 'bidEvaluation':
          await submitBidEvaluationForm(formattedData);
          break;
        case 'contractSigning':
          await submitContractSigningForm(formattedData);
          break;
        case 'contractManagement':
          await submitContractManagementForm(formattedData);
          break;
        case 'invoice':
          await submitInvoiceForm(formattedData);
          break;
        default:
          console.error(`Form type ${formType} not supported`);
          setError(`Form type ${formType} is not supported yet.`);
      }
    } catch (error) {
      console.error(`Error submitting ${formType} form:`, error);
      setError(error instanceof Error ? error.message : "An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format form data (convert dates, numbers, etc.)
  const formatFormData = (data: Record<string, any>, fields: FormField[]) => {
    const formattedData: Record<string, any> = {};
    
    fields.forEach(field => {
      if (field.type === 'date' && data[field.name]) {
        // Convert date strings to Date objects
        formattedData[field.name] = new Date(data[field.name]);
      } else if (field.type === 'number' && data[field.name]) {
        // Convert string numbers to actual numbers
        formattedData[field.name] = Number(data[field.name]);
      } else {
        formattedData[field.name] = data[field.name];
      }
    });
    
    // Also include any prefill data that might not be in the form fields
    // (like foreign key IDs that link to parent entities)
    Object.keys(data).forEach(key => {
      if (!formattedData[key] && data[key] !== undefined && data[key] !== null) {
        if (key.endsWith('Id') && typeof data[key] === 'string') {
          // Convert ID strings to numbers
          formattedData[key] = Number(data[key]);
        } else {
          formattedData[key] = data[key];
        }
      }
    });
    
    return formattedData;
  };

  // Form submission handlers for each form type
  const submitIdentificationForm = async (data: Record<string, any>) => {
    // Cast the data to the expected type
    const identificationData = data as unknown as NewItemIdentification;
    const result = await createIdentification.mutateAsync(identificationData);
    setSuccess("Identification form submitted successfully!");
    // Navigate to the next form in the sequence with parent ID
    router.push(`/new/planning?parentId=${result.id}&parentType=identification`);
  };

  const submitPlanningForm = async (data: Record<string, any>) => {
    // Cast the data to the expected type
    const planningData = data as unknown as NewPlanning;
    const result = await createPlanning.mutateAsync(planningData);
    setSuccess("Planning form submitted successfully!");
    // Navigate to the next form in the sequence with parent ID
    router.push(`/new/publication?parentId=${result.id}&parentType=planning`);
  };

  const submitPublicationForm = async (data: Record<string, any>) => {
    // Cast the data to the expected type
    const publicationData = data as unknown as NewPublication;
    const result = await createPublication.mutateAsync(publicationData);
    setSuccess("Publication form submitted successfully!");
    // Navigate to the next form in the sequence with parent ID
    router.push(`/new/publicationTender?parentId=${result.id}&parentType=publication`);
  };

  const submitPublicationTenderForm = async (data: Record<string, any>) => {
    // Cast the data to the expected type
    const publicationTenderData = data as unknown as NewPublicationTender;
    const result = await createPublicationTender.mutateAsync(publicationTenderData);
    setSuccess("Publication tender form submitted successfully!");
    // Navigate to the next form in the sequence with parent ID
    router.push(`/new/openBid?parentId=${result.id}&parentType=publicationTender`);
  };

  const submitOpeningBidsForm = async (data: Record<string, any>) => {
    try {
      console.log("Raw form data:", data);
      
      // Create a properly structured object that matches the schema
      const openBidData: NewOpeningBid = {
        tenderTitle: data.tenderTitle || "",
        bidOpeningDate: new Date(data.bidOpeningDate),
        publicationTenderId: data.publicationTenderId ? Number(data.publicationTenderId) : null
      };
      
      console.log("Transformed data:", openBidData);
      
      const result = await createOpenBid.mutateAsync(openBidData);
      console.log("Submission result:", result);
      
      setSuccess("Open bids form submitted successfully!");
      // Navigate to the next form in the sequence with parent ID
      router.push(`/new/bidEvaluation?parentId=${result.id}&parentType=openBid`);
    } catch (error) {
      console.error("Error submitting open bid form:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      throw error;
    }
  };

  const submitBidEvaluationForm = async (data: Record<string, any>) => {
    try {
      console.log("Raw bid evaluation form data:", data);
      
      // Create a properly structured object that matches the schema
      const bidEvaluationData: NewBidEvaluation = {
        tenderTitle: data.tenderTitle || "",
        bidEvaluationDate: new Date(data.bidEvaluationDate),
        bidValidityStartingDate: new Date(data.bidValidityStartingDate),
        bidValidityEndingDate: new Date(data.bidValidityEndingDate),
        notificationDate: new Date(data.notificationDate),
        contractNegotiationDate: new Date(data.contractNegotiationDate),
        contractAmount: Number(data.contractAmount),
        status: data.status || "Pending",
        openingBidId: data.openingBidId ? Number(data.openingBidId) : null
      };
      
      console.log("Transformed bid evaluation data:", bidEvaluationData);
      
      const result = await createBidEvaluation.mutateAsync(bidEvaluationData);
      console.log("Bid evaluation submission result:", result);
      
      setSuccess("Bid evaluation form submitted successfully!");
      // Navigate to the next form in the sequence with parent ID
      router.push(`/new/contractSigning?parentId=${result.id}&parentType=bidEvaluation`);
    } catch (error) {
      console.error("Error submitting bid evaluation form:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      throw error;
    }
  };

  const submitContractSigningForm = async (data: Record<string, any>) => {
    try {
      console.log("Raw contract signing form data:", data);
      
      // Create a properly structured object that matches the schema
      const contractSigningData: NewContractSigning = {
        tenderTitle: data.tenderTitle || "",
        draftOfTheContractDate: new Date(data.draftOfTheContractDate),
        reviewAndApprovalByTheLegalDate: new Date(data.reviewAndApprovalByTheLegalDate),
        contractorBidderApprovalDate: new Date(data.contractorBidderApprovalDate),
        contractorBidderNames: data.contractorBidderNames || "",
        contractorBidderEmail: data.contractorBidderEmail || "",
        contractorBidderPhoneNumber: data.contractorBidderPhoneNumber || "",
        performanceGuaranteeValidityStartDate: new Date(data.performanceGuaranteeValidityStartDate),
        performanceGuaranteeValidityEndDate: new Date(data.performanceGuaranteeValidityEndDate),
        submissionOfPerformanceGuaranteeDate: new Date(data.submissionOfPerformanceGuaranteeDate),
        approvalOfContractByTheMOJDate: new Date(data.approvalOfContractByTheMOJDate),
        approvalOfTheCBMDate: new Date(data.approvalOfTheCBMDate),
        contractStartDate: new Date(data.contractStartDate),
        contractEndDate: new Date(data.contractEndDate),
        status: data.status || "Pending",
        bidEvaluationId: data.bidEvaluationId ? Number(data.bidEvaluationId) : null
      };
      
      console.log("Transformed contract signing data:", contractSigningData);
      
      const result = await createContractSigning.mutateAsync(contractSigningData);
      console.log("Contract signing submission result:", result);
      
      setSuccess("Contract signing form submitted successfully!");
      // Navigate to the next form in the sequence with parent ID
      router.push(`/new/contractManagement?parentId=${result.id}&parentType=contractSigning`);
    } catch (error) {
      console.error("Error submitting contract signing form:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      throw error;
    }
  };

  const submitContractManagementForm = async (data: Record<string, any>) => {
    try {
      console.log("Raw contract management form data:", data);
      
      // Create a properly structured object that matches the schema
      const contractManagementData: NewContractManagement = {
        tenderTitle: data.tenderTitle || "",
        dateOfPurchaseOrderIssue: new Date(data.dateOfPurchaseOrderIssue),
        divisionIssuingAPurchaseOrder: data.divisionIssuingAPurchaseOrder || "",
        focalPerformanceFromTheProgram: data.focalPerformanceFromTheProgram || "",
        procurementStaff: data.procurementStaff || "",
        performanceGuaranteeEndPeriod: new Date(data.performanceGuaranteeEndPeriod),
        tenderExecutionStartDate: new Date(data.tenderExecutionStartDate),
        tenderExecutionEndDate: new Date(data.tenderExecutionEndDate),
        inspectionDoneBy: data.inspectionDoneBy || "",
        inspectionList: data.inspectionList || "",
        deliveryDate: new Date(data.deliveryDate),
        acceptanceDate: new Date(data.acceptanceDate),
        warrantyLiabilityStartDate: new Date(data.warrantyLiabilityStartDate),
        warrantyLiabilityEndDate: new Date(data.warrantyLiabilityEndDate),
        status: data.status || "Pending",
        contractSigningId: data.contractSigningId ? Number(data.contractSigningId) : null
      };
      
      console.log("Transformed contract management data:", contractManagementData);
      
      const result = await createContractManagement.mutateAsync(contractManagementData);
      console.log("Contract management submission result:", result);
      
      setSuccess("Contract management form submitted successfully!");
      // Navigate to the next form in the sequence with parent ID
      router.push(`/new/invoice?parentId=${result.id}&parentType=contractManagement`);
    } catch (error) {
      console.error("Error submitting contract management form:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      throw error;
    }
  };

  const submitInvoiceForm = async (data: Record<string, any>) => {
    try {
      console.log("Raw invoice form data:", data);
      
      // Create a properly structured object that matches the schema
      const invoiceData: NewInvoice = {
        tenderTitle: data.tenderTitle || "",
        invoiceSubmissionDate: new Date(data.invoiceSubmissionDate),
        invoiceReceivedByTheFinanceOfficeDate: new Date(data.invoiceReceivedByTheFinanceOfficeDate),
        requestedForPaymentDate: new Date(data.requestedForPaymentDate),
        dateOfInvoicePayment: new Date(data.dateOfInvoicePayment),
        status: data.status || "Pending",
        contractManagementId: data.contractManagementId ? Number(data.contractManagementId) : null
      };
      
      console.log("Transformed invoice data:", invoiceData);
      
      const result = await createInvoice.mutateAsync(invoiceData);
      console.log("Invoice submission result:", result);
      
      setSuccess("Invoice form submitted successfully!");
      // Navigate to the list view after completing the final form
      router.push(`/list?formType=invoice`);
    } catch (error) {
      console.error("Error submitting invoice form:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      throw error;
    }
  };

  // Convert FormField[] to the expected type for the Form component
  const formFieldsForComponent = formFields.map(field => {
    // Check if this field should be prefilled and also provide initial values
    const initialValue = prefillData[field.name] || "";
    
    return {
      name: field.name,
      title: field.title,
      type: field.type === 'file' ? 'text' : field.type, // Convert 'file' type to 'text' as a workaround
      placeholder: field.placeholder,
      options: field.options,
      required: field.required,
      initialValue: initialValue, // Set initial value from prefill data
      disabled: field.name === 'tenderTitle' && !!prefillData.tenderTitle // Disable tenderTitle if prefilled
    };
  });

  // Show related entity info when pre-filling
  const renderParentInfo = () => {
    if (!parentId || !parentType) return null;
    
    return (
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-600">Related Information</AlertTitle>
        <AlertDescription>
          This form will be linked to the {formTitles[parentType]} with ID: {parentId}.
          {prefillData.tenderTitle && (
            <div className="mt-1">Tender Title: <strong>{prefillData.tenderTitle}</strong></div>
          )}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <section className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 bg-white rounded-xl p-4">
    <div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-full">
          <p>{success}</p>
        </div>
      )}
      
      {renderParentInfo()}
      
      <div className="">
      {isLoadingPrefill ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading related data...</p>
        </div>
      ) : formFields.length > 0 ? (
        <>
          <div className="w-full">
            <h1 className="flex items-start text-blue-600 text-xl font-bold mb-4">
              {formTitle}
              {parentType && ` (Linked to ${formTitles[parentType]})`}
            </h1>
          </div>
          <Form 
            fields={formFieldsForComponent} 
            onSubmit={handleFormSubmit} 
            initialValues={prefillData}
          />
          
          {isSubmitting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2">Submitting form...</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-red-500">Form type not found</div>
      )}
      </div>
    </div>
    </section>
  );
} 