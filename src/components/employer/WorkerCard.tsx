import { Star, MapPin, Clock, Banknote, Shield, Bookmark, Building2, User } from 'lucide-react';
import { Worker, EXPERIENCE_LEVELS } from '@/types/worker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WorkerCardProps {
  worker: Worker;
  onViewDetails: (worker: Worker) => void;
  onBookmark?: (worker: Worker) => void;
  isBookmarked?: boolean;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

const getExperienceLabel = (value: string): string => {
  return EXPERIENCE_LEVELS.find(l => l.value === value)?.label || value;
};

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const WorkerCard = ({ worker, onViewDetails, onBookmark, isBookmarked }: WorkerCardProps) => {
  const experienceLabel = getExperienceLabel(worker.experience);

  return (
    <div className={cn(
      "group relative bg-card rounded-lg border border-border p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary/30 animate-fade-in",
      !worker.isAvailable && "opacity-75"
    )}>
      {/* Time Badge */}
      <div className="absolute top-4 left-5">
        <span className="text-xs font-medium text-primary">{formatTimeAgo(worker.registeredAt)}</span>
      </div>

      {/* Bookmark Button */}
      <button
        onClick={() => onBookmark?.(worker)}
        className={cn(
          "absolute top-4 right-4 p-1.5 rounded-md transition-colors",
          isBookmarked 
            ? "text-primary bg-primary/10" 
            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
        )}
      >
        <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
      </button>

      {/* Main Content */}
      <div className="mt-6 flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {worker.photo ? (
            <img
              src={worker.photo}
              alt={`${worker.firstName} ${worker.lastName}`}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/40 ring-2 ring-border">
              <span className="text-lg font-semibold text-primary">
                {getInitials(worker.firstName, worker.lastName)}
              </span>
            </div>
          )}
          {/* Availability Dot */}
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card",
            worker.isAvailable ? "bg-success" : "bg-destructive"
          )} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {worker.firstName} {worker.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {worker.type === 'company' ? worker.companyName : 'Freelance Worker'}
              </p>
            </div>
          </div>

          {/* Rating */}
          {worker.rating > 0 && (
            <div className="mt-1 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(worker.rating) 
                      ? "fill-rating-star text-rating-star" 
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">
                ({worker.reviewCount})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          <User className="mr-1 h-3 w-3" />
          {worker.gender === 'male' ? 'Male' : 'Female'}, {worker.age}
        </Badge>
        
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs",
            worker.type === 'company' 
              ? "border-primary/40 bg-primary/5 text-primary" 
              : "border-badge-freelance/40 bg-badge-freelance/5 text-badge-freelance"
          )}
        >
          {worker.type === 'company' ? (
            <Building2 className="mr-1 h-3 w-3" />
          ) : (
            <User className="mr-1 h-3 w-3" />
          )}
          {worker.type === 'company' ? 'Company' : 'Freelance'}
        </Badge>

        {worker.hasInsurance && (
          <Badge variant="outline" className="text-xs border-success/40 bg-success/5 text-success">
            <Shield className="mr-1 h-3 w-3" />
            Insured
          </Badge>
        )}
      </div>

      {/* Details Row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{experienceLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <Banknote className="h-3.5 w-3.5" />
          <span>{worker.salaryMin.toLocaleString()} - {worker.salaryMax.toLocaleString()} RWF</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>{worker.district}, {worker.sector}</span>
        </div>
      </div>

      {/* Languages */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {worker.languages.map((lang) => (
          <span 
            key={lang} 
            className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
          >
            {lang}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {!worker.isAvailable && (
            <Badge variant="outline" className="text-xs border-destructive/40 text-destructive">
              Currently Employed
            </Badge>
          )}
        </div>
        <Button 
          size="sm" 
          onClick={() => onViewDetails(worker)}
          className="transition-transform hover:scale-105"
        >
          {worker.type === 'company' ? 'Request Worker' : 'View Details'}
        </Button>
      </div>
    </div>
  );
};
