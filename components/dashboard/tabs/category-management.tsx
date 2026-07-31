"use client"

import React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  fetchMainCategories,
  fetchSubCategories,
  fetchSubSubCategories,
  createCategory,
  deleteCategory,
  restoreCategory,
  type Category,
  type CategoryLevel,
  type CategoryType,
  type CreateCategoryDto,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const categoryTypeColors: Record<string, string> = {
  asset: "bg-blue-100 text-blue-800 border-blue-200",
  liability: "bg-red-100 text-red-800 border-red-200",
  equity: "bg-green-100 text-green-800 border-green-200",
  income: "bg-emerald-100 text-emerald-800 border-emerald-200",
  expense: "bg-orange-100 text-orange-800 border-orange-200",
}

const categoryLevelIcons: Record<CategoryLevel, React.ReactNode> = {
  main: <FolderTree className="h-3.5 w-3.5" />,
  sub: <Layers className="h-3.5 w-3.5" />,
  sub_sub: <Tag className="h-3.5 w-3.5" />,
}

function CategoryItem({
  category,
  level = 0,
}: {
  category: Category
  level?: number
}) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [subCategories, setSubCategories] = useState<Category[]>([])
  const [isLoadingSubs, setIsLoadingSubs] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      setShowDeleteDialog(false)
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      })
    },
  })

  const restoreMutation = useMutation({
    mutationFn: restoreCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({
        title: "Success",
        description: "Category restored successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to restore category",
        variant: "destructive",
      })
    },
  })

  const handleToggle = async () => {
    if (!isOpen && subCategories.length === 0 && category.level !== "sub_sub") {
      setIsLoadingSubs(true)
      try {
        const subs =
          category.level === "main"
            ? await fetchSubCategories(category.id)
            : await fetchSubSubCategories(category.id)
        setSubCategories(subs)
      } catch (error) {
        console.error("Error loading sub-categories:", error)
      } finally {
        setIsLoadingSubs(false)
      }
    }
    setIsOpen(!isOpen)
  }

  const handleDelete = () => {
    deleteMutation.mutate(category.id)
  }

  const handleRestore = () => {
    restoreMutation.mutate(category.id)
  }

  const hasChildren = category.level !== "sub_sub"

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <div className="flex items-center gap-2 group">
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex-1 flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/50 transition-colors rounded-md",
                level > 0 && "ml-4"
              )}
            >
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )
              ) : (
                <span className="w-3.5" />
              )}
              
              <span className="flex-shrink-0 text-muted-foreground">
                {categoryLevelIcons[category.level]}
              </span>
              
              {/* Code and Name together */}
              <div className="flex items-baseline gap-2 flex-1 min-w-0">
                {category.code && (
                  <span className="text-[11px] font-mono text-muted-foreground font-medium">
                    {category.code}
                  </span>
                )}
                <span className="text-sm font-medium truncate">{category.name}</span>
              </div>

              {/* Status badges aligned to the right */}
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
                {category.categoryType && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize text-[10px] h-5 px-1.5",
                      categoryTypeColors[category.categoryType]
                    )}
                  >
                    {category.categoryType}
                  </Badge>
                )}
                {category.allowTransactions && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 bg-purple-50 text-purple-700 border-purple-200"
                  >
                    TX
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] h-5 px-1.5",
                    category.isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  )}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
                {category.deletedAt && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 bg-red-50 text-red-700 border-red-200"
                  >
                    Deleted
                  </Badge>
                )}
              </div>
            </button>
          </CollapsibleTrigger>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {category.deletedAt ? (
                <DropdownMenuItem
                  onClick={handleRestore}
                  disabled={restoreMutation.isPending}
                  className="text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-2" />
                  {restoreMutation.isPending ? "Restoring..." : "Restore"}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-xs text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Description on separate line if exists */}
        {category.description && (
          <div className={cn("px-3 pb-2 ml-8", level > 0 && "ml-12")}>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {category.description}
            </p>
          </div>
        )}
        
        {hasChildren && (
          <CollapsibleContent>
            {isLoadingSubs ? (
              <div className="ml-8 py-2 flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="text-xs">Loading...</span>
              </div>
            ) : subCategories.length > 0 ? (
              <div className="border-l-2 border-muted ml-5">
                {subCategories.map((sub) => (
                  <CategoryItem key={sub.id} category={sub} level={level + 1} />
                ))}
              </div>
            ) : (
              <div className="ml-8 py-2 text-xs text-muted-foreground">
                No sub-categories
              </div>
            )}
          </CollapsibleContent>
        )}
      </Collapsible>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{category.name}"? This action can be undone by restoring the category later.
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
  )
}

