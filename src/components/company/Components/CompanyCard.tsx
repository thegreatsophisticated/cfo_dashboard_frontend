import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { Company } from "@/hooks/use-companies";

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{company.name}</p>
              <p className="text-xs text-muted-foreground">{company.industry}</p>
            </div>
          </div>
          <Badge variant={company.isActive ? "default" : "outline"} className="text-[10px]">
            {company.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        {company.description && (
          <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{company.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{company.employeeCount} employees</span>
          {company.ceo && <span>CEO: {company.ceo}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
