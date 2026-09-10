import { Star, MapPin, Clock, Banknote, Shield, Phone, Building2, User, X, Languages, Calendar, Briefcase } from 'lucide-react';
import { Worker, EXPERIENCE_LEVELS } from '@/types/worker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface WorkerDetailModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
}

const getExperienceLabel = (value: string): string => {
  return EXPERIENCE_LEVELS.find(l => l.value === value)?.label || value;
};

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const WorkerDetailModal = ({ worker, isOpen, onClose }: WorkerDetailModalProps) => {
  if (!worker) return null;

  const experienceLabel = getExperienceLabel(worker.experience);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Worker Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            {worker.photo ? (
              <img
                src={worker.photo}
                alt={`${worker.firstName} ${worker.lastName}`}
                className="h-20 w-20 rounded-xl object-cover ring-2 ring-border"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 ring-2 ring-border">
                <span className="text-2xl font-semibold text-primary">
                  {getInitials(worker.firstName, worker.lastName)}
                </span>
              </div>
            )}
            {/* Availability Dot */}
            <div className={cn(
              "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card",
              worker.isAvailable ? "bg-success" : "bg-destructive"
            )} />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {worker.firstName} {worker.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {worker.type === 'company' ? worker.companyName : 'Freelance Worker'}
            </p>

            {/* Rating */}
            {worker.rating > 0 && (
              <div className="mt-2 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(worker.rating) 
                        ? "fill-rating-star text-rating-star" 
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-foreground">
                  {worker.rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({worker.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className={cn(
                  worker.isAvailable 
                    ? "border-success/40 bg-success/10 text-success" 
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                )}
              >
                {worker.isAvailable ? 'Available' : 'Currently Employed'}
              </Badge>
              {worker.hasInsurance && (
                <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
                  <Shield className="mr-1 h-3 w-3" />
                  Insured
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender & Age</p>
              <p className="text-sm font-medium text-foreground">
                {worker.gender === 'male' ? 'Male' : 'Female'}, {worker.age} years
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">
                {worker.district}, {worker.sector}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Experience</p>
              <p className="text-sm font-medium text-foreground">{experienceLabel}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expected Salary</p>
              <p className="text-sm font-medium text-foreground">
                {worker.salaryMin.toLocaleString()} - {worker.salaryMax.toLocaleString()} RWF
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Languages className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Languages</p>
              <p className="text-sm font-medium text-foreground">
                {worker.languages.join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Work Type</p>
              <p className="text-sm font-medium text-foreground capitalize">
                {worker.workTypes.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Worker Type Section */}
        {worker.type === 'company' && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                Company Registered Worker
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                This worker is registered under <strong>{worker.companyName}</strong>. 
                To hire, you'll need to send a request to the company.
              </p>
            </div>
          </>
        )}

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          {worker.type === 'freelance' ? (
            <Button className="flex-1 gap-2">
              <Phone className="h-4 w-4" />
              View Contact
            </Button>
          ) : (
            <Button className="flex-1 gap-2">
              <Building2 className="h-4 w-4" />
              Request Worker
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