function CreateCategoryDialog() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreateCategoryDto>({
    code: "",
    name: "",
    description: "",
    level: "main",
    categoryType: null,
    sortOrder: 0,
  })

  const { data: mainCategories } = useQuery({
    queryKey: ["categories", "main"],
    queryFn: fetchMainCategories,
  })

  const [selectedMainId, setSelectedMainId] = useState<number | null>(null)
  const { data: subCategories } = useQuery({
    queryKey: ["categories", "sub", selectedMainId],
    queryFn: () => (selectedMainId ? fetchSubCategories(selectedMainId) : Promise.resolve([])),
    enabled: !!selectedMainId && formData.level === "sub_sub",
  })

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({
        title: "Success",
        description: "Category created successfully",
      })
      setOpen(false)
      setFormData({
        code: "",
        name: "",
        description: "",
        level: "main",
        categoryType: null,
        sortOrder: 0,
      })
      setSelectedMainId(null)
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          <span className="text-xs">Add Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="level" className="text-xs">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => {
                  setFormData({ ...formData, level: value as CategoryLevel, parentId: undefined })
                  setSelectedMainId(null)
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main" className="text-xs">Main Category</SelectItem>
                  <SelectItem value="sub" className="text-xs">Sub Category</SelectItem>
                  <SelectItem value="sub_sub" className="text-xs">Sub-Sub Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="categoryType" className="text-xs">Category Type</Label>
              <Select
                value={formData.categoryType || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryType: (value || null) as CategoryType })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset" className="text-xs">Asset</SelectItem>
                  <SelectItem value="liability" className="text-xs">Liability</SelectItem>
                  <SelectItem value="equity" className="text-xs">Equity</SelectItem>
                  <SelectItem value="income" className="text-xs">Income</SelectItem>
                  <SelectItem value="expense" className="text-xs">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.level !== "main" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Parent Main Category</Label>
              <Select
                value={selectedMainId?.toString() || ""}
                onValueChange={(value) => {
                  const id = parseInt(value)
                  setSelectedMainId(id)
                  if (formData.level === "sub") {
                    setFormData({ ...formData, parentId: id })
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select main category" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()} className="text-xs">
                      {cat.code ? `${cat.code} - ` : ""}{cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.level === "sub_sub" && selectedMainId && (
            <div className="space-y-1.5">
              <Label className="text-xs">Parent Sub Category</Label>
              <Select
                value={formData.parentId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, parentId: parseInt(value) })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()} className="text-xs">
                      {cat.code ? `${cat.code} - ` : ""}{cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-xs">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., 101"
                className="h-8 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sortOrder" className="text-xs">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                }
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Category name"
              className="h-8 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              rows={2}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              <span className="text-xs">Cancel</span>
            </Button>
            <Button type="submit" size="sm" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              <span className="text-xs">Create Category</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CategoryManagement() {
  const {
    data: mainCategories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", "main"],
    queryFn: fetchMainCategories,
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold">Account Categories</h2>
          <p className="text-xs text-muted-foreground">
            Manage your chart of accounts hierarchy
          </p>
        </div>
        <CreateCategoryDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <FolderTree className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{mainCategories?.length || 0}</p>
                <p className="text-[10px] text-muted-foreground">Main Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Tag className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {mainCategories?.filter((c) => c.categoryType === "asset").length || 0}
                </p>
                <p className="text-[10px] text-muted-foreground">Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-100 rounded-md">
                <Tag className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {mainCategories?.filter((c) => c.categoryType === "income").length || 0}
                </p>
                <p className="text-[10px] text-muted-foreground">Income</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-100 rounded-md">
                <Tag className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {mainCategories?.filter((c) => c.categoryType === "expense").length || 0}
                </p>
                <p className="text-[10px] text-muted-foreground">Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tree */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Category Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p className="text-sm">Failed to load categories</p>
              <p className="text-xs text-muted-foreground mt-1">
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
            <div className="text-center py-8 text-muted-foreground">
              <FolderTree className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No categories found</p>
              <p className="text-xs">Create your first category to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}