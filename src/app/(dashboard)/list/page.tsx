"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Edit, Trash } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { FormType, formTitles } from "@/constants/form-data-object"
import { useIdentifications, useDeleteIdentification } from "@/features/api/identification.query"
import { usePlannings, useDeletePlanning } from "@/features/api/planning.query"
import { usePublications, useDeletePublication } from "@/features/api/publication.query"
import { usePublicationTenders, useDeletePublicationTender } from "@/features/api/publicationTender.query"
import { 
  ItemIdentification, 
  Planning, 
  Publication, 
  PublicationTender 
} from "@/db/schema"
import { formatDate } from "@/lib/utils"

// Define a type for all possible form data
type FormData = ItemIdentification | Planning | Publication | PublicationTender

export default function ListPage() {
  const router = useRouter()
  const [formType, setFormType] = useState<FormType>("identification")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  
  // Fetch data based on form type
  const { data: identifications, isLoading: isLoadingIdentifications } = useIdentifications()
  const { data: plannings, isLoading: isLoadingPlannings } = usePlannings()
  const { data: publications, isLoading: isLoadingPublications } = usePublications()
  const { data: publicationTenders, isLoading: isLoadingPublicationTenders } = usePublicationTenders()
  
  // Delete mutations
  const deleteIdentification = useDeleteIdentification()
  const deletePlanning = useDeletePlanning()
  const deletePublication = useDeletePublication()
  const deletePublicationTender = useDeletePublicationTender()
  
  // Function to get data based on form type
  const getFormData = (): FormData[] => {
    switch (formType) {
      case "identification":
        return identifications || []
      case "planning":
        return plannings || []
      case "publication":
        return publications || []
      case "publicationTender":
        return publicationTenders || []
      default:
        return []
    }
  }
  
  // Function to get loading state based on form type
  const isLoading = (): boolean => {
    switch (formType) {
      case "identification":
        return isLoadingIdentifications
      case "planning":
        return isLoadingPlannings
      case "publication":
        return isLoadingPublications
      case "publicationTender":
        return isLoadingPublicationTenders
      default:
        return false
    }
  }
  
  // Function to handle view action
  const handleView = (id: number) => {
    router.push(`/details/${formType}/${id}`)
  }
  
  // Function to handle edit action
  const handleEdit = (id: number) => {
    router.push(`#/edit/${formType}/${id}`)
  }
  
  // Function to open delete confirmation
  const openDeleteConfirm = (id: number) => {
    setItemToDelete(id)
    setShowDeleteConfirm(true)
  }
  
  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return
    
    try {
      switch (formType) {
        case "identification":
          await deleteIdentification.mutateAsync(itemToDelete)
          break
        case "planning":
          await deletePlanning.mutateAsync(itemToDelete)
          break
        case "publication":
          await deletePublication.mutateAsync(itemToDelete)
          break
        case "publicationTender":
          await deletePublicationTender.mutateAsync(itemToDelete)
          break
        default:
          console.error(`Delete not implemented for form type: ${formType}`)
      }
    } catch (error) {
      console.error(`Error deleting ${formType}:`, error)
    } finally {
      setShowDeleteConfirm(false)
      setItemToDelete(null)
    }
  }
  
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
  
  // Function to get columns based on form type
  const getColumns = (): ColumnDef<any, unknown>[] => {
    switch (formType) {
      case "identification":
        return identificationColumns
      case "planning":
        return planningColumns
      case "publication":
        return publicationColumns
      case "publicationTender":
        return publicationTenderColumns
      default:
        return []
    }
  }
  
  return (
    <div className="container mx-auto py-10 mx-auto max-w-screen-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Forms List</h1>
        <div className="flex items-center space-x-4">
          <Select
            value={formType}
            onValueChange={(value) => setFormType(value as FormType)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select form type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(formTitles).map(([key, title]) => (
                <SelectItem key={key} value={key}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => router.push(`/new/${formType}`)}>
            Create New
          </Button>
        </div>
      </div>
      
      {isLoading() ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable<any, unknown>
          columns={getColumns()}
          data={getFormData()}
          searchKey="tenderTitle"
          searchPlaceholder="Search by tender title..."
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
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={deleteIdentification.isLoading || deletePlanning.isLoading || 
                         deletePublication.isLoading || deletePublicationTender.isLoading}
              >
                {deleteIdentification.isLoading || deletePlanning.isLoading || 
                 deletePublication.isLoading || deletePublicationTender.isLoading 
                 ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
