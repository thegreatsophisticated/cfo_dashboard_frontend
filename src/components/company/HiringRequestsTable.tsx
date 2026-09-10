import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, Clock, Phone, Mail, MapPin, Check, X, Eye, MessageSquare } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HiringRequest } from '@/types/company';
import { useToast } from '@/hooks/use-toast';

interface HiringRequestsTableProps {
  requests: HiringRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const HiringRequestsTable = ({
  requests,
  onApprove,
  onReject,
}: HiringRequestsTableProps) => {
  const [selectedRequest, setSelectedRequest] = useState<HiringRequest | null>(null);
  const { toast } = useToast();

  const getStatusBadge = (status: HiringRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/30">Rejected</Badge>;
      case 'completed':
        return <Badge className="bg-primary/10 text-primary border-primary/30">Completed</Badge>;
    }
  };

  const getWorkTypeBadge = (workType: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-blue-500/10 text-blue-600 border-blue-500/30',
      'part-time': 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      'live-in': 'bg-teal-500/10 text-teal-600 border-teal-500/30',
    };
    return colors[workType] || '';
  };

  const handleApprove = (requestId: string) => {
    onApprove(requestId);
    toast({
      title: 'Request Approved',
      description: 'The hiring request has been approved successfully.',
    });
  };

  const handleReject = (requestId: string) => {
    onReject(requestId);
    toast({
      title: 'Request Rejected',
      description: 'The hiring request has been rejected.',
    });
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Work Type</TableHead>
              <TableHead>Proposed Salary</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{request.workerName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{request.employerName}</p>
                    <p className="text-sm text-muted-foreground">{request.employerPhone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getWorkTypeBadge(request.workType)}>
                    {request.workType.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{request.proposedSalary.toLocaleString()} RWF</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDistanceToNow(request.requestedAt, { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Request Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Hiring Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Worker Info */}
              <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedRequest.workerName}</p>
                  <p className="text-sm text-muted-foreground">Requested Worker</p>
                </div>
              </div>

              {/* Employer Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Employer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRequest.employerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRequest.employerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRequest.employerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRequest.employerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Request Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Work Type</p>
                    <Badge className={getWorkTypeBadge(selectedRequest.workType)}>
                      {selectedRequest.workType.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Proposed Salary</p>
                    <p className="font-medium">{selectedRequest.proposedSalary.toLocaleString()} RWF</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedRequest.message && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </h4>
                  <p className="text-sm text-muted-foreground rounded-lg bg-muted p-3">
                    {selectedRequest.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
