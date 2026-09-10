import { formatDistanceToNow } from 'date-fns';
import { User, Clock, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HiringRequest } from '@/types/company';

interface MobileRequestCardProps {
  request: HiringRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (request: HiringRequest) => void;
}

export const MobileRequestCard = ({ request, onApprove, onReject, onView }: MobileRequestCardProps) => {
  const getStatusBadge = (status: HiringRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px]">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-[10px]">Rejected</Badge>;
      case 'completed':
        return <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">Completed</Badge>;
    }
  };

  return (
    <Card className="border-border/50 bg-card/90 backdrop-blur-sm transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{request.workerName}</p>
              <p className="text-xs text-muted-foreground">for {request.employerName}</p>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(request.requestedAt, { addSuffix: true })}
          </div>
          <Badge variant="outline" className="text-[10px]">
            {request.workType.replace('-', ' ')}
          </Badge>
        </div>

        <div className="mt-2 text-sm font-medium text-foreground">
          {request.proposedSalary.toLocaleString()} RWF/mo
        </div>

        {request.message && (
          <p className="mt-2 line-clamp-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
            {request.message}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 flex-1 text-xs" onClick={() => onView(request)}>
            <Eye className="mr-1 h-3 w-3" /> Details
          </Button>
          {request.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="h-8 flex-1 bg-emerald-600 text-xs hover:bg-emerald-700"
                onClick={() => onApprove(request.id)}
              >
                <Check className="mr-1 h-3 w-3" /> Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs"
                onClick={() => onReject(request.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
