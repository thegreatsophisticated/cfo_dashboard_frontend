import { Worker } from './worker';

export interface Company {
  id: string;
  name: string;
  tin: string;
  logo?: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  isVerified: boolean;
  registeredAt: Date;
  subscriptionFee: number;
  salaryDeductionPercent: number;
}

export interface HiringRequest {
  id: string;
  workerId: string;
  workerName: string;
  workerPhoto: string;
  employerId: string;
  employerName: string;
  employerPhone: string;
  employerEmail: string;
  employerAddress: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  message?: string;
  proposedSalary: number;
  workType: 'full-time' | 'part-time' | 'live-in';
}

export interface CompanyWorker extends Worker {
  status: 'available' | 'assigned' | 'inactive';
  assignedTo?: string;
  assignedDate?: Date;
  monthlyEarnings: number;
}

export interface RevenueData {
  month: string;
  subscriptions: number;
  registrations: number;
  total: number;
}

export interface CompanyStats {
  totalWorkers: number;
  availableWorkers: number;
  assignedWorkers: number;
  pendingRequests: number;
  monthlyRevenue: number;
  totalRevenue: number;
}
