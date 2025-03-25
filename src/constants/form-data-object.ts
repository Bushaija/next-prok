export interface FormField {
  name: string;
  title: string;
  type: "text" | "number" | "email" | "password" | "select" | "checkbox" | "tel" | "date" | "textarea" | "file";
  placeholder?: string;
  options?: string[]; // For select dropdowns
  required?: boolean;
};

export interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
};
// procurementDivision
export const IdentificationFormFields: FormField[] = [
  {
    name: "procurementDivision",
    title: "Procurement Division",
    type: "text",
    placeholder: "Enter procurement division",
    options: ["Pending", "Approved", "Rejected"],
    required: true,
  },
  {
    name: "division",
    title: "Division",
    type: "text",
    placeholder: "Enter division name",
    required: true,
  },
  {
    name: "financialYear",
    title: "Financial Year",
    type: "number",
    placeholder: "Enter financial year (e.g., 2024)",
    required: true,
  },
  {
    name: "managerEmail",
    title: "Manager Email",
    type: "email",
    placeholder: "Enter manager's email",
    required: true,
  },
  {
    name: "divisionManagerPhone",
    title: "Division Manager Phone Number",
    type: "tel",
    placeholder: "Enter division manager's phone number",
    required: true,
  },
  {
    name: "contractManagerPhone",
    title: "Contract Manager Phone Number",
    type: "tel",
    placeholder: "Enter contract manager's phone number",
    required: true,
  },
  {
    name: "tenderTitle",
    title: "Tender Title Name",
    type: "text",
    placeholder: "Enter tender title",
    required: true,
  },
  {
    name: "category",
    title: "Category",
    type: "text",
    placeholder: "Enter category",
    required: true,
  },
  {
    name: "quantity",
    title: "Quantity",
    type: "number",
    placeholder: "Enter quantity (in units)",
    required: true,
  },
  {
    name: "budget",
    title: "Budget",
    type: "number",
    placeholder: "Enter budget amount in USD",
    required: true,
  },
  {
    name: "estimatedAmount",
    title: "Estimated Amount",
    type: "number",
    placeholder: "Enter estimated amount in USD",
    required: true,
  },
  {
    name: "technicalSpecification",
    title: "Technical Specification",
    type: "textarea",
    placeholder: "Provide technical specifications",
    required: true,
  },
  {
    name: "marketSurveyReport",
    title: "Market Survey Report",
    type: "file",
    placeholder: "Provide market survey report",
    required: false,
  },
  {
    name: "timelineForDelivery",
    title: "Timeline for Delivery",
    type: "date",
    placeholder: "Select delivery timeline",
    required: true,
  },
  {
    name: "status",
    title: "Status",
    type: "select",
    options: ["Pending", "Approved", "Rejected"],
    placeholder: "Select status",
    required: true,
  },
];


  export const planningFormFields = [
    {
      name: "tenderTitle",
      title: "Tender Title",
      type: "text",
      placeholder: "Enter tender title",
      required: true,
    },
    {
      name: "tenderFinalGivenTitle",
      title: "Tender Final Given Title",
      type: "text",
      placeholder: "Enter final tender title",
      required: true,
    },
    {
      name: "tenderMethods",
      title: "Tender Methods",
      type: "text",
      placeholder: "Enter tender methods",
      required: true,
    },
    {
      name: "estimatedBudget",
      title: "Estimated Budget",
      type: "number",
      placeholder: "Enter estimated budget",
      required: true,
    },
    {
      name: "tenderType",
      title: "New or Ongoing Tender",
      type: "select",
      options: ["New", "Ongoing"],
      placeholder: "Select tender type",
      required: true,
    },
    {
      name: "frameworkType",
      title: "Multi-Year or Regular Framework",
      type: "select",
      options: ["Multi-Year", "Regular Framework"],
      placeholder: "Select framework type",
      required: true,
    },
    {
      name: "plannedTenderDocumentPreparation",
      title: "Planned Tender Document Preparation",
      type: "date",
      placeholder: "Select document preparation date",
      required: true,
    },
    {
      name: "plannedPublicationDate",
      title: "Planned Publication Date",
      type: "date",
      placeholder: "Select publication date",
      required: true,
    },
    {
      name: "plannedBidOpeningDate",
      title: "Planned Bid Opening Date",
      type: "date",
      placeholder: "Select bid opening date",
      required: true,
    },
    {
      name: "plannedEvaluationDate",
      title: "Planned Evaluation Date",
      type: "date",
      placeholder: "Select evaluation date",
      required: true,
    },
    {
      name: "plannedNotificationDate",
      title: "Planned Notification Date",
      type: "date",
      placeholder: "Select notification date",
      required: true,
    },
    {
      name: "plannedContractClosureDate",
      title: "Planned Contract Closure Date",
      type: "date",
      placeholder: "Select contract closure date",
      required: true,
    },
    {
      name: "planningStatus",
      title: "Planning Status",
      type: "select",
      options: ["Draft", "Pending Approval", "Approved"],
      placeholder: "Select planning status",
      required: true,
    },
  ];

  export const publicationFormFields = [
    {
      name: "tenderTitle",
      title: "Tender Title",
      type: "text",
      placeholder: "Enter tender title",
      isConstant: false, // Set to true if this should be non-editable
      required: true,
    },
    {
      name: "initialProcurementPlanPublication",
      title: "Date of Initial Procurement Plan Publication",
      type: "date",
      placeholder: "Select initial publication date",
      required: true,
    },
    {
      name: "quarterIIProcurementPlanPublication",
      title: "Date of Quarter II Procurement Plan Publication",
      type: "date",
      placeholder: "Select Q2 publication date",
      required: true,
    },
    {
      name: "quarterIIIProcurementPlanPublication",
      title: "Date of Quarter III Procurement Plan Publication",
      type: "date",
      placeholder: "Select Q3 publication date",
      required: true,
    },
    {
      name: "revision",
      title: "Revision",
      type: "textarea",
      placeholder: "Enter revision details",
      required: true,
    },
    {
      name: "tatPublication",
      title: "TAT Publication",
      type: "number",
      placeholder: "Enter TAT publication value",
      required: true,
    },
  ];

  export const publicationTenderFormFields = [
    {
      name: "tenderTitle",
      title: "Tender Title",
      type: "text",
      placeholder: "Enter tender title",
      isConstant: false, // Set to true if this should be non-editable
      required: false,
    },
    {
      name: "dateOfPreparationOfTenderDocument",
      title: "Date of Preparation of Tender Document",
      type: "date",
      placeholder: "Select preparation date",
      required: true,
    },
    {
      name: "dateOfSubmissionOfTheDocumentCommitteeForApproval",
      title: "Date of Submission of the Document Committee for Approval",
      type: "date",
      placeholder: "Select submission date",
      required: true,
    },
    {
      name: "dateOfCBMApproval",
      title: "Date of CBM Approval",
      type: "date",
      placeholder: "Select CBM approval date",
      required: true,
    },
    {
      name: "dateOfTenderPublication",
      title: "Date of Tender Publication",
      type: "date",
      placeholder: "Select tender publication date",
      required: true,
    },
  ];
  
  export const openingBidsFormFields = [
    {
      name: "tenderTitle",
      title: "Tender Title",
      type: "text",
      placeholder: "Enter tender title",
      isConstant: false, // Set to true if this should be non-editable
      required: false,
    },
    {
      name: "bidOpeningDate",
      title: "Date of Opening Bids",
      type: "date",
      placeholder: "Select bid opening date",
      required: true,
    },
    {
      name: "publicationTenderId",
      title: "Publication Tender ID",
      type: "number",
      placeholder: "Enter publication tender ID",
      required: false,
    }
  ];

  export const bidEvaluationFormFields = [
    {
      name: "tenderTitle",
      title: "Tender Title",
      type: "text",
      placeholder: "Enter tender title",
      isConstant: false, // Set to true if this should be non-editable
      required: false,
    },
    {
      name: "bidEvaluationDate",
      title: "Bid Evaluation Date",
      type: "date",
      placeholder: "Select bid evaluation date",
      required: true,
    },
    {
      name: "bidValidityStartingDate",
      title: "Bid Validity Starting Date",
      type: "date",
      placeholder: "Select bid validity start date",
      required: true,
    },
    {
      name: "bidValidityEndingDate",
      title: "Bid Validity Ending Date",
      type: "date",
      placeholder: "Select bid validity end date",
      required: true,
    },
    {
      name: "notificationDate",
      title: "Notification Date",
      type: "date",
      placeholder: "Select notification date",
      required: true,
    },
    {
      name: "contractNegotiationDate",
      title: "Contract Negotiation Date",
      type: "date",
      placeholder: "Select contract negotiation date",
      required: true,
    },
    {
      name: "contractAmount",
      title: "Contract Amount",
      type: "number",
      placeholder: "Enter contract amount",
      required: true,
    },
  ];

  export const contractSigningFormFields = [
    {
      name: "tenderTitle",
      title: "Tender Title",
      type: "text",
      placeholder: "Enter tender title",
      isConstant: false, // Set to true if this should be non-editable
      required: false,
    },
    {
      name: "draftOfTheContractDate",
      title: "Draft of the Contract Date",
      type: "date",
      placeholder: "Select contract draft date",
      required: true,
    },
    {
      name: "reviewAndApprovalByTheLegalDate",
      title: "Review and Approval by the Legal Date",
      type: "date",
      placeholder: "Select legal review date",
      required: true,
    },
    {
      name: "contractorBidderApprovalDate",
      title: "Contractor/Bidder Approval Date",
      type: "date",
      placeholder: "Select contractor approval date",
      required: true,
    },
    {
      name: "contractorBidderNames",
      title: "Contractor/Bidder Names",
      type: "text",
      placeholder: "Enter contractor/bidder names",
      required: true,
    },
    {
      name: "contractorBidderEmail",
      title: "Contractor/Bidder Email",
      type: "email",
      placeholder: "Enter contractor/bidder email",
      required: true,
    },
    {
      name: "contractorBidderPhoneNumber",
      title: "Contractor/Bidder Phone Number",
      type: "tel",
      placeholder: "Enter contractor/bidder phone number",
      required: true,
    },
    {
      name: "performanceGuaranteeValidityStartDate",
      title: "Performance Guarantee Validity Start Date",
      type: "date",
      placeholder: "Select performance guarantee start date",
      required: true,
    },
    {
      name: "performanceGuaranteeValidityEndDate",
      title: "Performance Guarantee Validity Ending Date",
      type: "date",
      placeholder: "Select performance guarantee end date",
      required: true,
    },
    {
      name: "submissionOfPerformanceGuaranteeDate",
      title: "Submission of Performance Guarantee Date",
      type: "date",
      placeholder: "Select submission date",
      required: true,
    },
    {
      name: "approvalOfContractByTheMOJDate",
      title: "Approval of Contract by the MOJ Date",
      type: "date",
      placeholder: "Select MOJ approval date",
      required: true,
    },
    {
      name: "approvalOfTheCBMDate",
      title: "Approval of the CBM Date",
      type: "date",
      placeholder: "Select CBM approval date",
      required: true,
    },
    {
      name: "contractStartDate",
      title: "Contract Start Date",
      type: "date",
      placeholder: "Select contract start date",
      required: true,
    },
    {
      name: "contractEndDate",
      title: "Contract End Date",
      type: "date",
      placeholder: "Select contract end date",
      required: true,
    },
  ];

  export const contractManagementFormFields = [
    {
      name: "tenderTitle",
      title: "Tender Title",
      type: "text",
      placeholder: "Enter tender title",
      isConstant: false, // Set to true if this should be non-editable
      required: false,
    },
    {
      name: "dateOfPurchaseOrderIssue",
      title: "Date of Purchase Order Issue",
      type: "date",
      placeholder: "Select purchase order issue date",
      required: true,
    },
    {
      name: "divisionIssuingAPurchaseOrder",
      title: "Division Issuing a Purchase Order",
      type: "text",
      placeholder: "Enter division name",
      required: true,
    },
    {
      name: "focalPerformanceFromTheProgram",
      title: "Focal Performance from the Program",
      type: "text",
      placeholder: "Enter focal performance details",
      required: true,
    },
    {
      name: "procurementStaff",
      title: "Procurement Staff",
      type: "text",
      placeholder: "Enter procurement staff name",
      required: true,
    },
    {
      name: "performanceGuaranteeEndPeriod",
      title: "Performance Guarantee End Period",
      type: "date",
      placeholder: "Select performance guarantee end date",
      required: true,
    },
    {
      name: "tenderExecutionStartDate",
      title: "Tender Execution Start Date",
      type: "date",
      placeholder: "Select tender execution start date",
      required: true,
    },
    {
      name: "tenderExecutionEndDate",
      title: "Tender Execution End Date",
      type: "date",
      placeholder: "Select tender execution end date",
      required: true,
    },
    {
      name: "inspectionDoneBy",
      title: "Inspection Done By",
      type: "text",
      placeholder: "Enter inspector's name",
      required: true,
    },
    {
      name: "inspectionList",
      title: "Inspection List",
      type: "select",
      options: ["Logic", "Acceptance Team"],
      placeholder: "Select inspection list type",
      required: true,
    },
    {
      name: "deliveryDate",
      type: "date",
      placeholder: "Select delivery date",
      required: true,
    },
    {
      name: "acceptanceDate",
      title: "Acceptance Date",
      type: "date",
      placeholder: "Select acceptance date",
      required: true,
    },
    {
      name: "warrantyLiabilityStartDate",
      title: "Warranty/Liability Start Date",
      type: "date",
      placeholder: "Select warranty start date",
      required: true,
    },
    {
      name: "warrantyLiabilityEndDate",
      title: "Warranty/Liability End Date",
      type: "date",
      placeholder: "Select warranty end date",
      required: true,
    },
  ];

  export const invoiceFormFields = [
    {
      name: "tenderTitle",
      title: "Tender Title",
      type: "text",
      placeholder: "Enter tender title",
      isConstant: false, // Set to true if this should be non-editable
      required: false,
    },
    {
      name: "invoiceSubmissionDate",
      title: "Invoice Submission Date",
      type: "date",
      placeholder: "Select invoice submission date",
      required: true,
    },
    {
      name: "invoiceReceivedByTheFinanceOfficeDate",
      title: "Invoice Received by the Finance Office Date",
      type: "date",
      placeholder: "Select date finance office received invoice",
      required: true,
    },
    {
      name: "requestedForPaymentDate",
      title: "Requested for Payment Date",
      type: "date",
      placeholder: "Select requested payment date",
      required: true,
    },
    {
      name: "dateOfInvoicePayment",
      title: "Date of Invoice Payment",
      type: "date",
      placeholder: "Select invoice payment date",
      required: true,
    },
  ];

