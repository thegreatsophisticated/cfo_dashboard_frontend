function Bar({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function TransactionStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <Bar key={i} className="h-[72px]" />
      ))}
    </div>
  );
}

export function TransactionFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bar key={i} className="h-8" />
        ))}
      </div>
      <Bar className="h-20" />
    </div>
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Bar key={i} className="h-[88px]" />
      ))}
    </div>
  );
}

export function RecurringTransactionSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Bar key={i} className="h-[76px]" />
      ))}
    </div>
  );
}
