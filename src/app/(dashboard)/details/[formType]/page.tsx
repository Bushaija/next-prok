"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { formatDate } from "@/lib/utils"

export default function DetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Get form type and ID from URL params
  const formType = searchParams.get("type") as FormType || "identification"
  const id = searchParams.get("id") ? parseInt(searchParams.get("id") as string, 10) : null
  
  // Fetch data based on form type
  const { 
    data: identification, 
    isLoading: isLoadingIdentification,
    error: identificationError
  } = useIdentification(id || 0)
  
  const deleteIdentification = useDeleteIdentification()
  
  // Redirect if no ID is provided
  useEffect(() => {
    if (!id) {
      router.push("/list")
    }
  }, [id, router])
  
  // Function to get data based on form type
  const getData = () => {
    switch (formType) {
      case "identification":
        return identification
      // Add cases for other form types as they become available
      default:
        return null
    }
  }
  
  // Function to get loading state based on form type
  const isLoading = () => {
    switch (formType) {
      case "identification":
        return isLoadingIdentification
      // Add cases for other form types as they become available
      default:
        return false
    }
  }
  
  // Function to get error state based on form type
  const getError = () => {
    switch (formType) {
      case "identification":
        return identificationError
      // Add cases for other form types as they become available
      default:
        return null
    }
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
          await deleteIdentification.mutateAsync(id as number)
          break
        // Add cases for other form types as they become available
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
  
  // Get the data for the current form type
  const data = getData()
  const error = getError()
  const formTitle = formTitles[formType] || "Details"
  
  // If loading, show skeleton UI
  if (isLoading()) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // If error, show error message
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Button variant="ghost" onClick={() => router.push("/list")} className="mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to List
        </Button>
        
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading {formTitle}</CardTitle>
            <CardDescription className="text-red-700">
              There was a problem loading the requested item.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error.message}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/list")}>
              Return to List
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // If no data, show not found message
  if (!data) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Button variant="ghost" onClick={() => router.push("/list")} className="mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to List
        </Button>
        
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Item Not Found</CardTitle>
            <CardDescription>
              The requested {formTitle.toLowerCase()} could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>The item may have been deleted or you may have followed an invalid link.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/list")}>
              Return to List
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  // Render identification details
  if (formType === "identification") {
    return (
      <div className="container mx-auto py-10 px-4">
        <Button variant="ghost" onClick={() => router.push("/list")} className="mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to List
        </Button>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{data.tenderTitle}</CardTitle>
              <CardDescription>
                {formTitle} #{data.id} - Created on {formatDate(data.createdAt)}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(data.status)}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  Division
                </span>
                <span className="font-medium">{data.division}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Financial Year
                </span>
                <span className="font-medium">{data.financialYear}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Manager Email
                </span>
                <span className="font-medium">{data.managerEmail}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Division Manager Phone
                </span>
                <span className="font-medium">{data.divisionManagerPhone}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Contract Manager Phone
                </span>
                <span className="font-medium">{data.contractManagerPhone}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Category
                </span>
                <span className="font-medium">{data.category}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Budget
                </span>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(data.budget)}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Estimated Amount
                </span>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(data.estimatedAmount)}
                </span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Timeline for Delivery
                </span>
                <span className="font-medium">{formatDate(data.timelineForDelivery)}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Quantity
                </span>
                <span className="font-medium">{data.quantity}</span>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-gray-500 flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Technical Specification
                </span>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">{data.technicalSpecification}</p>
                </div>
              </div>
              
              {data.marketSurveyReport && (
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-500 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Market Survey Report
                  </span>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="whitespace-pre-wrap">{data.marketSurveyReport}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
        
        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">
                Are you sure you want to delete this {formTitle.toLowerCase()}? This action cannot be undone.
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
                  disabled={deleteIdentification.isLoading}
                >
                  {deleteIdentification.isLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // Default fallback for other form types (to be implemented)
  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" onClick={() => router.push("/list")} className="mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to List
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Details for {formTitle}</CardTitle>
          <CardDescription>
            Support for this form type is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>The details view for {formTitle} is not yet implemented.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.push("/list")}>
            Return to List
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
