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
import { NewItemIdentification, NewPlanning, NewPublication, NewPublicationTender } from "@/db/schema";
import { Loader2 } from "lucide-react";

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
        case 'openingBids':
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
    // TODO: Implement opening bids form submission when API is available
    console.log("Opening bids form submitted:", data);
    setSuccess("Opening bids form submitted successfully!");
  };

  const submitBidEvaluationForm = async (data: Record<string, any>) => {
    // TODO: Implement bid evaluation form submission when API is available
    console.log("Bid evaluation form submitted:", data);
    setSuccess("Bid evaluation form submitted successfully!");
  };

  const submitContractSigningForm = async (data: Record<string, any>) => {
    // TODO: Implement contract signing form submission when API is available
    console.log("Contract signing form submitted:", data);
    setSuccess("Contract signing form submitted successfully!");
  };

  const submitContractManagementForm = async (data: Record<string, any>) => {
    // TODO: Implement contract management form submission when API is available
    console.log("Contract management form submitted:", data);
    setSuccess("Contract management form submitted successfully!");
  };

  const submitInvoiceForm = async (data: Record<string, any>) => {
    // TODO: Implement invoice form submission when API is available
    console.log("Invoice form submitted:", data);
    setSuccess("Invoice form submitted successfully!");
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

  return (
    <>
    <div className="flex flex-col items-center mx-auto max-w-screen-lg min-h-screen p-4">
      <div className="flex flex-row justify-between w-full">
        <FormMenu />
      </div>
      <h1 className="text-xl font-bold mb-4 mt-12">{formTitle}</h1>
      
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
      
      {formFields.length > 0 ? (
        <>
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
    </>
  );
} 