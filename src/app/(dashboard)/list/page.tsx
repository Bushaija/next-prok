"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Edit, Trash, ChevronDown, Plus, Download } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FormType, formTitles } from "@/constants/form-data-object"
import { useIdentifications, useDeleteIdentification } from "@/features/api/identification.query"
import { usePlannings, useDeletePlanning } from "@/features/api/planning.query"
import { usePublications, useDeletePublication } from "@/features/api/publication.query"
import { usePublicationTenders, useDeletePublicationTender } from "@/features/api/publicationTender.query"
import { useOpenBids, useDeleteOpenBid } from "@/features/api/openBid.query"
import { useBidEvaluations, useDeleteBidEvaluation } from "@/features/api/bidEvaluation.query"
import { useContractSignings, useDeleteContractSigning } from "@/features/api/contractSigning.query"
import { useContractManagements, useDeleteContractManagement } from "@/features/api/contractManagement.query"
import { useInvoices, useDeleteInvoice } from "@/features/api/invoice.query"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ItemIdentification, 
  Planning, 
  Publication, 
  PublicationTender,
  OpeningBid,
  BidEvaluation,
  ContractSigning,
  ContractManagement,
  Invoice
} from "@/db/schema"
import { formatDate } from "@/lib/utils"
import { NavMenu } from "@/components/nav-menu"

// Define a type for all possible form data
type FormData = ItemIdentification | Planning | Publication | PublicationTender | OpeningBid | BidEvaluation | ContractSigning | ContractManagement | Invoice

// Add form descriptions for each form type
const formDescriptions: Record<FormType, string> = {
  identification: "Manage tender identification information including divisions, budgets, and specifications.",
  planning: "Track and manage tender planning details, schedules, and status updates.",
  publication: "Oversee initial and quarterly procurement plan publications and revisions.",
  publicationTender: "Handle tender publication details including announcements and approvals.",
  openBid: "Manage bid opening processes, participants, and documentation.",
  bidEvaluation: "Track bid evaluations, validity periods, and contract negotiation details.",
  contractSigning: "Monitor contract signing processes, guarantees, and approvals.",
  contractManagement: "Oversee contract execution, inspections, and warranty management.",
  invoice: "Track invoice submissions, approvals, and payment processing.",
};

// Loading component
function ListPageLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

