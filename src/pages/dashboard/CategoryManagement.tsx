import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Plus,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Layers,
  Tag,
  Loader2,
  MoreVertical,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useMainCategories,
  useSubCategories,
  useCreateCategory,
  useDeleteCategory,
  useRestoreCategory,
  fetchSubCategoriesDirect,
  fetchSubSubCategoriesDirect,
  type Category,
  type CategoryLevel,
  type CategoryType,
  type CreateCategoryDto,
} from "@/hooks/use-categories";

const categoryTypeColors: Record<string, string> = {
  asset: "bg-blue-100 text-blue-800 border-blue-200",
  liability: "bg-red-100 text-red-800 border-red-200",
  equity: "bg-green-100 text-green-800 border-green-200",
  income: "bg-emerald-100 text-emerald-800 border-emerald-200",
  expense: "bg-orange-100 text-orange-800 border-orange-200",
};

const categoryLevelIcons: Record<CategoryLevel, React.ReactNode> = {
  main: <FolderTree className="h-3 w-3" />,
  sub: <Layers className="h-3 w-3" />,
  sub_sub: <Tag className="h-3 w-3" />,
};

function CategoryItem({
  category,
  level = 0,
}: {
  category: Category;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useDeleteCategory();
  const restoreMutation = useRestoreCategory();

  const handleToggle = async () => {
    if (!isOpen && subCategories.length === 0 && category.level !== "sub_sub") {
      setIsLoadingSubs(true);
      try {
        const subs =
          category.level === "main"
            ? await fetchSubCategoriesDirect(category.id)
            : await fetchSubSubCategoriesDirect(category.id);
        setSubCategories(subs);
      } catch (error) {
        console.error("Error loading sub-categories:", error);
      } finally {
        setIsLoadingSubs(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    deleteMutation.mutate(category.id, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        setShowDeleteDialog(false);
      },
      onError: (error: Error) =>
        toast.error(error.message || "Failed to delete category"),
    });
  };

  const handleRestore = () => {
    restoreMutation.mutate(category.id, {
      onSuccess: () => toast.success("Category restored successfully"),
      onError: (error: Error) =>
        toast.error(error.message || "Failed to restore category"),
    });
  };

  const hasChildren = category.level !== "sub_sub";

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <div className="flex items-center gap-1.5 group">
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex-1 flex items-center gap-1.5 px-2.5 py-1.5 text-left hover:bg-muted/50 transition-colors rounded-md",
                level > 0 && "ml-4",
              )}
            >
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                )
              ) : (
                <span className="w-3" />
              )}

              <span className="flex-shrink-0 text-muted-foreground">
                {categoryLevelIcons[category.level]}
              </span>

              <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
                {category.code && (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {category.code}
                  </span>
                )}
                <span className="text-[11px] font-medium truncate">
                  {category.name}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                {category.categoryType && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize text-[9px] h-4 px-1.5",
                      categoryTypeColors[category.categoryType],
                    )}
                  >
                    {category.categoryType}
                  </Badge>
                )}
                {category.allowTransactions && (
                  <Badge
                    variant="outline"
                    className="text-[9px] h-4 px-1.5 bg-purple-50 text-purple-700 border-purple-200"
                  >
                    TX
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] h-4 px-1.5",
                    category.isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-500 border-gray-200",
                  )}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
                {category.deletedAt && (
                  <Badge
                    variant="outline"
                    className="text-[9px] h-4 px-1.5 bg-red-50 text-red-700 border-red-200"
                  >
                    Deleted
                  </Badge>
                )}
              </div>
            </button>
          </CollapsibleTrigger>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {category.deletedAt ? (
                <DropdownMenuItem
                  onClick={handleRestore}
                  disabled={restoreMutation.isPending}
                  className="text-[11px]"
                >
                  <RotateCcw className="h-3 w-3 mr-2" />
                  {restoreMutation.isPending ? "Restoring..." : "Restore"}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-[11px] text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {category.description && (
          <div className={cn("px-2.5 pb-1.5 ml-7", level > 0 && "ml-11")}>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {category.description}
            </p>
          </div>
        )}

        {hasChildren && (
          <CollapsibleContent>
            {isLoadingSubs ? (
              <div className="ml-7 py-1.5 flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-[11px]">Loading...</span>
              </div>
            ) : subCategories.length > 0 ? (
              <div className="border-l-2 border-muted ml-4">
                {subCategories.map((sub) => (
                  <CategoryItem key={sub.id} category={sub} level={level + 1} />
                ))}
              </div>
            ) : (
              <div className="ml-7 py-1.5 text-[11px] text-muted-foreground">
                No sub-categories
              </div>
            )}
          </CollapsibleContent>
        )}
      </Collapsible>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{category.name}"? This action can
              be undone by restoring the category later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryDto>({
    code: "",
    name: "",
    description: "",
    level: "main",
    categoryType: null,
    sortOrder: 0,
  });

  const { data: mainCategories } = useMainCategories();

  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);
  const { data: subCategories } = useSubCategories(
    selectedMainId,
    formData.level === "sub_sub",
  );

  const createMutation = useCreateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Category created successfully");
        setOpen(false);
        setFormData({
          code: "",
          name: "",
          description: "",
          level: "main",
          categoryType: null,
          sortOrder: 0,
        });
        setSelectedMainId(null);
      },
      onError: (error: Error) =>
        toast.error(error.message || "Failed to create category"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 px-2.5">
          <Plus className="h-3 w-3 mr-1" />
          <span className="text-[11px]">Add Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label htmlFor="level" className="text-[11px]">
                Level
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    level: value as CategoryLevel,
                    parentId: undefined,
                  });
                  setSelectedMainId(null);
                }}
              >
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main" className="text-[11px]">
                    Main Category
                  </SelectItem>
                  <SelectItem value="sub" className="text-[11px]">
                    Sub Category
                  </SelectItem>
                  <SelectItem value="sub_sub" className="text-[11px]">
                    Sub-Sub Category
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="categoryType" className="text-[11px]">
                Category Type
              </Label>
              <Select
                value={formData.categoryType || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    categoryType: (value || null) as CategoryType,
                  })
                }
              >
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset" className="text-[11px]">
                    Asset
                  </SelectItem>
                  <SelectItem value="liability" className="text-[11px]">
                    Liability
                  </SelectItem>
                  <SelectItem value="equity" className="text-[11px]">
                    Equity
                  </SelectItem>
                  <SelectItem value="income" className="text-[11px]">
                    Income
                  </SelectItem>
                  <SelectItem value="expense" className="text-[11px]">
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.level !== "main" && (
            <div className="space-y-1">
              <Label className="text-[11px]">Parent Main Category</Label>
              <Select
                value={selectedMainId?.toString() || ""}
                onValueChange={(value) => {
                  const id = parseInt(value);
                  setSelectedMainId(id);
                  if (formData.level === "sub") {
                    setFormData({ ...formData, parentId: id });
                  }
                }}
              >
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue placeholder="Select main category" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories?.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id.toString()}
                      className="text-[11px]"
                    >
                      {cat.code ? `${cat.code} - ` : ""}
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.level === "sub_sub" && selectedMainId && (
            <div className="space-y-1">
              <Label className="text-[11px]">Parent Sub Category</Label>
              <Select
                value={formData.parentId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, parentId: parseInt(value) })
                }
              >
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories?.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id.toString()}
                      className="text-[11px]"
                    >
                      {cat.code ? `${cat.code} - ` : ""}
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label htmlFor="code" className="text-[11px]">
                Code
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., 101"
                className="h-7 text-[11px]"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="sortOrder" className="text-[11px]">
                Sort Order
              </Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value) || 0,
                  })
                }
                className="h-7 text-[11px]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="name" className="text-[11px]">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Category name"
              className="h-7 text-[11px]"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-[11px]">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional description"
              rows={2}
              className="text-[11px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5"
              onClick={() => setOpen(false)}
            >
              <span className="text-[11px]">Cancel</span>
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-7 px-2.5"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className="h-3 w-3 mr-1" />
              )}
              <span className="text-[11px]">Create Category</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CategoryManagement() {
  const { data: mainCategories, isLoading, error } = useMainCategories();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold">Account Categories</h2>
          <p className="text-[11px] text-muted-foreground">
            Manage your chart of accounts hierarchy
          </p>
        </div>
        <CreateCategoryDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
        <Card>
          <CardContent className="pt-3 pb-2.5 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <FolderTree className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-base font-bold">
                  {mainCategories?.length || 0}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  Main Categories
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 pb-2.5 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Tag className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div>
                <p className="text-base font-bold">
                  {mainCategories?.filter((c) => c.categoryType === "asset")
                    .length || 0}
                </p>
                <p className="text-[9px] text-muted-foreground">Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 pb-2.5 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 rounded-md">
                <Tag className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-bold">
                  {mainCategories?.filter((c) => c.categoryType === "income")
                    .length || 0}
                </p>
                <p className="text-[9px] text-muted-foreground">Income</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 pb-2.5 px-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-md">
                <Tag className="h-3.5 w-3.5 text-orange-600" />
              </div>
              <div>
                <p className="text-base font-bold">
                  {mainCategories?.filter((c) => c.categoryType === "expense")
                    .length || 0}
                </p>
                <p className="text-[9px] text-muted-foreground">Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs">Category Hierarchy</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-destructive">
              <p className="text-[11px]">Failed to load categories</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          ) : mainCategories && mainCategories.length > 0 ? (
            <div className="divide-y">
              {mainCategories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FolderTree className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-[11px]">No categories found</p>
              <p className="text-[10px]">
                Create your first category to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CategoryManagement;
