import React, { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { LeafCategory } from "../types";

interface CategorySelectProps {
  value?: number;
  onValueChange: (value: number) => void;
  categories: LeafCategory[];
  categoriesByType: Record<string, LeafCategory[]>;
  getCategoryDisplayName: (category: LeafCategory) => string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  categories,
  categoriesByType,
  getCategoryDisplayName,
  placeholder = "Select category",
  className,
  disabled = false,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);

  // Find selected category
  const selectedCategory = categories.find((cat) => cat.id === value);

  // Get display text for selected category
  const getSelectedText = () => {
    if (!selectedCategory) return placeholder;
    return getCategoryDisplayName(selectedCategory);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-8 justify-between text-xs font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate flex-1 text-left">
            {selectedCategory && (
              <span className="text-[10px] text-muted-foreground mr-1.5">
                {selectedCategory.code}
              </span>
            )}
            <span className="truncate">{getSelectedText()}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-3 w-3 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search categories..."
              className="h-8 text-xs"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
              No category found.
            </CommandEmpty>
            {Object.entries(categoriesByType).map(([type, cats]) => (
              <CommandGroup
                key={type}
                heading={
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase">
                      {type.replace("_", " ")}
                    </span>
                    <Badge
                      variant="secondary"
                      className="h-4 px-1 text-[9px] font-normal"
                    >
                      {cats.length}
                    </Badge>
                  </div>
                }
              >
                {cats.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={`${category.code} ${getCategoryDisplayName(category)} ${category.id}`}
                    onSelect={() => {
                      onValueChange(category.id);
                      setOpen(false);
                    }}
                    className="text-xs"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        value === category.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1 truncate">
                      <span className="text-[10px] text-muted-foreground mr-1.5 font-mono">
                        {category.code}
                      </span>
                      <span className="truncate">
                        {getCategoryDisplayName(category)}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}