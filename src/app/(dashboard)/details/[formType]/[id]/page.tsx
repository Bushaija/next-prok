"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Edit, Trash } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { FormType, formTitles } from "@/constants/form-data-object"
import { useIdentification } from "@/features/api/identification.query"
import { usePlanning } from "@/features/api/planning.query"
import { usePublication } from "@/features/api/publication.query"
import { usePublicationTender } from "@/features/api/publicationTender.query"
import { useOpenBid } from "@/features/api/openBid.query"
import { useBidEvaluation } from "@/features/api/bidEvaluation.query"
import { useContractSigning } from "@/features/api/contractSigning.query"
import { useContractManagement } from "@/features/api/contractManagement.query"
import { useInvoice } from "@/features/api/invoice.query"
import { formatDate, formatCurrency } from "@/lib/utils"

interface DetailsPageProps {
  params: {
    formType: FormType
    id: string
  }
}

export default function DetailsPage({ params }: DetailsPageProps) {
  const unwrappedParams = React.use(params);
  const { formType, id } = unwrappedParams;
  
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch data based on form type
  const { data: identification, isLoading: isLoadingIdentification } = useIdentification(
    formType === "identification" ? parseInt(id) : -1
  )
  const { data: planning, isLoading: isLoadingPlanning } = usePlanning(
    formType === "planning" ? parseInt(id) : -1
  )
  const { data: publication, isLoading: isLoadingPublication } = usePublication(
    formType === "publication" ? parseInt(id) : -1
  )
  const { data: publicationTender, isLoading: isLoadingPublicationTender } = usePublicationTender(
    formType === "publicationTender" ? parseInt(id) : -1
  )
  const { data: openBid, isLoading: isLoadingOpenBid } = useOpenBid(
    formType === "openBid" ? parseInt(id) : -1
  )
  const { data: bidEvaluation, isLoading: isLoadingBidEvaluation } = useBidEvaluation(
    formType === "bidEvaluation" ? parseInt(id) : -1
  )
  const { data: contractSigning, isLoading: isLoadingContractSigning } = useContractSigning(
    formType === "contractSigning" ? parseInt(id) : -1
  )
  const { data: contractManagement, isLoading: isLoadingContractManagement } = useContractManagement(
    formType === "contractManagement" ? parseInt(id) : -1
  )
  const { data: invoice, isLoading: isLoadingInvoice } = useInvoice(
    formType === "invoice" ? parseInt(id) : -1
  )

  // Get current data and loading state
  const getCurrentData = () => {
    switch (formType) {
      case "identification":
        return identification
      case "planning":
        return planning
      case "publication":
        return publication
      case "publicationTender":
        return publicationTender
      case "openBid":
        return openBid
      case "bidEvaluation":
        return bidEvaluation
      case "contractSigning":
        return contractSigning
      case "contractManagement":
        return contractManagement
      case "invoice":
        return invoice
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
      case "openBid":
        return isLoadingOpenBid
      case "bidEvaluation":
        return isLoadingBidEvaluation
      case "contractSigning":
        return isLoadingContractSigning
      case "contractManagement":
        return isLoadingContractManagement
      case "invoice":
        return isLoadingInvoice
      default:
        return false
    }
  }

  const data = getCurrentData()

  console.log("current data", data);

  // Navigate back to list
  const handleBack = () => {
    router.push(`/list?formType=${formType}`)
  }

  // Handle edit
  const handleEdit = () => {
    router.push(`/edit/${formType}/${id}`)
  }

  // Handle delete
  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  // Export to PDF
  const handleExport = () => {
    // PDF export functionality would go here
    console.log("Export to PDF", data)
  }

  if (isLoading()) {
    return <DetailsPageSkeleton formType={formType} />
  }

  if (!data) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The requested {formTitles[formType]} with ID {id} could not be found.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 bg-white rounded-xl p-4">
      {/* Back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Header Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{formTitles[formType]} Details</CardTitle>
              <CardDescription>
                {data.tenderTitle || `${formTitles[formType]} #${id}`}
              </CardDescription>
            </div>
            <StatusBadge formType={formType} data={data} />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem label="ID" value={data.id} />
            
            {/* Common fields that most form types have */}
            {data.tenderTitle && (
              <DetailItem label="Tender Title" value={data.tenderTitle} />
            )}
            {'division' in data && data.division && (
              <DetailItem label="Division" value={data.division} />
            )}
            {'category' in data && data.category && (
              <DetailItem label="Category" value={data.category} />
            )}
            {data.createdAt && (
              <DetailItem 
                label="Created At" 
                value={formatDate(new Date(data.createdAt))} 
              />
            )}
            {data.updatedAt && (
              <DetailItem 
                label="Updated At" 
                value={formatDate(new Date(data.updatedAt))} 
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Key information about this {formTitles[formType].toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <RenderFormTypeOverview formType={formType} data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
              <CardDescription>Complete details of this {formTitles[formType].toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <RenderFormTypeDetails formType={formType} data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Attached documents and files</CardDescription>
            </CardHeader>
            <CardContent>
              <RenderFormTypeDocuments formType={formType} data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Timeline of changes and events</CardDescription>
            </CardHeader>
            <CardContent>
              <RenderFormTypeHistory formType={formType} data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                variant="destructive" 
                onClick={() => {
                  // Handle delete logic here
                  setShowDeleteConfirm(false)
                  router.push(`/list?formType=${formType}`)
                }}
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading skeleton
function DetailsPageSkeleton({ formType }: { formType: FormType }) {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(8).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Status badge based on form type
function StatusBadge({ formType, data }: { formType: FormType; data: any }) {
  if (!data.status) return null

  let variant: "default" | "secondary" | "destructive" | "outline" | null = null
  
  switch (data.status?.toLowerCase()) {
    case "completed":
    case "approved":
    case "accepted":
      variant = "default"
      break
    case "in progress":
    case "pending":
    case "awaiting":
      variant = "secondary"
      break
    case "rejected":
    case "cancelled":
    case "failed":
      variant = "destructive"
      break
    default:
      variant = "outline"
  }

  return (
    <Badge variant={variant}>
      {data.status}
    </Badge>
  )
}

// Generic detail item component
function DetailItem({ label, value }: { label: string; value: any }) {
  if (value === undefined || value === null) return null
  
  const displayValue = typeof value === 'object' 
    ? JSON.stringify(value) 
    : String(value)
  
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base break-words">{displayValue}</p>
    </div>
  )
}

// Form type specific renderers
function RenderFormTypeOverview({ formType, data }: { formType: FormType; data: any }) {
  switch (formType) {
    case "identification":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Budget" value={formatCurrency(data.budget)} />
          <DetailItem label="Division" value={data.division} />
          <DetailItem label="Tender Method" value={data.tenderMethod} />
          <DetailItem label="Specifications" value={data.specifications} />
        </div>
      )
    
    case "planning":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Planning Date" value={formatDate(new Date(data.planningDate))} />
          <DetailItem label="Status" value={data.status} />
          <DetailItem label="Planned Start Date" value={formatDate(new Date(data.plannedStartDate))} />
          <DetailItem label="Planned End Date" value={formatDate(new Date(data.plannedEndDate))} />
        </div>
      )
    
    case "publication":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Publication Type" value={data.publicationType} />
          <DetailItem label="Publication Date" value={formatDate(new Date(data.publicationDate))} />
          <DetailItem label="Approver" value={data.approver} />
          <DetailItem label="Status" value={data.status} />
        </div>
      )
    
    case "publicationTender":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Announcement Date" value={formatDate(new Date(data.announcementDate))} />
          <DetailItem label="Submission Deadline" value={formatDate(new Date(data.submissionDeadline))} />
          <DetailItem label="Announcement URL" value={data.announcementUrl} />
          <DetailItem label="Status" value={data.status} />
        </div>
      )
    
    case "openBid":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Opening Date" value={formatDate(new Date(data.openingDate))} />
          <DetailItem label="Number of Bidders" value={data.numberOfBidders} />
          <DetailItem label="Committee Members" value={data.committeeMembers} />
          <DetailItem label="Status" value={data.status} />
        </div>
      )
    
    case "bidEvaluation":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Evaluation Date" value={formatDate(new Date(data.evaluationDate))} />
          <DetailItem label="Winning Bidder" value={data.winningBidder} />
          <DetailItem label="Bid Amount" value={formatCurrency(data.bidAmount)} />
          <DetailItem label="Status" value={data.status} />
        </div>
      )
    
    case "contractSigning":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Signing Date" value={formatDate(new Date(data.signingDate))} />
          <DetailItem label="Contract Amount" value={formatCurrency(data.contractAmount)} />
          <DetailItem label="Contractor" value={data.contractor} />
          <DetailItem label="Contract Duration" value={`${data.contractDuration} days`} />
        </div>
      )
    
    case "contractManagement":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Start Date" value={formatDate(new Date(data.startDate))} />
          <DetailItem label="End Date" value={formatDate(new Date(data.endDate))} />
          <DetailItem label="Contract Manager" value={data.contractManager} />
          <DetailItem label="Completion Percentage" value={`${data.completionPercentage}%`} />
        </div>
      )
    
    case "invoice":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Invoice Date" value={formatDate(new Date(data.invoiceDate))} />
          <DetailItem label="Invoice Number" value={data.invoiceNumber} />
          <DetailItem label="Amount" value={formatCurrency(data.amount)} />
          <DetailItem label="Payment Status" value={data.paymentStatus} />
        </div>
      )
    
    default:
      return (
        <p>No overview data available for this form type.</p>
      )
  }
}

