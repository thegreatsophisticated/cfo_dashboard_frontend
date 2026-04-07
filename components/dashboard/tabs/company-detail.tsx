"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Users,
  Globe,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  Edit,
  Trash2,
  Briefcase,
  User,
  Hash,
  TrendingUp,
  MessageSquare,
  UserCircle,
} from "lucide-react"
import type { Company } from "@/lib/api"

interface CompanyDetailsModalProps {
  company: Company | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (company: Company) => void
  onDelete: (company: Company) => void
}

function formatCurrency(amount: number | null): string {
  if (amount === null) return "N/A"
  return `RWF ${amount.toLocaleString()}`
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function CompanyDetailsModal({
  company,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: CompanyDetailsModalProps) {
  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <DialogTitle className="text-lg leading-tight">{company.name}</DialogTitle>
              </div>
              <DialogDescription className="capitalize text-xs">
                {company.industry} • {company.companyType?.replace(/_/g, " ")}
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className={`text-[9px] h-5 px-2 flex-shrink-0 ${
                company.isActive
                  ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                  : "bg-warning/10 text-warning border-warning/20"
              }`}
            >
              {company.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          {company.description && (
            <div className="bg-muted/30 rounded-md p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Description
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{company.description}</p>
            </div>
          )}

          {/* Key Metrics - Financial Overview */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-md p-3 border border-emerald-200/50 dark:border-emerald-800/50">
            <div className="flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <h3 className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Key Metrics
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-medium text-muted-foreground mb-0.5">Annual Revenue</p>
                  <p className="text-sm font-serif font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                    {formatCurrency(company.annualRevenue)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-medium text-muted-foreground mb-0.5">Employees</p>
                  <p className="text-sm font-serif font-semibold text-blue-600 dark:text-blue-400">
                    {company.employeeCount || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Communication Channels */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Contact Information
              </h3>
            </div>
            <div className="space-y-2 bg-muted/20 rounded-md p-3">
              {company.email && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-background flex items-center justify-center flex-shrink-0">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <a
                    href={`mailto:${company.email}`}
                    className="text-xs text-primary hover:underline truncate"
                  >
                    {company.email}
                  </a>
                </div>
              )}
              {company.phoneNumber && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-background flex items-center justify-center flex-shrink-0">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <a
                    href={`tel:${company.phoneNumber}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {company.phoneNumber}
                  </a>
                </div>
              )}
              {company.website && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-background flex items-center justify-center flex-shrink-0">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate"
                  >
                    {company.website}
                  </a>
                </div>
              )}
              {!company.email && !company.phoneNumber && !company.website && (
                <p className="text-xs text-muted-foreground text-center py-2">No contact information available</p>
              )}
            </div>
          </div>

          {/* Company Details & Registration */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Company Details
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {company.ceo && (
                <div className="bg-muted/20 rounded-md p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[9px] text-muted-foreground font-medium">CEO</p>
                  </div>
                  <p className="text-xs font-medium truncate">{company.ceo}</p>
                </div>
              )}
              {company.establishedDate && (
                <div className="bg-muted/20 rounded-md p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[9px] text-muted-foreground font-medium">Established</p>
                  </div>
                  <p className="text-xs font-medium">
                    {formatDate(company.establishedDate)}
                  </p>
                </div>
              )}
              {company.taxId && (
                <div className="bg-muted/20 rounded-md p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[9px] text-muted-foreground font-medium">Tax ID</p>
                  </div>
                  <p className="text-xs font-medium font-mono truncate">{company.taxId}</p>
                </div>
              )}
              {company.registrationNumber && (
                <div className="bg-muted/20 rounded-md p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[9px] text-muted-foreground font-medium">Registration No.</p>
                  </div>
                  <p className="text-xs font-medium font-mono truncate">
                    {company.registrationNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {company.notes && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Notes
                </h3>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{company.notes}</p>
              </div>
            </div>
          )}

          {/* Created By */}
          {company.createdBy && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5 mb-2">
                <UserCircle className="h-3 w-3 text-muted-foreground" />
                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Created By
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-muted/20 rounded-md p-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-semibold text-primary">
                    {company.createdBy.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{company.createdBy.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {company.createdBy.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2  border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(company)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-8"
          >
            <Trash2 className="mr-1.5 h-3 w-3" />
            Delete
          </Button>
          <Button size="sm" onClick={() => onEdit(company)} className="text-xs h-8">
            <Edit className="mr-1.5 h-3 w-3" />
            Edit Company
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}