import { useState } from "react";
import { Plus, Loader2, MoreVertical, Pencil, Trash2, Eye, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Company, useCompanies } from "@/hooks/use-companies";
import { CompanyDetailsModal } from "@/components/company/Components/CompanyDetailsModal";
import { CompanyFormDialog } from "@/components/company/Components/CompanyFormDialog";
import { DeleteCompanyDialog } from "@/components/company/Components/DeleteCompanyDialog";

const CompanyManagement = () => {
  const { data: companies = [], isLoading, isError, refetch } = useCompanies();

  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setDetailsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedCompany(null);
    setFormMode("create");
    setFormModalOpen(true);
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setFormMode("edit");
    setDetailsModalOpen(false);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setDetailsModalOpen(false);
    setDeleteModalOpen(true);
  };

  const filteredCompanies = companies.filter((company) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      company.name?.toLowerCase().includes(query) ||
      company.email?.toLowerCase().includes(query) ||
      company.industry?.toLowerCase().includes(query) ||
      company.registrationNumber?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2.5 py-24 text-center">
        <p className="text-[11px] font-semibold text-destructive">Couldn't load companies</p>
        <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xs font-semibold tracking-tight text-foreground">Companies</h1>
          <p className="text-[10px] text-muted-foreground/80">Manage your company portfolio</p>
        </div>
        <Button onClick={handleCreateClick} size="sm" className="h-7 gap-1 px-2.5 text-[11px]">
          <Plus className="h-3 w-3" />
          Create Company
        </Button>
      </div>

      {companies.length > 0 && (
        <div className="mb-2.5">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, industry, or reg. number"
            className="h-7 max-w-xs text-[7px]"
          />
        </div>
      )}

      {companies.length === 0 ? (
        <div className="py-12 text-center">
          <Building2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="mb-3 text-[11px] text-muted-foreground/80">No companies found</p>
          <Button onClick={handleCreateClick} variant="outline" size="sm" className="h-7 text-[11px]">
            <Plus className="mr-1 h-3 w-3" />
            Create Your First Company
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="h-7 text-[10px] font-semibold">Company</TableHead>
                <TableHead className="h-7 text-[10px] font-semibold">Industry</TableHead>
                <TableHead className="h-7 text-[10px] font-semibold">Contact</TableHead>
                <TableHead className="h-7 text-[10px] font-semibold">Reg. Number</TableHead>
                <TableHead className="h-7 text-[10px] font-semibold">Status</TableHead>
                <TableHead className="h-7 text-[10px] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  className="cursor-pointer text-[11px] hover:bg-muted/40"
                  onClick={() => handleCompanyClick(company)}
                >
                  <TableCell className="py-2 font-medium">{company.name}</TableCell>
                  <TableCell className="py-2 text-muted-foreground">
                    {company.industry || "—"}
                  </TableCell>
                  <TableCell className="py-2 text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{company.email || "—"}</span>
                      {company.phone && (
                        <span className="text-[10px] text-muted-foreground/70">{company.phone}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-muted-foreground tabular-nums">
                    {company.registrationNumber || "—"}
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant="outline"
                      className={`text-[9px] h-4 px-1.5 ${
                        company.isActive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {company.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-[11px]"
                          onClick={() => handleCompanyClick(company)}
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[11px]"
                          onClick={() => handleEditClick(company)}
                        >
                          <Pencil className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[11px] text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(company)}
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {filteredCompanies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-[11px] text-muted-foreground">
                    No companies match "{search}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <CompanyDetailsModal
        company={selectedCompany}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <CompanyFormDialog
        company={selectedCompany}
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        mode={formMode}
        onSuccess={() => refetch()}
      />

      <DeleteCompanyDialog
        company={selectedCompany}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default CompanyManagement;
