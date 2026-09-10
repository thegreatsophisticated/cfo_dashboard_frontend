import { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LeafCategory } from "@/types/transaction-management-types";

interface CategorySelectProps {
  value?: number;
  onValueChange: (value: number) => void;
  categories: LeafCategory[];
  categoriesByType: Record<string, LeafCategory[]>;
  getCategoryDisplayName: (category: LeafCategory) => string;
  placeholder?: string;
  className?: string;
}

export function CategorySelect({
  value,
  onValueChange,
  categoriesByType,
  getCategoryDisplayName,
  placeholder = "Search category...",
  className,
}: CategorySelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => {
    for (const list of Object.values(categoriesByType)) {
      const match = list.find((c) => c.id === value);
      if (match) return match;
    }
    return null;
  }, [categoriesByType, value]);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const entries = Object.entries(categoriesByType);
    return entries
      .map(([type, list]) => ({
        type,
        items: q
          ? list.filter((c) => getCategoryDisplayName(c).toLowerCase().includes(q))
          : list,
      }))
      .filter((g) => g.items.length > 0);
  }, [categoriesByType, query, getCategoryDisplayName]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <Input
        value={open ? query : selected ? getCategoryDisplayName(selected) : ""}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="h-8 text-xs"
      />
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-md border bg-popover shadow-md">
          {filteredGroups.length === 0 && (
            <p className="px-2 py-2 text-xs text-muted-foreground">No categories found</p>
          )}
          {filteredGroups.map((group) => (
            <div key={group.type}>
              <p className="px-2 pt-2 pb-1 text-[9px] font-semibold uppercase text-muted-foreground">
                {group.type}
              </p>
              {group.items.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onValueChange(cat.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-2 py-1.5 text-xs hover:bg-muted",
                    cat.id === value && "bg-muted font-medium"
                  )}
                >
                  {getCategoryDisplayName(cat)}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
