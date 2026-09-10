import { User, Star, MapPin, MoreVertical, Eye, Edit, Trash2, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CompanyWorker } from '@/types/company';
import { EXPERIENCE_LEVELS } from '@/types/worker';

interface MobileWorkerCardProps {
  worker: CompanyWorker;
  onViewDetails: (worker: CompanyWorker) => void;
}

export const MobileWorkerCard = ({ worker, onViewDetails }: MobileWorkerCardProps) => {
  const getStatusBadge = (status: CompanyWorker['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">Available</Badge>;
      case 'assigned':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">Assigned</Badge>;
      case 'inactive':
        return <Badge className="bg-muted text-muted-foreground text-[10px]">Inactive</Badge>;
    }
  };

  const getExperienceLabel = (exp: string) =>
    EXPERIENCE_LEVELS.find((e) => e.value === exp)?.label || exp;

  return (
    <Card className="border-border/50 bg-card/90 backdrop-blur-sm transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {worker.firstName} {worker.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {worker.gender === 'female' ? 'Female' : 'Male'}, {worker.age}y
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getStatusBadge(worker.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(worker)}>
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                {worker.status === 'assigned' && (
                  <DropdownMenuItem>
                    <UserMinus className="mr-2 h-4 w-4" /> End Assignment
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{worker.district}</span>
          </div>
          <div className="text-right text-muted-foreground">
            {getExperienceLabel(worker.experience)}
          </div>
          <div className="text-muted-foreground">
            {worker.salaryMin.toLocaleString()}–{worker.salaryMax.toLocaleString()} RWF
          </div>
          <div className="flex items-center justify-end gap-1">
            {worker.rating > 0 ? (
              <>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">{worker.rating}</span>
                <span className="text-muted-foreground">({worker.reviewCount})</span>
              </>
            ) : (
              <span className="text-muted-foreground">No reviews</span>
            )}
          </div>
        </div>

        {worker.status === 'assigned' && worker.assignedTo && (
          <p className="mt-2 rounded-md bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground">
            Assigned to <span className="font-medium text-foreground">{worker.assignedTo}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