// Form type mapping
export type FormType = "identification" | "planning" | "publication" | "publicationTender" | "openBid" | "bidEvaluation" | "contractSigning" | "contractManagement" | "invoice";

// Form fields by type mapping
export const formFieldsByType: Record<FormType, FormField[]> = {
  identification: IdentificationFormFields,
  planning: planningFormFields as unknown as FormField[],
  publication: publicationFormFields as unknown as FormField[],
  publicationTender: publicationTenderFormFields as unknown as FormField[],
  openBid: openingBidsFormFields as unknown as FormField[],
  
  bidEvaluation: bidEvaluationFormFields as unknown as FormField[],
  contractSigning: contractSigningFormFields as unknown as FormField[],
  contractManagement: contractManagementFormFields as unknown as FormField[],
  invoice: invoiceFormFields as unknown as FormField[],
};

// Form titles mapping
export const formTitles: Record<FormType, string> = {
  identification: "Identification",
  planning: "Planning",
  publication: "Publication",
  publicationTender: "Publication Tender",
  openBid: "Opening Bids",
  bidEvaluation: "Bid Evaluation",
  contractSigning: "Contract Signing",
  contractManagement: "Contract Management",
  invoice: "Invoice",
};
  
  
  
  
  
  
  
  
  
  
  

  

// Function to get form fields by type
export const getFormFieldsByType = (formType: FormType): FormField[] => {
  return formFieldsByType[formType] || [];
};
  
  
  
  
  
  
  
  
  
  
  

  