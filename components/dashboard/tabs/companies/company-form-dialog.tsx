"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Company } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

enum CompanyType {
  SOLE_PROPRIETORSHIP = "sole_proprietorship",
  PARTNERSHIP = "partnership",
  LLC = "llc",
  CORPORATION = "corporation",
  NON_PROFIT = "non_profit",
}

enum IndustryType {
  TECHNOLOGY = "technology",
  HEALTHCARE = "healthcare",
  FINANCE = "finance",
  RETAIL = "retail",
  MANUFACTURING = "manufacturing",
  EDUCATION = "education",
  OTHER = "other",
}

const companyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  employeeCount: z.coerce.number().min(0).max(1000000).optional(),
  establishedDate: z.string().optional(),
  companyType: z.nativeEnum(CompanyType),
  industry: z.nativeEnum(IndustryType).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  taxId: z.string().min(9).max(15).optional().or(z.literal("")),
  registrationNumber: z.string().optional(),
  annualRevenue: z.coerce.number().min(0).optional(),
  ceo: z.string().optional(),
  notes: z.string().max(1000).optional(),
  createdBy: z.number(),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

interface CompanyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: Company | null
  mode: "create" | "edit"
  onSuccess: () => void
}

// Helper function to get current user from localStorage
function getCurrentUserId(): number {
  if (typeof window === "undefined") return 1

  try {
    const USER_STORAGE_KEY = "irebe_user"
    const USER_STORAGE_Token = "irebe_tokens"

    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    const storedToken = localStorage.getItem(USER_STORAGE_Token)

    console.log("Retrieved user from localStorage:", storedUser)
    console.log("Retrieved token from localStorage:", storedToken)

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      return parsedUser?.id
    }
  } catch (error) {
    console.error("Error reading user from localStorage:", error)
  }

  return 1 // Default fallback
}

// Map API error messages to form field names
const FIELD_ERROR_MAP: Record<string, keyof CompanyFormValues> = {
  phoneNumber: "phoneNumber",
  website: "website",
  taxId: "taxId",
  email: "email",
  name: "name",
  annualRevenue: "annualRevenue",
  employeeCount: "employeeCount",
  registrationNumber: "registrationNumber",
  description: "description",
  companyType: "companyType",
  industry: "industry",
  ceo: "ceo",
  notes: "notes",
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  company,
  mode,
  onSuccess,
}: CompanyFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get current user ID only once using useMemo
  const currentUserId = useMemo(() => getCurrentUserId(), [])

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      employeeCount: 0,
      establishedDate: "",
      companyType: CompanyType.LLC,
      industry: IndustryType.OTHER,
      email: "",
      phoneNumber: "",
      website: "",
      taxId: "",
      registrationNumber: "",
      annualRevenue: 0,
      ceo: "",
      notes: "",
      createdBy: currentUserId,
    },
  })

  // Reset form when dialog opens or mode/company changes
  useEffect(() => {
    if (open && mode === "edit" && company) {
      form.reset({
        name: company.name || "",
        description: company.description || "",
        employeeCount: company.employeeCount || 0,
        establishedDate: company.establishedDate
          ? new Date(company.establishedDate).toISOString().split("T")[0]
          : "",
        companyType: (company.companyType as CompanyType) || CompanyType.LLC,
        industry: (company.industry as IndustryType) || IndustryType.OTHER,
        email: company.email || "",
        phoneNumber: company.phoneNumber || "",
        website: company.website || "",
        taxId: company.taxId || "",
        registrationNumber: company.registrationNumber || "",
        annualRevenue: company.annualRevenue || 0,
        ceo: company.ceo || "",
        notes: company.notes || "",
        createdBy: company.createdBy?.id || currentUserId,
      })
    } else if (open && mode === "create") {
      form.reset({
        name: "",
        description: "",
        employeeCount: 0,
        establishedDate: "",
        companyType: CompanyType.LLC,
        industry: IndustryType.OTHER,
        email: "",
        phoneNumber: "",
        website: "",
        taxId: "",
        registrationNumber: "",
        annualRevenue: 0,
        ceo: "",
        notes: "",
        createdBy: currentUserId,
      })
    }
  }, [open, mode, company, form, currentUserId])

  async function onSubmit(values: CompanyFormValues) {
    setIsSubmitting(true)
    try {
      const url =
        mode === "create"
          ? `${API_BASE_URL}company/create`
          : `${API_BASE_URL}company/${company?.id}`

      const method = mode === "create" ? "POST" : "PATCH"

      const USER_STORAGE_Token = "irebe_tokens"
      const storedToken = localStorage.getItem(USER_STORAGE_Token)
      const token = storedToken !== null ? JSON.parse(storedToken) : null

      console.log(
        "Attempting to retrieve token from localStorage with key:",
        token?.accessToken
      )

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.accessToken}`,
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        // Handle array of validation error messages from the API
        if (errorData.message && Array.isArray(errorData.message)) {
          let hasFieldError = false
          const unmappedErrors: string[] = []

          errorData.message.forEach((msg: string) => {
            // Find which field this error belongs to by checking if the
            // field key appears anywhere in the error message string
            const matchedField = Object.keys(FIELD_ERROR_MAP).find((key) =>
              msg.toLowerCase().includes(key.toLowerCase())
            )

            if (matchedField) {
              form.setError(FIELD_ERROR_MAP[matchedField], {
                type: "server",
                message: msg,
              })
              hasFieldError = true
            } else {
              unmappedErrors.push(msg)
            }
          })

          // Show a toast for any errors that couldn't be mapped to a field
          if (unmappedErrors.length > 0) {
            toast.error(unmappedErrors.join(". "))
          } else if (!hasFieldError) {
            toast.error("Validation failed. Please check the form.")
          }

          // Return early so the dialog stays open for the user to fix errors
          return
        }

        // Handle single string error message
        throw new Error(
          typeof errorData.message === "string"
            ? errorData.message
            : `Failed to ${mode} company`
        )
      }

      toast.success(
        mode === "create"
          ? "Company created successfully"
          : "Company updated successfully"
      )

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error(`Error ${mode}ing company:`, error)
      toast.error(
        error instanceof Error ? error.message : `Failed to ${mode} company`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Company" : "Edit Company"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new company to the system"
              : "Update company information"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="IREBE Ltd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sole_proprietorship">
                            Sole Proprietorship
                          </SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                          <SelectItem value="corporation">Corporation</SelectItem>
                          <SelectItem value="non_profit">Non-Profit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the company..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employees</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="establishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Established Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+250 XXX XXX XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal & Financial</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="REG-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="annualRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Revenue (RWF)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ceo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEO</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Company" : "Update Company"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
