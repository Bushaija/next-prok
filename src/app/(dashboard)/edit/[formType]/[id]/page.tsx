"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"

// UI Components
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft, CalendarIcon, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// API Hooks
import { useIdentification, useUpdateIdentification } from "@/features/api/identification.query"
import { usePlanning, useUpdatePlanning } from "@/features/api/planning.query"
import { usePublication, useUpdatePublication } from "@/features/api/publication.query"
import { usePublicationTender, useUpdatePublicationTender } from "@/features/api/publicationTender.query"
import { useOpenBid, useUpdateOpenBid } from "@/features/api/openBid.query"
import { useBidEvaluation, useUpdateBidEvaluation } from "@/features/api/bidEvaluation.query"
import { useContractSigning, useUpdateContractSigning } from "@/features/api/contractSigning.query"
import { useContractManagement, useUpdateContractManagement } from "@/features/api/contractManagement.query"
import { useInvoice, useUpdateInvoice } from "@/features/api/invoice.query"

// Types
import { FormType, formTitles } from "@/constants/form-data-object"
import { cn } from "@/lib/utils"

// Helper function to convert date string to Date object
const convertToDate = (dateStr: string | Date | null | undefined): Date | undefined => {
  if (!dateStr) return undefined
  if (dateStr instanceof Date) return dateStr
  try {
    return new Date(dateStr)
  } catch (error) {
    console.error("Error converting date:", error)
    return undefined
  }
}

export default function EditFormPage() {
  const params = useParams()
  const router = useRouter()
  const formType = params.formType as FormType
  const id = parseInt(params.id as string, 10)
  
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Get data fetching hook based on form type
  const getDataHook = () => {
    switch (formType) {
      case "identification":
        return useIdentification(id)
      case "planning":
        return usePlanning(id)
      case "publication":
        return usePublication(id)
      case "publicationTender":
        return usePublicationTender(id)
      case "openBid":
        return useOpenBid(id)
      case "bidEvaluation":
        return useBidEvaluation(id)
      case "contractSigning":
        return useContractSigning(id)
      case "contractManagement":
        return useContractManagement(id)
      case "invoice":
        return useInvoice(id)
      default:
        throw new Error(`Unsupported form type: ${formType}`)
    }
  }

  const { data, isLoading, isError, error } = getDataHook()

  // Get update mutation hook based on form type
  const getMutationHook = () => {
    switch (formType) {
      case "identification":
        return useUpdateIdentification()
      case "planning":
        return useUpdatePlanning()
      case "publication":
        return useUpdatePublication()
      case "publicationTender":
        return useUpdatePublicationTender()
      case "openBid":
        return useUpdateOpenBid()
      case "bidEvaluation":
        return useUpdateBidEvaluation()
      case "contractSigning":
        return useUpdateContractSigning()
      case "contractManagement":
        return useUpdateContractManagement()
      case "invoice":
        return useUpdateInvoice()
      default:
        throw new Error(`Unsupported form type: ${formType}`)
    }
  }

  const updateMutation = getMutationHook()

  // Create form schema based on form type
  const getFormSchema = () => {
    // This is a simplified schema, in a real app you'd use the actual schemas from /db/schema.ts
    const baseSchema: any = {}
    
    if (!data) return z.object(baseSchema)
    
    // Add all fields from data to schema
    Object.keys(data).forEach(key => {
      // Skip id, createdAt, updatedAt fields
      if (key === 'id' || key === 'createdAt' || key === 'updatedAt') return
      
      // Handle different field types
      if (data[key] === null || data[key] === undefined) {
        baseSchema[key] = z.any().optional()
      } else if (data[key] instanceof Date || key.toLowerCase().includes('date')) {
        baseSchema[key] = z.date().optional()
      } else if (typeof data[key] === 'number') {
        baseSchema[key] = z.number().optional()
      } else if (typeof data[key] === 'boolean') {
        baseSchema[key] = z.boolean().optional()
      } else {
        baseSchema[key] = z.string().optional()
      }
    })
    
    return z.object(baseSchema)
  }

  const formSchema = getFormSchema()
  type FormSchema = z.infer<typeof formSchema>

  // Initialize form
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: data ? {...data} : {} as FormSchema,
  })

  // Update form values when data is loaded
  useEffect(() => {
    if (data) {
      const values: any = {...data}
      
      // Convert date strings to Date objects for date fields
      Object.keys(values).forEach(key => {
        if (key.toLowerCase().includes('date') && values[key]) {
          values[key] = convertToDate(values[key])
        }
      })
      
      form.reset(values)
    }
  }, [data, form])

  const onSubmit = async (values: FormSchema) => {
    try {
      setSubmitStatus("loading")
      
      // Process date fields to ensure they are in the correct format
      const processedValues: any = {...values}
      
      await updateMutation.mutateAsync({
        id,
        data: processedValues
      })
      
      setSubmitStatus("success")
      
      // Navigate back to details page after successful update
      setTimeout(() => {
        router.push(`/details/${formType}/${id}`)
      }, 1500)
    } catch (error) {
      console.error("Error updating form:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
      setSubmitStatus("error")
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return <EditFormSkeleton formType={formType} />
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load data"}
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 bg-white rounded-xl p-4">
      <div className="flex items-center mb-6">
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Edit {formTitles[formType]}</h1>
      </div>
      
      {submitStatus === "success" && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription>
            Changes saved successfully. Redirecting...
          </AlertDescription>
        </Alert>
      )}
      
      {submitStatus === "error" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMessage || "Failed to save changes. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit {formTitles[formType]}</CardTitle>
          <CardDescription>
            Update the information for this {formTitles[formType].toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 grid grid-cols-3 gap-4">
              {data && Object.keys(data).map(key => {
                // Skip id and timestamp fields
                if (key === 'id' || key === 'createdAt' || key === 'updatedAt') return null
                
                // Render different field types based on field name and value type
                const fieldValue = data[key]
                const isDateField = key.toLowerCase().includes('date')
                const isNumberField = typeof fieldValue === 'number' && !key.includes('Id')
                const isTextField = typeof fieldValue === 'string' && fieldValue.length > 100
                const isStatusField = key.toLowerCase() === 'status' || key.toLowerCase().includes('status')
                
                // Generate formatted label from camelCase field name
                const fieldLabel = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabel}</FormLabel>
                        <FormControl>
                          {isDateField ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value as Date, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value as Date}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date("1900-01-01")
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                          ) : isTextField ? (
                            <Textarea 
                              {...field} 
                              value={field.value as string || ""} 
                            />
                          ) : isNumberField ? (
                            <Input 
                              type="number" 
                              {...field} 
                              value={field.value as number || ""} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                            />
                          ) : isStatusField ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value as string}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="inProgress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input 
                              {...field} 
                              value={field.value as string || ""} 
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              })}
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitStatus === "loading"}
                >
                  {submitStatus === "loading" ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

function EditFormSkeleton({ formType }: { formType: FormType }) {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-24 mr-4" />
        <Skeleton className="h-8 w-64" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-72 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="flex justify-end space-x-4 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
