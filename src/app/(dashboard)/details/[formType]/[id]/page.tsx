"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  FileText, 
  Clock, 
  Calendar, 
  User, 
  DollarSign, 
  Tag, 
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FormType, formTitles } from "@/constants/form-data-object"
import { useIdentification, useDeleteIdentification } from "@/features/api/identification.query"
import { usePlanning, useDeletePlanning } from "@/features/api/planning.query"
import { usePublication, useDeletePublication } from "@/features/api/publication.query"
import { usePublicationTender, useDeletePublicationTender } from "@/features/api/publicationTender.query"
import { 
  ItemIdentification, 
  Planning, 
  Publication, 
  PublicationTender 
} from "@/db/schema"
import { formatDate } from "@/lib/utils"

export default function DetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const formType = params.formType as FormType
  const id = parseInt(params.id as string)
  
  // Fetch data based on form type
  const { data: identification, isLoading: isLoadingIdentification } = useIdentification(id)
  const { data: planning, isLoading: isLoadingPlanning } = usePlanning(id)
  const { data: publication, isLoading: isLoadingPublication } = usePublication(id)
  const { data: publicationTender, isLoading: isLoadingPublicationTender } = usePublicationTender(id)
  
  const deleteIdentification = useDeleteIdentification()
  const deletePlanning = useDeletePlanning()
  const deletePublication = useDeletePublication()
  const deletePublicationTender = useDeletePublicationTender()
  
  // Get data and loading state based on form type
  const getData = () => {
    switch (formType) {
      case "identification":
        return identification
      case "planning":
        return planning
      case "publication":
        return publication
      case "publicationTender":
        return publicationTender
      default:
        return null
    }
  }
  
  const isLoading = () => {
    switch (formType) {
      case "identification":
        return isLoadingIdentification
      case "planning":
        return isLoadingPlanning
      case "publication":
        return isLoadingPublication
      case "publicationTender":
        return isLoadingPublicationTender
      default:
        return false
    }
  }
  
  const data = getData()
  
  if (isLoading()) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }
  
  if (!data) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Found</h1>
          <p>The requested item could not be found.</p>
        </div>
      </div>
    )
  }
  
  // Function to handle edit action
  const handleEdit = () => {
    router.push(`#/edit/${formType}/${id}`)
  }
  
  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      switch (formType) {
        case "identification":
          await deleteIdentification.mutateAsync(id)
          break
        case "planning":
          await deletePlanning.mutateAsync(id)
          break
        case "publication":
          await deletePublication.mutateAsync(id)
          break
        case "publicationTender":
          await deletePublicationTender.mutateAsync(id)
          break
        default:
          console.error(`Delete not implemented for form type: ${formType}`)
      }
      router.push("/list")
    } catch (error) {
      console.error(`Error deleting ${formType}:`, error)
    } finally {
      setShowDeleteConfirm(false)
    }
  }
  
  // Function to handle export to PDF
  const handleExportPDF = () => {
    console.log(`Export ${formType} with ID: ${id} to PDF`)
    // Implement PDF export functionality
  }
  
  // Function to get status badge based on status value
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }
  
  return (
    <div className="container mx-auto max-w-screen-lg py-10">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {formTitles[formType]} Details
        </h1>
      </div>
      
      <div className="grid gap-6">
        {formType === "identification" && (
          <Card>
            <CardHeader>
              <CardTitle>Identification Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Division</h3>
                  <p>{(data as ItemIdentification).division}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tender Title</h3>
                  <p>{(data as ItemIdentification).tenderTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <p>{(data as ItemIdentification).category}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Budget</h3>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format((data as ItemIdentification).budget)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <Badge variant={
                    (data as ItemIdentification).status === "Approved" ? "default" :
                    (data as ItemIdentification).status === "Rejected" ? "destructive" :
                    "secondary"
                  }>
                    {(data as ItemIdentification).status}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Created At</h3>
                  <p>{formatDate((data as ItemIdentification).createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {formType === "planning" && (
          <Card>
            <CardHeader>
              <CardTitle>Planning Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Tender Title</h3>
                  <p>{(data as Planning).tenderTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Estimated Budget</h3>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format((data as Planning).estimatedBudget)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <Badge variant={
                    (data as Planning).planningStatus === "Approved" ? "default" :
                    (data as Planning).planningStatus === "Rejected" ? "destructive" :
                    "secondary"
                  }>
                    {(data as Planning).planningStatus}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Created At</h3>
                  <p>{formatDate((data as Planning).createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {formType === "publication" && (
          <Card>
            <CardHeader>
              <CardTitle>Publication Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Tender Title</h3>
                  <p>{(data as Publication).tenderTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Revision</h3>
                  <p>{(data as Publication).revision}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Initial Publication Date</h3>
                  <p>{formatDate((data as Publication).initialProcurementPlanPublication)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Created At</h3>
                  <p>{formatDate((data as Publication).createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {formType === "publicationTender" && (
          <Card>
            <CardHeader>
              <CardTitle>Publication Tender Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Tender Title</h3>
                  <p>{(data as PublicationTender).tenderTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Publication Date</h3>
                  <p>{formatDate((data as PublicationTender).dateOfTenderPublication)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">CBM Approval Date</h3>
                  <p>{formatDate((data as PublicationTender).dateOfCBMApproval)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Created At</h3>
                  <p>{formatDate((data as PublicationTender).createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="mt-8">
        <Button variant="outline" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this {formTitles[formType].toLowerCase()}? This action cannot be undone.
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
                disabled={
                  (formType === "identification" && deleteIdentification.isLoading) ||
                  (formType === "planning" && deletePlanning.isLoading) ||
                  (formType === "publication" && deletePublication.isLoading) ||
                  (formType === "publicationTender" && deletePublicationTender.isLoading)
                }
              >
                {(formType === "identification" && deleteIdentification.isLoading) ||
                 (formType === "planning" && deletePlanning.isLoading) ||
                 (formType === "publication" && deletePublication.isLoading) ||
                 (formType === "publicationTender" && deletePublicationTender.isLoading)
                  ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 