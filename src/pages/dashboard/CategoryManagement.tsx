import React, { useEffect, useMemo, useState } from "react";
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
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  CATEGORY_TYPES,
  useMainCategories,
  useSubCategories,
  useSubSubCategories,
  useNextCategoryCode,
  useNextMainCode,
  useCreateMainCategory,
  useCreateSubCategory,
  useCreateSubSubCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
  type CategoryLevel,
  type CategoryType,
  type UpdateCategoryDto,
} from "@/hooks/use-categories";

const categoryTypeColors: Record<string, string> = {
  asset: "bg-blue-100 text-blue-800 border-blue-200",
  liability: "bg-red-100 text-red-800 border-red-200",
  equity: "bg-green-100 text-green-800 border-green-200",
  revenue: "bg-emerald-100 text-emerald-800 border-emerald-200",
  expense: "bg-orange-100 text-orange-800 border-orange-200",
  cost_of_sales: "bg-amber-100 text-amber-800 border-amber-200",
};

const categoryLevelIcons: Record<CategoryLevel, React.ReactNode> = {
  main: <FolderTree className="h-3 w-3" />,
  sub: <Layers className="h-3 w-3" />,
  sub_sub: <Tag className="h-3 w-3" />,
};

const levelLabel: Record<CategoryLevel, string> = {
  main: "Main category",
  sub: "Sub category",
  sub_sub: "Sub-sub category",
};

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] text-amber-800">
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Create dialog
//  - fixedParent set   → "Add sub / sub-sub under this category"
//  - fixedParent unset → toolbar mode, pick level + parents
// Mounted only while open, so its state is always fresh.
// The code input is auto-filled with the next free code.
// ─────────────────────────────────────────────────────────────
function CategoryFormDialog({
  fixedParent,
  onClose,
  onCreated,
}: {
  fixedParent?: Category;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [pickedLevel, setPickedLevel] = useState<CategoryLevel>("main");
  const [mainId, setMainId] = useState<number | null>(null);
  const [subId, setSubId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [codeTouched, setCodeTouched] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>("asset");

  const level: CategoryLevel = fixedParent
    ? fixedParent.level === "main"
      ? "sub"
      : "sub_sub"
    : pickedLevel;
  const isMain = level === "main";

  const parentId = fixedParent
    ? fixedParent.id
    : level === "sub"
      ? mainId
      : level === "sub_sub"
        ? subId
        : null;

  // Parent pickers (toolbar mode): active parents only
  const { data: mainCategories } = useMainCategories();
  const { data: pickerSubCategories } = useSubCategories(
    mainId,
    !fixedParent && level === "sub_sub",
  );

  // All main categories incl. inactive, to list existing main codes
  const { data: allMains } = useMainCategories(true);

  // Suggested code for sub / sub-sub (by parent)
  const { data: nextChild, isFetching: childFetching } = useNextCategoryCode(
    isMain ? null : parentId,
  );

  // Suggested code for main (by type)
  const {
    data: nextMain,
    isFetching: mainFetching,
    isError: mainError,
  } = useNextMainCode(isMain ? categoryType : null);

  // Fallback when the endpoint fails: highest main code of this type + 1,
  // computed from the list already loaded (the server still validates it)
  const localMainSuggestion = useMemo(() => {
    const codes = (allMains ?? [])
      .filter((c) => c.categoryType === categoryType)
      .map((c) => parseInt(c.code ?? "", 10))
      .filter((n) => !isNaN(n));
    return codes.length ? String(Math.max(...codes) + 1) : undefined;
  }, [allMains, categoryType]);

  const suggestedCode = isMain
    ? (nextMain?.nextCode ?? (mainError ? localMainSuggestion : undefined))
    : nextChild?.nextCode;
  const suggestFetching = isMain ? mainFetching : childFetching;
  const canSuggest = isMain || !!parentId;

  // Existing siblings (incl. inactive), so the user sees what the
  // suggestion is based on
  const { data: siblingSubs } = useSubCategories(
    level === "sub" ? parentId : null,
    true,
    true,
  );
  const { data: siblingSubSubs } = useSubSubCategories(
    level === "sub_sub" ? parentId : null,
    true,
    true,
  );
  const siblingCodes = (
    isMain
      ? allMains?.filter((c) => c.categoryType === categoryType)
      : level === "sub"
        ? siblingSubs
        : siblingSubSubs
  )
    ?.map((c) => c.code)
    .filter(Boolean);

  // 1) Level, parent or main-type changed → clear and allow auto-fill again
  useEffect(() => {
    setCode("");
    setCodeTouched(false);
  }, [level, parentId, categoryType]);

  // 2) Fill with the suggestion once loaded, unless the user typed
  useEffect(() => {
    if (codeTouched || suggestFetching || !suggestedCode) return;
    setCode(suggestedCode);
  }, [level, parentId, codeTouched, suggestFetching, suggestedCode]);

  const createMain = useCreateMainCategory();
  const createSub = useCreateSubCategory();
  const createSubSub = useCreateSubSubCategory();
  const isPending =
    createMain.isPending || createSub.isPending || createSubSub.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const base = {
      name: name.trim(),
      description: description.trim() || undefined,
      sortOrder: sortOrder === "" ? undefined : Number(sortOrder),
    };
    // blank → backend auto-generates (sub / sub-sub)
    const trimmedCode = code.trim() || undefined;

    const options = {
      onSuccess: () => {
        toast.success(`${levelLabel[level]} created`);
        onCreated?.();
        onClose();
      },
      onError: (error: Error) =>
        toast.error(error.message || "Failed to create category"),
    };

    if (level === "main") {
      createMain.mutate(
        { ...base, code: trimmedCode as string, categoryType },
        options,
      );
    } else if (level === "sub") {
      createSub.mutate(
        { ...base, code: trimmedCode, mainCategoryId: parentId as number },
        options,
      );
    } else {
      createSubSub.mutate(
        { ...base, code: trimmedCode, subCategoryId: parentId as number },
        options,
      );
    }
  };

  const canSubmit =
    !isPending &&
    name.trim().length >= 2 &&
    (isMain ? !!code.trim() : !!parentId);

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {fixedParent
              ? `Add ${levelLabel[level].toLowerCase()} under ${fixedParent.name}`
              : "Create New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {!fixedParent && (
            <>
              <div className="space-y-1">
                <Label className="text-[11px]">Level</Label>
                <Select
                  value={pickedLevel}
                  onValueChange={(v) => {
                    setPickedLevel(v as CategoryLevel);
                    setMainId(null);
                    setSubId(null);
                  }}
                >
                  <SelectTrigger className="h-7 text-[11px]">
                    <SelectValue />
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

              {!isMain && (
                <div className="space-y-1">
                  <Label className="text-[11px]">Parent main category</Label>
                  <Select
                    value={mainId?.toString() ?? ""}
                    onValueChange={(v) => {
                      setMainId(parseInt(v));
                      setSubId(null);
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
                          {cat.code} - {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {level === "sub_sub" && mainId && (
                <div className="space-y-1">
                  <Label className="text-[11px]">Parent sub category</Label>
                  <Select
                    value={subId?.toString() ?? ""}
                    onValueChange={(v) => setSubId(parseInt(v))}
                  >
                    <SelectTrigger className="h-7 text-[11px]">
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {pickerSubCategories?.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id.toString()}
                          className="text-[11px]"
                        >
                          {cat.code} - {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {fixedParent && (
            <p className="text-[10px] text-muted-foreground">
              Parent: {fixedParent.code} - {fixedParent.name}. The category type
              is inherited from the parent.
            </p>
          )}

          {isMain && (
            <div className="space-y-1">
              <Label className="text-[11px]">Category type</Label>
              <Select
                value={categoryType}
                onValueChange={(v) => setCategoryType(v as CategoryType)}
              >
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_TYPES.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className="text-[11px]"
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label htmlFor="code" className="text-[11px]">
                Code (auto-suggested)
              </Label>
              <div className="relative">
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
                    setCodeTouched(true);
                  }}
                  placeholder={
                    !canSuggest
                      ? "Select parent first"
                      : suggestFetching
                        ? "Generating..."
                        : "Enter a code"
                  }
                  className="h-7 text-[11px] pr-7"
                  required={isMain}
                />
                {suggestFetching && canSuggest && (
                  <Loader2 className="absolute right-2 top-1.5 h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </div>

              {suggestedCode && code !== suggestedCode && (
                <button
                  type="button"
                  className="text-[10px] text-primary hover:underline"
                  onClick={() => {
                    setCode(suggestedCode);
                    setCodeTouched(false);
                  }}
                >
                  Use suggested: {suggestedCode}
                </button>
              )}

              {!!siblingCodes?.length && (
                <p className="text-[10px] text-muted-foreground">
                  Existing{isMain ? ` ${categoryType.replace("_", " ")}` : ""}:{" "}
                  {siblingCodes.join(", ")}
                </p>
              )}

              {isMain && mainError && (
                <p className="text-[10px] text-amber-700">
                  Couldn't load the server suggestion; showing a local
                  estimate.
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="sortOrder" className="text-[11px]">
                Sort order (optional)
              </Label>
              <Input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="Defaults to code"
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              onClick={onClose}
            >
              <span className="text-[11px]">Cancel</span>
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-7 px-2.5"
              disabled={!canSubmit}
            >
              {isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              <span className="text-[11px]">Create</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Edit dialog (main / sub / sub-sub)
// ─────────────────────────────────────────────────────────────
function EditCategoryDialog({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [code, setCode] = useState(category.code ?? "");
  const [sortOrder, setSortOrder] = useState(String(category.sortOrder));
  const [categoryType, setCategoryType] = useState<CategoryType | null>(
    category.categoryType,
  );
  const [isActive, setIsActive] = useState(category.isActive);

  const updateMutation = useUpdateCategory();

  const hasChildren = category.level !== "sub_sub";
  const codeChanged = code.trim() !== "" && code.trim() !== category.code;
  const typeChanged =
    category.level === "main" &&
    categoryType !== null &&
    categoryType !== category.categoryType;
  const deactivating = category.isActive && !isActive;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Send only what actually changed
    const dto: UpdateCategoryDto = {};
    if (name.trim() !== category.name) dto.name = name.trim();
    if (description.trim() !== (category.description ?? ""))
      dto.description = description.trim();
    if (codeChanged) dto.code = code.trim();
    if (sortOrder !== "" && Number(sortOrder) !== category.sortOrder)
      dto.sortOrder = Number(sortOrder);
    if (typeChanged && categoryType) dto.categoryType = categoryType;
    if (isActive !== category.isActive) dto.isActive = isActive;

    if (Object.keys(dto).length === 0) {
      toast.info("No changes to save");
      onClose();
      return;
    }

    updateMutation.mutate(
      { id: category.id, data: dto },
      {
        onSuccess: () => {
          toast.success("Category updated");
          onClose();
        },
        onError: (error: Error) =>
          toast.error(error.message || "Failed to update category"),
      },
    );
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">
            Edit {levelLabel[category.level].toLowerCase()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label htmlFor="edit-code" className="text-[11px]">
                Code
              </Label>
              <Input
                id="edit-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="h-7 text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-sort" className="text-[11px]">
                Sort order
              </Label>
              <Input
                id="edit-sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-7 text-[11px]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-name" className="text-[11px]">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-7 text-[11px]"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-desc" className="text-[11px]">
              Description
            </Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="text-[11px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {category.level === "main" && (
              <div className="space-y-1">
                <Label className="text-[11px]">Category type</Label>
                <Select
                  value={categoryType ?? ""}
                  onValueChange={(v) => setCategoryType(v as CategoryType)}
                >
                  <SelectTrigger className="h-7 text-[11px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_TYPES.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="text-[11px]"
                      >
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-[11px]">Status</Label>
              <Select
                value={isActive ? "active" : "inactive"}
                onValueChange={(v) => setIsActive(v === "active")}
              >
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-[11px]">
                    Active
                  </SelectItem>
                  <SelectItem value="inactive" className="text-[11px]">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {codeChanged && hasChildren && (
            <Warning>
              The codes of all sub-categories under this category will be
              updated to match the new code.
            </Warning>
          )}
          {typeChanged && (
            <Warning>
              This changes the type of every sub-category and will restate past
              income statements and balance sheets.
            </Warning>
          )}
          {deactivating && (
            <Warning>
              Inactive categories cannot be used for new transactions
              {hasChildren && ", and all sub-categories will be deactivated too"}
              .
            </Warning>
          )}

          <div className="flex justify-end gap-2 pt-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5"
              onClick={onClose}
            >
              <span className="text-[11px]">Cancel</span>
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-7 px-2.5"
              disabled={updateMutation.isPending || name.trim().length < 2}
            >
              {updateMutation.isPending && (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              )}
              <span className="text-[11px]">Save changes</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Tree row
// ─────────────────────────────────────────────────────────────
function CategoryItem({
  category,
  level = 0,
}: {
  category: Category;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const deleteMutation = useDeleteCategory();

  const isMain = category.level === "main";
  const isSub = category.level === "sub";
  const hasChildren = category.level !== "sub_sub";

  // Children come from react-query, so edits / adds / deletes refresh them
  const subsQuery = useSubCategories(isMain ? category.id : null, isOpen, true);
  const subSubsQuery = useSubSubCategories(
    isSub ? category.id : null,
    isOpen,
    true,
  );
  const childQuery = isMain ? subsQuery : subSubsQuery;
  const children = childQuery.data ?? [];

  const handleDelete = () => {
    deleteMutation.mutate(category.id, {
      onSuccess: () => {
        toast.success("Category deleted");
        setShowDelete(false);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to delete category");
        setShowDelete(false);
      },
    });
  };

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-1.5 group">
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex-1 flex items-center gap-1.5 px-2.5 py-1.5 text-left hover:bg-muted/50 transition-colors rounded-md",
                level > 0 && "ml-4",
                !category.isActive && "opacity-60",
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
                    {category.categoryType.replace("_", " ")}
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
              </div>
            </button>
          </CollapsibleTrigger>

          {/* modal={false} avoids the "frozen page" bug when a dialog opens from a menu item */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setShowEdit(true)}
                className="text-[11px]"
              >
                <Pencil className="h-3 w-3 mr-2" />
                Edit
              </DropdownMenuItem>
              {hasChildren && (
                <DropdownMenuItem
                  onClick={() => setShowAdd(true)}
                  className="text-[11px]"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {isMain ? "Add sub category" : "Add sub-sub category"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setShowDelete(true)}
                className="text-[11px] text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </DropdownMenuItem>
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
            {childQuery.isLoading ? (
              <div className="ml-7 py-1.5 flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-[11px]">Loading...</span>
              </div>
            ) : children.length > 0 ? (
              <div className="border-l-2 border-muted ml-4">
                {children.map((child) => (
                  <CategoryItem
                    key={child.id}
                    category={child}
                    level={level + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="ml-7 py-1.5 text-[11px] text-muted-foreground">
                No {isMain ? "sub-categories" : "sub-sub categories"} yet
              </div>
            )}
          </CollapsibleContent>
        )}
      </Collapsible>

      {showEdit && (
        <EditCategoryDialog
          category={category}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showAdd && (
        <CategoryFormDialog
          fixedParent={category}
          onClose={() => setShowAdd(false)}
          onCreated={() => setIsOpen(true)}
        />
      )}

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category</AlertDialogTitle>
            <AlertDialogDescription>
              Delete "{category.name}"? Categories that have sub-categories or
              transactions can't be deleted; deactivate them instead.
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

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
function StatCard({
  icon,
  tint,
  value,
  label,
}: {
  icon: React.ReactNode;
  tint: string;
  value: number;
  label: string;
}) {
  return (
    <Card>
      <CardContent className="pt-3 pb-2.5 px-3">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md", tint)}>{icon}</div>
          <div>
            <p className="text-base font-bold">{value}</p>
            <p className="text-[9px] text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryManagement() {
  const [showCreate, setShowCreate] = useState(false);
  // include inactive so deactivated categories can be found and reactivated
  const { data: mainCategories, isLoading, error } = useMainCategories(true);

  const countType = (t: CategoryType) =>
    mainCategories?.filter((c) => c.categoryType === t).length ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold">Account Categories</h2>
          <p className="text-[11px] text-muted-foreground">
            Manage your chart of accounts hierarchy
          </p>
        </div>
        <Button
          size="sm"
          className="h-7 px-2.5"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          <span className="text-[11px]">Add Category</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
        <StatCard
          icon={<FolderTree className="h-3.5 w-3.5 text-primary" />}
          tint="bg-primary/10"
          value={mainCategories?.length ?? 0}
          label="Main Categories"
        />
        <StatCard
          icon={<Tag className="h-3.5 w-3.5 text-blue-600" />}
          tint="bg-blue-100"
          value={countType("asset")}
          label="Assets"
        />
        <StatCard
          icon={<Tag className="h-3.5 w-3.5 text-emerald-600" />}
          tint="bg-emerald-100"
          value={countType("revenue")}
          label="Revenue"
        />
        <StatCard
          icon={<Tag className="h-3.5 w-3.5 text-orange-600" />}
          tint="bg-orange-100"
          value={countType("expense")}
          label="Expenses"
        />
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

      {showCreate && <CategoryFormDialog onClose={() => setShowCreate(false)} />}
    </div>
  );
}

export default CategoryManagement;
