import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Company } from "@/hooks/use-companies";
import { useDeleteCompany } from "@/hooks/use-companies";

interface DeleteCompanyDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteCompanyDialog({ company, open, onOpenChange, onSuccess }: DeleteCompanyDialogProps) {
  const deleteCompany = useDeleteCompany();

  async function handleDelete() {
    if (!company) return;
    try {
      await deleteCompany.mutateAsync(company.id);
      toast.success("Company deleted");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete company");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {company?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the company and its associated records. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCompany.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteCompany.isPending} className="bg-destructive text-destructive-foreground">
            {deleteCompany.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
