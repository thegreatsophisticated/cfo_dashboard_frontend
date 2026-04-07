"use client"

import { useState, useEffect } from "react"
import { CompanyCard } from "../company-card"


import { fetchCompanies, type Company } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { CompanyFormDialog } from "./companies/company-form-dialog"
import { DeleteCompanyDialog } from "./companies/delete-company-dialog"
import { CompanyDetailsModal } from "./companies/company-details-modal"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  useEffect(() => {
    loadCompanies()
  }, [])

  async function loadCompanies() {
    try {
      setLoading(true)
      const data = await fetchCompanies()
      setCompanies(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load companies")
    } finally {
      setLoading(false)
    }
  }

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company)
    setDetailsModalOpen(true)
  }

  const handleCreateClick = () => {
    setSelectedCompany(null)
    setFormMode("create")
    setFormModalOpen(true)
  }

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company)
    setFormMode("edit")
    setDetailsModalOpen(false)
    setFormModalOpen(true)
  }

  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company)
    setDetailsModalOpen(false)
    setDeleteModalOpen(true)
  }

  const handleSuccess = () => {
    loadCompanies()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">Error</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-md font-bold mb-2">Companies</h1>
          <p className="text-muted-foreground text-xs">
            Manage your company portfolio
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Company
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onClick={() => handleCompanyClick(company)}
          />
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No companies found</p>
          <Button onClick={handleCreateClick} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Company
          </Button>
        </div>
      )}

      {/* Details Modal */}
      <CompanyDetailsModal
        company={selectedCompany}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Form Modal */}
      <CompanyFormDialog
        company={selectedCompany}
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        mode={formMode}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCompanyDialog
        company={selectedCompany}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
}