function RenderFormTypeDetails({ formType, data }: { formType: FormType; data: any }) {
  // For each form type, we'll render all available data organized in sections
  
  const renderFields = (data: any) => {
    if (!data) return null
    
    // Filter out common fields that are already shown in the overview
    const commonFields = ['id', 'createdAt', 'updatedAt']
    
    // Group fields into sections
    const fieldGroups: Record<string, string[]> = {
      General: [],
      Dates: [],
      Financial: [],
      People: [],
      Other: []
    }
    
    // Classify fields
    Object.keys(data).forEach(key => {
      if (commonFields.includes(key)) return
      
      if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) {
        fieldGroups.Dates.push(key)
      } else if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('budget') || 
                key.toLowerCase().includes('cost') || key.toLowerCase().includes('payment')) {
        fieldGroups.Financial.push(key)
      } else if (key.toLowerCase().includes('name') || key.toLowerCase().includes('person') || 
                key.toLowerCase().includes('manager') || key.toLowerCase().includes('member') ||
                key.toLowerCase().includes('bidder') || key.toLowerCase().includes('contractor')) {
        fieldGroups.People.push(key)
      } else if (key === 'tenderTitle' || key === 'division' || key === 'status' || key === 'category') {
        fieldGroups.General.push(key)
      } else {
        fieldGroups.Other.push(key)
      }
    })
    
    return (
      <div className="space-y-8">
        {Object.entries(fieldGroups).map(([groupName, fields]) => {
          if (fields.length === 0) return null
          
          return (
            <div key={groupName}>
              <h3 className="text-lg font-semibold mb-4">{groupName} Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map(field => (
                  <DetailItem 
                    key={field} 
                    label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                    value={field.toLowerCase().includes('date') && data[field] ? formatDate(new Date(data[field])) : data[field]} 
                  />
                ))}
              </div>
              <Separator className="mt-6" />
            </div>
          )
        })}
      </div>
    )
  }
  
  return renderFields(data)
}

