"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Globe, Mail, Calendar, Briefcase, TrendingUp, User } from "lucide-react"
import type { Company } from "@/lib/api"

interface CompanyCardProps {
  company: Company
  onClick?: () => void
}

function formatCurrency(amount: number | null): string {
  if (amount === null) return "N/A"
  return `${amount.toLocaleString()}`
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  // Add null/undefined check
  if (!company) {
    return null
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card p-4 rounded-lg border border-border transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-primary"
      )}
    >
      {/* Header Section - Company Identity */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-0.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate leading-tight">
                {company.name}
              </h3>
              <p className="text-[10px] text-muted-foreground capitalize mt-0.5">
                {company.industry}
              </p>
            </div>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] h-4 px-1.5 flex-shrink-0",
            company.isActive
              ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
              : "bg-warning/10 text-warning border-warning/20"
          )}
        >
          {company.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
      
      {/* Description - Context */}
      {company.description && (
        <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {company.description}
        </p>
      )}
      
      {/* Primary Metrics - Financial & Size */}
      <div className="mb-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-1 mb-2">
          <TrendingUp className="h-3 w-3 text-muted-foreground" />
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
            Key Metrics
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <p className="text-[9px] text-muted-foreground font-medium">Annual Revenue</p>
            <p className="font-serif font-semibold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
              RWF {formatCurrency(company.annualRevenue)}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-muted-foreground font-medium">Employees</p>
            <div className="flex items-baseline gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <p className="font-serif font-semibold text-sm text-foreground tabular-nums">
                {company.employeeCount}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Info - Company Details */}
      <div className="mb-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-1 mb-2">
          <Briefcase className="h-3 w-3 text-muted-foreground" />
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
            Company Info
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <p className="text-[9px] text-muted-foreground font-medium">Type</p>
            <p className="text-xs font-medium text-foreground capitalize">
              {company.companyType}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-muted-foreground font-medium">Established</p>
            <div className="flex items-baseline gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">
                {formatDate(company.establishedDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact & Leadership - Communication */}
      <div className="space-y-1.5">
        {company.ceo && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="font-medium text-foreground mr-1">CEO:</span>
            <span className="truncate">{company.ceo}</span>
          </div>
        )}
        {company.email && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <a 
              href={`mailto:${company.email}`} 
              className="truncate hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {company.email}
            </a>
          </div>
        )}
        {company.website && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Globe className="h-3 w-3 flex-shrink-0" />
            <a 
              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {company.website.replace(/https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}