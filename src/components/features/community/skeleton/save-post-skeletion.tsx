import { Skeleton } from "@/components/common/ui/skeleton";

export const SavePostSkeleton = () => {
   return (
      <div className="space-y-3 p-4 border rounded-lg">
         <div className="space-y-2">
            <div className="flex items-center space-x-2">
               <Skeleton className="h-10 w-10 rounded-full" />
               <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
               </div>
            </div>
         </div>
         <Skeleton className="h-[200px] w-full rounded-md" />
         <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
         </div>
         <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
         </div>
      </div>
   );
};
