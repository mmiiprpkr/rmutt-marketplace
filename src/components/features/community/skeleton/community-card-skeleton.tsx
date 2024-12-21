import { Skeleton } from "@/components/common/ui/skeleton";
import { Card, CardFooter, CardHeader } from "@/components/common/ui/card";

export const CommunityCardSkeleton = () => {
   return (
      <Card className="group flex flex-col overflow-hidden rounded-xl shadow-md">
         <div className="relative w-full pt-[56.25%] overflow-hidden">
            <Skeleton className="absolute inset-0 object-cover" />
         </div>
         <CardHeader className="flex-grow space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
         </CardHeader>
         <CardFooter className="flex justify-between items-center pt-4 border-t">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-20" />
         </CardFooter>
      </Card>
   );
};
