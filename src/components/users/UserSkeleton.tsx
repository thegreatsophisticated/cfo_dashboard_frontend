function Bar({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function UserTableSkeleton() {
  return (
    <div className="space-y-3">
      <Bar className="h-14" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bar key={i} className="h-12" />
        ))}
      </div>
    </div>
  );
}

export function UserFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bar key={i} className="h-8" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bar key={i} className="h-8" />
        ))}
      </div>
    </div>
  );
}