function RenderFormTypeDocuments({ formType, data }: { formType: FormType; data: any }) {
  // Placeholder for documents section - in a real app, this would display attachments
  return (
    <div className="space-y-4">
      {data.documents && data.documents.length > 0 ? (
        data.documents.map((doc: any, index: number) => (
          <div key={index} className="flex items-center gap-2 p-3 border rounded-md">
            <div className="flex-1">
              <p className="font-medium">{doc.name}</p>
              <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">No documents attached to this {formTitles[formType].toLowerCase()}.</p>
      )}
    </div>
  )
}

function RenderFormTypeHistory({ formType, data }: { formType: FormType; data: any }) {
  // Placeholder for history section - in a real app, this would display a timeline of changes
  
  // Mock history data
  const historyItems = [
    {
      date: new Date(data.createdAt || new Date()),
      action: "Created",
      user: "System User",
      details: `${formTitles[formType]} created`
    },
    {
      date: new Date(data.updatedAt || new Date()),
      action: "Updated",
      user: "System User",
      details: `${formTitles[formType]} information updated`
    }
  ]
  
  return (
    <div className="space-y-6">
      {historyItems.map((item, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="min-w-[100px] text-sm text-muted-foreground">
            {formatDate(item.date)}
          </div>
          <div>
            <p className="font-medium">{item.action}</p>
            <p className="text-sm text-muted-foreground">By: {item.user}</p>
            <p className="text-sm mt-1">{item.details}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 