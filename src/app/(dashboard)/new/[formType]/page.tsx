"use client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Form } from "@/components/form";
import { getFormFieldsByType, formTitles, FormType, FormField } from "@/constants/form-data-object";
import { FormMenu } from "@/components/FormMenu";
import { useCreateIdentification } from "@/features/api/identification.query";
import { useCreatePlanning } from "@/features/api/planning.query";
import { useCreatePublication } from "@/features/api/publication.query";
import { useCreatePublicationTender } from "@/features/api/publicationTender.query";
import { useCreateOpenBid } from "@/features/api/openBid.query";
import { useCreateBidEvaluation } from "@/features/api/bidEvaluation.query";
import { useCreateContractSigning } from "@/features/api/contractSigning.query";
import { useCreateContractManagement } from "@/features/api/contractManagement.query";
import { useCreateInvoice } from "@/features/api/invoice.query";
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
import { Loader2 } from "lucide-react";
import { NavMenu }  from "@/components/nav-menu";

export default function DynamicForm() {
  const params = useParams();
  const router = useRouter();
  const formType = params.formType as FormType;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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

  const handleFormSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Format date fields to ISO strings
      const formattedData = formatFormData(data, formFields);
      
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
    
    return formattedData;
  };

  // Form submission handlers for each form type
  const submitIdentificationForm = async (data: Record<string, any>) => {
    // Cast the data to the expected type
    const identificationData = data as unknown as NewItemIdentification;
    const result = await createIdentification.mutateAsync(identificationData);
    setSuccess("Identification form submitted successfully!");
    // router.push(`/view/identification/${result.id}`);
    router.push(`/list`);
  };

  const submitPlanningForm = async (data: Record<string, any>) => {
    // Cast the data to the expected type
    const planningData = data as unknown as NewPlanning;
    const result = await createPlanning.mutateAsync(planningData);
    setSuccess("Planning form submitted successfully!");
    router.push(`/list`);
  };

  const submitPublicationForm = async (data: Record<string, any>) => {
    // Cast the data to the expected type
    const publicationData = data as unknown as NewPublication;
    const result = await createPublication.mutateAsync(publicationData);
    setSuccess("Publication form submitted successfully!");
    router.push(`/list`);
  };

  const submitPublicationTenderForm = async (data: Record<string, any>) => {
    // Cast the data to the expected type
    const publicationTenderData = data as unknown as NewPublicationTender;
    const result = await createPublicationTender.mutateAsync(publicationTenderData);
    setSuccess("Publication tender form submitted successfully!");
    router.push(`/list`);
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
      router.push(`/list`);
    } catch (error) {
      console.error("Error submitting open bid form:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      throw error; // Re-throw to let the form handler handle it
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
      router.push(`/list`);
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
      router.push(`/list`);
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
      router.push(`/list`);
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
      router.push(`/list`);
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
  const formFieldsForComponent = formFields.map(field => ({
    name: field.name,
    title: field.title,
    type: field.type === 'file' ? 'text' : field.type, // Convert 'file' type to 'text' as a workaround
    placeholder: field.placeholder,
    options: field.options,
    required: field.required
  }));

  console.log("formType:: ", formType);
  console.log("formFields:: ", formFields);

  return (
    <>
    <div className="flex flex-col items-center mx-auto max-w-screen-lg min-h-screen">
      <div className="flex justify-center items-center w-full mt-4">
        <NavMenu />
      </div>
      
      
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
      
      <div className="pt-12">
      {formFields.length > 0 ? (
        <>
          <div className="w-full mt-4">
            <h1 className="flex items-start text-xl font-bold mb-4">{formTitle}</h1>
          </div>
          <Form fields={formFieldsForComponent} onSubmit={handleFormSubmit} />
          
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
    </>
  );
} 