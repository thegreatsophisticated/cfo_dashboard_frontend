import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { Company, CreateCompanyDto, useCreateCompany, useUpdateCompany } from "@/hooks/use-companies";

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
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  mode: "create" | "edit";
  onSuccess: () => void;
}

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
};

const emptyDefaults: CompanyFormValues = {
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
};

// Shared, compact field chrome so every label/input/error line matches the app's small-font scale
const labelClass = "text-[11px] font-medium text-muted-foreground";
const inputClass = "h-8 text-[12.5px]";
const sectionTitleClass = "text-[11px] font-semibold uppercase tracking-wide text-foreground/80";

export function CompanyFormDialog({ open, onOpenChange, company, mode, onSuccess }: CompanyFormDialogProps) {
  const { user } = useAuth();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const isSubmitting = createCompany.isPending || updateCompany.isPending;

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (open && mode === "edit" && company) {
      form.reset({
        name: company.name || "",
        description: company.description || "",
        employeeCount: company.employeeCount || 0,
        establishedDate: company.establishedDate ? company.establishedDate.split("T")[0] : "",
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
      });
    } else if (open && mode === "create") {
      form.reset(emptyDefaults);
    }
  }, [open, mode, company, form]);

  async function onSubmit(values: CompanyFormValues) {
    try {
      if (mode === "create") {
        const payload: CreateCompanyDto = {
          ...values,
          name: values.name,
          companyType: values.companyType,
          createdBy: user?.id ?? 1,
        };
        await createCompany.mutateAsync(payload);
      } else if (company) {
        await updateCompany.mutateAsync({ id: company.id, data: values });
      }

      toast.success(mode === "create" ? "Company created successfully" : "Company updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError) {
        const details = (error as ApiError & { details?: unknown }).details;
        if (Array.isArray(details)) {
          // If your backend nests validation messages, adapt this branch to read them.
        }

        const messages = error.message.split(". ");
        let hasFieldError = false;
        const unmapped: string[] = [];

        messages.forEach((msg) => {
          const matchedField = Object.keys(FIELD_ERROR_MAP).find((key) => msg.toLowerCase().includes(key.toLowerCase()));
          if (matchedField) {
            form.setError(FIELD_ERROR_MAP[matchedField], { type: "server", message: msg });
            hasFieldError = true;
          } else {
            unmapped.push(msg);
          }
        });

        if (unmapped.length > 0) toast.error(unmapped.join(". "));
        else if (!hasFieldError) toast.error(error.message);
        return;
      }

      toast.error(`Failed to ${mode} company`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-[15px] font-semibold">
            {mode === "create" ? "Create New Company" : "Edit Company"}
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            {mode === "create" ? "Add a new company to the system" : "Update company information"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-3">
              <h3 className={sectionTitleClass}>Basic Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="IREBE Ltd" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Company Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sole_proprietorship" className="text-[12.5px]">
                            Sole Proprietorship
                          </SelectItem>
                          <SelectItem value="partnership" className="text-[12.5px]">
                            Partnership
                          </SelectItem>
                          <SelectItem value="llc" className="text-[12.5px]">
                            LLC
                          </SelectItem>
                          <SelectItem value="corporation" className="text-[12.5px]">
                            Corporation
                          </SelectItem>
                          <SelectItem value="non_profit" className="text-[12.5px]">
                            Non-Profit
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the company..."
                        className="min-h-16 text-[12.5px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Industry</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology" className="text-[12.5px]">
                            Technology
                          </SelectItem>
                          <SelectItem value="healthcare" className="text-[12.5px]">
                            Healthcare
                          </SelectItem>
                          <SelectItem value="finance" className="text-[12.5px]">
                            Finance
                          </SelectItem>
                          <SelectItem value="retail" className="text-[12.5px]">
                            Retail
                          </SelectItem>
                          <SelectItem value="manufacturing" className="text-[12.5px]">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="education" className="text-[12.5px]">
                            Education
                          </SelectItem>
                          <SelectItem value="other" className="text-[12.5px]">
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Employees</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Established Date</FormLabel>
                      <FormControl>
                        <Input type="date" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <h3 className={sectionTitleClass}>Contact Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@company.com" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+250 XXX XXX XXX" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://company.com" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3 border-t pt-4">
              <h3 className={sectionTitleClass}>Legal &amp; Financial</h3>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Tax ID</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="REG-12345" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="annualRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Annual Revenue (RWF)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ceo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>CEO</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="border-t pt-4">
                  <FormLabel className={labelClass}>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." className="min-h-16 text-[12.5px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[12.5px]"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-[12.5px]" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {mode === "create" ? "Create Company" : "Update Company"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
