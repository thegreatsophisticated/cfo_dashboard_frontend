import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, Users, LayoutGrid, List } from 'lucide-react';
import { Worker } from '@/types/worker';
import { WorkerCard } from './WorkerCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface WorkerSearchResultsProps {
  workers: Worker[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewDetails: (worker: Worker) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const WorkerSearchResults = ({
  workers,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onViewDetails,
  sortBy,
  onSortChange,
}: WorkerSearchResultsProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const handleBookmark = (worker: Worker) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(worker.id)) {
        next.delete(worker.id);
      } else {
        next.add(worker.id);
      }
      return next;
    });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
            i === currentPage
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground"
          )}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{startIndex}-{endIndex}</span> of{' '}
            <span className="font-semibold text-foreground">{totalCount}</span> workers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center rounded-lg border border-border p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                viewMode === 'list' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                viewMode === 'grid' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="salary-low">Salary: Low to High</SelectItem>
              <SelectItem value="salary-high">Salary: High to Low</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {workers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16">
          <Users className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No Workers Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search filters to find more workers.
          </p>
        </div>
      ) : (
        <div className={cn(
          "gap-4",
          viewMode === 'grid' 
            ? "grid grid-cols-1 lg:grid-cols-2" 
            : "flex flex-col"
        )}>
          {workers.map((worker, index) => (
            <div 
              key={worker.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <WorkerCard
                worker={worker}
                onViewDetails={onViewDetails}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedIds.has(worker.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {renderPaginationButtons()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
