// app/dashboard/users/components/UserSkeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function UserStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="shadow-sm border-gray-200">
          <CardContent className="p-3">
            <Skeleton className="h-3 w-24 mb-2 bg-gray-200" />
            <Skeleton className="h-6 w-16 bg-gray-300" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function UserTableSkeleton() {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 bg-gray-300" />
            <Skeleton className="h-2 w-48 bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-48 bg-gray-200" />
            <Skeleton className="h-8 w-24 bg-gray-300" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-200">
              <TableHead className="text-[11px] h-8">
                <Skeleton className="h-3 w-16 bg-gray-200" />
              </TableHead>
              <TableHead className="text-[11px] h-8">
                <Skeleton className="h-3 w-16 bg-gray-200" />
              </TableHead>
              <TableHead className="text-[11px] h-8">
                <Skeleton className="h-3 w-20 bg-gray-200" />
              </TableHead>
              <TableHead className="text-[11px] h-8">
                <Skeleton className="h-3 w-12 bg-gray-200" />
              </TableHead>
              <TableHead className="text-right text-[11px] h-8">
                <Skeleton className="h-3 w-12 bg-gray-200 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} className="border-gray-100">
                <TableCell className="py-2">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24 bg-gray-300" />
                      <Skeleton className="h-2 w-12 bg-gray-200" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-28 bg-gray-200" />
                    <Skeleton className="h-2 w-20 bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <Skeleton className="h-5 w-16 bg-gray-200 rounded" />
                </TableCell>
                <TableCell className="py-2">
                  <Skeleton className="h-3 w-20 bg-gray-200" />
                </TableCell>
                <TableCell className="text-right py-2">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="h-7 w-7 bg-gray-200" />
                    <Skeleton className="h-7 w-7 bg-gray-200" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function UserFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-3 w-32 bg-gray-300" />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 bg-gray-200" />
            <Skeleton className="h-8 w-full bg-gray-200" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 bg-gray-200" />
            <Skeleton className="h-8 w-full bg-gray-200" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20 bg-gray-200" />
            <Skeleton className="h-8 w-full bg-gray-200" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-12 bg-gray-200" />
            <Skeleton className="h-8 w-full bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <Skeleton className="h-3 w-24 bg-gray-300" />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 bg-gray-200" />
            <Skeleton className="h-8 w-full bg-gray-200" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 bg-gray-200" />
            <Skeleton className="h-8 w-full bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-3">
        <Skeleton className="h-8 w-20 bg-gray-200" />
        <Skeleton className="h-8 w-24 bg-gray-300" />
      </div>
    </div>
  );
}
