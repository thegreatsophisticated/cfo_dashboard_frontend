// app/dashboard/transactions/transaction-management/components/TransactionSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="shadow-sm border-gray-200">
          <CardContent className="p-3">
            <Skeleton className="h-3 w-20 mb-2 bg-gray-200" />
            <Skeleton className="h-6 w-24 bg-gray-300" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TransactionFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-gray-200" />
          <Skeleton className="h-9 w-full bg-gray-200" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-gray-200" />
          <Skeleton className="h-9 w-full bg-gray-200" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-gray-200" />
          <Skeleton className="h-9 w-full bg-gray-200" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-gray-200" />
          <Skeleton className="h-9 w-full bg-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-gray-200" />
        <Skeleton className="h-20 w-full bg-gray-200" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-7 w-32 bg-gray-300" />
        <Skeleton className="h-7 w-24 bg-gray-200" />
      </div>
    </div>
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="shadow-sm border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-32 bg-gray-300" />
                  <Skeleton className="h-2 w-24 bg-gray-200" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20 bg-gray-300" />
                <Skeleton className="h-6 w-6 bg-gray-200" />
                <Skeleton className="h-6 w-6 bg-gray-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function RecurringTransactionSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="shadow-sm border-l-4 border-l-gray-300 border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-24 bg-gray-300" />
                    <Skeleton className="h-4 w-16 bg-gray-200" />
                  </div>
                  <Skeleton className="h-2 w-20 bg-gray-200" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16 bg-gray-300" />
                <Skeleton className="h-6 w-16 bg-gray-200" />
                <Skeleton className="h-6 w-6 bg-gray-200" />
                <Skeleton className="h-6 w-6 bg-gray-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