// The client-side content component that uses search params
function ListPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formTypeParam = searchParams.get('formType') as FormType | null;
  
  const [formType, setFormType] = useState<FormType>(formTypeParam || "identification");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Update URL when form type changes
  useEffect(() => {
    // Update the URL with the current form type without full page navigation
    const url = new URL(window.location.href);
    url.searchParams.set('formType', formType);
    router.push(url.pathname + url.search, { scroll: false });
  }, [formType, router]);
  
  // Fetch data based on form type
  const { data: identifications, isLoading: isLoadingIdentifications } = useIdentifications();
  const { data: plannings, isLoading: isLoadingPlannings } = usePlannings();
  const { data: publications, isLoading: isLoadingPublications } = usePublications();
  const { data: publicationTenders, isLoading: isLoadingPublicationTenders } = usePublicationTenders();
  const { data: openBids, isLoading: isLoadingOpenBids } = useOpenBids();
  const { data: bidEvaluations, isLoading: isLoadingBidEvaluations } = useBidEvaluations();
  const { data: contractSignings, isLoading: isLoadingContractSignings } = useContractSignings();
  const { data: contractManagements, isLoading: isLoadingContractManagements } = useContractManagements();
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices();
  
  // Delete mutations
  const deleteIdentification = useDeleteIdentification();
  const deletePlanning = useDeletePlanning();
  const deletePublication = useDeletePublication();
  const deletePublicationTender = useDeletePublicationTender();
  const deleteOpenBid = useDeleteOpenBid();
  const deleteBidEvaluation = useDeleteBidEvaluation();
  const deleteContractSigning = useDeleteContractSigning();
  const deleteContractManagement = useDeleteContractManagement();
  const deleteInvoice = useDeleteInvoice();
  
  // Function to get data based on form type
  const getFormData = (): FormData[] => {
    switch (formType) {
      case "identification":
        return identifications || [];
      case "planning":
        return plannings || [];
      case "publication":
        return publications || [];
      case "publicationTender":
        return publicationTenders || [];
      case "openBid":
        return openBids || [];
      case "bidEvaluation":
        return bidEvaluations || [];
      case "contractSigning":
        return contractSignings || [];
      case "contractManagement":
        return contractManagements || [];
      case "invoice":
        return invoices || [];
      default:
        return [];
    }
  };
  
  // Function to get loading state based on form type
  const isLoading = (): boolean => {
    switch (formType) {
      case "identification":
        return isLoadingIdentifications;
      case "planning":
        return isLoadingPlannings;
      case "publication":
        return isLoadingPublications;
      case "publicationTender":
        return isLoadingPublicationTenders;
      case "openBid":
        return isLoadingOpenBids;
      case "bidEvaluation":
        return isLoadingBidEvaluations;
      case "contractSigning":
        return isLoadingContractSignings;
      case "contractManagement":
        return isLoadingContractManagements;
      case "invoice":
        return isLoadingInvoices;
      default:
        return false;
    }
  };
  
  // Function to handle view action
  const handleView = (id: number) => {
    router.push(`/details/${formType}/${id}`);
  };
  
  // Function to handle edit action
  const handleEdit = (id: number) => {
    router.push(`/edit/${formType}/${id}`);
  };
  
  // Function to open delete confirmation
  const openDeleteConfirm = (id: number) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;
    
    try {
      switch (formType) {
        case "identification":
          await deleteIdentification.mutateAsync(itemToDelete);
          break;
        case "planning":
          await deletePlanning.mutateAsync(itemToDelete);
          break;
        case "publication":
          await deletePublication.mutateAsync(itemToDelete);
          break;
        case "publicationTender":
          await deletePublicationTender.mutateAsync(itemToDelete);
          break;
        case "openBid":
          await deleteOpenBid.mutateAsync(itemToDelete);
          break;
        case "bidEvaluation":
          await deleteBidEvaluation.mutateAsync(itemToDelete);
          break;
        case "contractSigning":
          await deleteContractSigning.mutateAsync(itemToDelete);
          break;
        case "contractManagement":
          await deleteContractManagement.mutateAsync(itemToDelete);
          break;
        case "invoice":
          await deleteInvoice.mutateAsync(itemToDelete);
          break;
        default:
          console.error(`Delete not implemented for form type: ${formType}`);
      }
    } catch (error) {
      console.error(`Error deleting ${formType}:`, error);
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };
  
  // Define columns for each form type
  const identificationColumns: ColumnDef<ItemIdentification>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "division",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Division
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => {
        const budget = parseFloat(row.getValue("budget"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(budget)
        return formatted
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
            ${status === "Approved" ? "bg-green-100 text-green-800" : 
              status === "Rejected" ? "bg-red-100 text-red-800" : 
              "bg-yellow-100 text-yellow-800"}`}>
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const planningColumns: ColumnDef<Planning>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "estimatedBudget",
      header: "Estimated Budget",
      cell: ({ row }) => {
        const budget = parseFloat(row.getValue("estimatedBudget"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(budget)
        return formatted
      },
    },
    {
      accessorKey: "planningStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("planningStatus") as string
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
            ${status === "Approved" ? "bg-green-100 text-green-800" : 
              status === "Rejected" ? "bg-red-100 text-red-800" : 
              "bg-yellow-100 text-yellow-800"}`}>
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const publicationColumns: ColumnDef<Publication>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "revision",
      header: "Revision",
    },
    {
      accessorKey: "initialProcurementPlanPublication",
      header: "Initial Publication",
      cell: ({ row }) => {
        return formatDate(row.getValue("initialProcurementPlanPublication"))
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const publicationTenderColumns: ColumnDef<PublicationTender>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "dateOfTenderPublication",
      header: "Publication Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("dateOfTenderPublication"))
      },
    },
    {
      accessorKey: "dateOfCBMApproval",
      header: "CBM Approval",
      cell: ({ row }) => {
        return formatDate(row.getValue("dateOfCBMApproval"))
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  // Define columns for open bids
  const openBidColumns: ColumnDef<OpeningBid>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "bidOpeningDate",
      header: "Bid Opening Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("bidOpeningDate"))
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
  
  // Define columns for bid evaluations
  const bidEvaluationColumns: ColumnDef<BidEvaluation>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "bidEvaluationDate",
      header: "Evaluation Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("bidEvaluationDate"))
      },
    },
    {
      accessorKey: "contractAmount",
      header: "Contract Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("contractAmount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return formatted
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
            ${status === "Approved" ? "bg-green-100 text-green-800" : 
              status === "Rejected" ? "bg-red-100 text-red-800" : 
              "bg-yellow-100 text-yellow-800"}`}>
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  // Define columns for contract signings
  const contractSigningColumns: ColumnDef<ContractSigning>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "contractorBidderNames",
      header: "Contractor",
    },
    {
      accessorKey: "contractStartDate",
      header: "Contract Start Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("contractStartDate"))
      },
    },
    {
      accessorKey: "contractEndDate",
      header: "Contract End Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("contractEndDate"))
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
            ${status === "Approved" ? "bg-green-100 text-green-800" : 
              status === "Rejected" ? "bg-red-100 text-red-800" : 
              "bg-yellow-100 text-yellow-800"}`}>
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  // Define columns for contract managements
  const contractManagementColumns: ColumnDef<ContractManagement>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "procurementStaff",
      header: "Procurement Staff",
    },
    {
      accessorKey: "tenderExecutionStartDate",
      header: "Execution Start Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("tenderExecutionStartDate"))
      },
    },
    {
      accessorKey: "tenderExecutionEndDate",
      header: "Execution End Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("tenderExecutionEndDate"))
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
            ${status === "Approved" ? "bg-green-100 text-green-800" : 
              status === "Rejected" ? "bg-red-100 text-red-800" : 
              "bg-yellow-100 text-yellow-800"}`}>
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  // Define columns for invoices
  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "tenderTitle",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tender Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "invoiceSubmissionDate",
      header: "Submission Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("invoiceSubmissionDate"))
      },
    },
    {
      accessorKey: "dateOfInvoicePayment",
      header: "Payment Date",
      cell: ({ row }) => {
        return formatDate(row.getValue("dateOfInvoicePayment"))
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
            ${status === "Paid" ? "bg-green-100 text-green-800" : 
              status === "Rejected" ? "bg-red-100 text-red-800" : 
              "bg-yellow-100 text-yellow-800"}`}>
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDate(row.getValue("createdAt"))
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
  
  // Function to get columns based on form type
  const getColumns = (): ColumnDef<any, unknown>[] => {
    switch (formType) {
      case "identification":
        return identificationColumns;
      case "planning":
        return planningColumns;
      case "publication":
        return publicationColumns;
      case "publicationTender":
        return publicationTenderColumns;
      case "openBid":
        return openBidColumns;
      case "bidEvaluation":
        return bidEvaluationColumns;
      case "contractSigning":
        return contractSigningColumns;
      case "contractManagement":
        return contractManagementColumns;
      case "invoice":
        return invoiceColumns;
      default:
        return [];
    }
  };
  
  // Delete confirmation dialog
  const deleteLoadingState = (): boolean => {
    switch (formType) {
      case "identification":
        return deleteIdentification.isLoading;
      case "planning":
        return deletePlanning.isLoading;
      case "publication":
        return deletePublication.isLoading;
      case "publicationTender":
        return deletePublicationTender.isLoading;
      case "openBid":
        return deleteOpenBid.isLoading;
      case "bidEvaluation":
        return deleteBidEvaluation.isLoading;
      case "contractSigning":
        return deleteContractSigning.isLoading;
      case "contractManagement":
        return deleteContractManagement.isLoading;
      case "invoice":
        return deleteInvoice.isLoading;
      default:
        return false;
    }
  };
  
  // Export to CSV function
  const exportToCSV = () => {
    const data = getFormData();
    const columns = getColumns();
    
    // Extract headers from columns (excluding actions column)
    const headers = columns
      .filter(col => col.id !== 'actions')
      .map(col => {
        // Use header if it's a string, otherwise use id as fallback
        if (typeof col.header === 'string') {
          return col.header;
        }
        
        // For object headers (like those with sorting buttons)
        // Use id as the fallback
        return col.id || '';
      });
    
    // Create CSV rows from data
    const rows = data.map(item => {
      return columns
        .filter(col => col.id !== 'actions')
        .map(col => {
          // Get the key to access the value (using id as a fallback)
          const accessKey = col.id || '';
            
          if (!accessKey) return '';
          
          // Extract value using the accessor
          let value: any;
          
          if (accessKey.includes('.')) {
            // Handle nested properties
            const keys = accessKey.split('.');
            let currentObj: any = item;
            
            for (const k of keys) {
              if (currentObj && typeof currentObj === 'object') {
                currentObj = currentObj[k];
              } else {
                currentObj = undefined;
                break;
              }
            }
            
            value = currentObj;
          } else {
            // Handle direct properties
            value = (item as any)[accessKey];
          }
          
          // Format dates and special values
          if (value instanceof Date) {
            value = formatDate(value);
          } else if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value);
          } else if (value === undefined || value === null) {
            value = '';
          }
          
          // Ensure value is a string and handle quotes for CSV
          return typeof value === 'string' 
            ? `"${value.replace(/"/g, '""')}"` 
            : String(value);
        })
        .join(',');
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows
    ].join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${formType}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">{formTitles[formType]} List</h1>
        <p className="text-muted-foreground mt-1 text-blue-600">{formDescriptions[formType]}</p>
      </div>
      
      {isLoading() ? (
        <ListPageLoading />
      ) : (
        <DataTable<any, unknown>
          columns={getColumns()}
          data={getFormData()}
          searchKey="tenderTitle"
          searchPlaceholder="Search by tender title..."
          searchValue={searchTerm}
          pageSize={10}
          topContent={
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search by tender title..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-[300px]"
                />
                <Select
                  value={formType}
                  onValueChange={(value) => setFormType(value as FormType)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select form type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identification">Identification</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="publication">Publication</SelectItem>
                    <SelectItem value="publicationTender">Publication Tender</SelectItem>
                    <SelectItem value="openBid">Opening Bids</SelectItem>
                    <SelectItem value="bidEvaluation">Bid Evaluation</SelectItem>
                    <SelectItem value="contractSigning">Contract Signing</SelectItem>
                    <SelectItem value="contractManagement">Contract Management</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4 bg-blue-600 text-white rounded-full" /> Create New <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/new/identification`)}>
                      Identification
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/new/planning`)}>
                      Planning
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/new/publication`)}>
                      Publication
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/new/publicationTender`)}>
                      Publication Tender
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/new/openBid`)}>
                      Opening Bids
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/new/bidEvaluation`)}>
                      Bid Evaluation
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/new/contractSigning`)}>
                      Contract Signing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/new/contractManagement`)}>
                      Contract Management
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/new/invoice`)}>
                      Invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          }
        />
      )}
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={deleteLoadingState()}
              >
                {deleteLoadingState() ? "Deleting..." : "Delete"}
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main ListPage component that uses Suspense
export default function ListPage() {
  return (
    <section className="max-w-screen-2xl p-12 mx-auto w-full pb-10 -mt-24 border-2 bg-white rounded-xl">
      <Suspense fallback={<ListPageLoading />}>
        <ListPageContent />
      </Suspense>
    </section>
  );
}
