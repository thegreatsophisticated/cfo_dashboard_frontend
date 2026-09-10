import { useState } from 'react';
import { User, Star, MapPin, Phone, MoreVertical, Eye, Edit, Trash2, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CompanyWorker } from '@/types/company';
import { EXPERIENCE_LEVELS } from '@/types/worker';

interface CompanyWorkersListProps {
  workers: CompanyWorker[];
  onViewDetails: (worker: CompanyWorker) => void;
}

export const CompanyWorkersList = ({ workers, onViewDetails }: CompanyWorkersListProps) => {
  const getStatusBadge = (status: CompanyWorker['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Available</Badge>;
      case 'assigned':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Assigned</Badge>;
      case 'inactive':
        return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
    }
  };

  const getExperienceLabel = (exp: string) => {
    return EXPERIENCE_LEVELS.find((e) => e.value === exp)?.label || exp;
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Worker</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Salary Range</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker) => (
            <TableRow key={worker.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {worker.firstName} {worker.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {worker.gender === 'female' ? 'Female' : 'Male'}, {worker.age} years
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {worker.district}, {worker.sector}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{getExperienceLabel(worker.experience)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {worker.salaryMin.toLocaleString()} - {worker.salaryMax.toLocaleString()} RWF
                </span>
              </TableCell>
              <TableCell>
                {worker.rating > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{worker.rating}</span>
                    <span className="text-xs text-muted-foreground">({worker.reviewCount})</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No reviews</span>
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {getStatusBadge(worker.status)}
                  {worker.status === 'assigned' && worker.assignedTo && (
                    <p className="text-xs text-muted-foreground">to {worker.assignedTo}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(worker)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    {worker.status === 'assigned' && (
                      <DropdownMenuItem>
                        <UserMinus className="mr-2 h-4 w-4" />
                        End Assignment
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Worker
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
