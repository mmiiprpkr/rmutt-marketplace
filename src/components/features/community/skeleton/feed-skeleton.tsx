import { Skeleton } from "@/components/common/ui/skeleton";

export const PostFeedSkeleton = () => {
   return (
      <div className="flex flex-col gap-4 p-4">
         {/* User Info Section */}
         <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col">
               <Skeleton className="h-4 w-32" />
               <Skeleton className="h-3 w-20 mt-1" />
            </div>
         </div>

         {/* Post Content Section */}
         <div className="space-y-4">
            <div>
               <Skeleton className="h-6 w-full" />
               <Skeleton className="h-4 w-full mt-2" />
               <Skeleton className="h-4 w-full mt-2" />
            </div>
            <Skeleton className="relative w-full h-[300px] rounded-lg" />
         </div>

         {/* Interaction Buttons */}
         <div className="my-4">
            <div className="flex justify-between">
               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                     <Skeleton className="w-5 h-5" />
                     <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="flex items-center space-x-2">
                     <Skeleton className="w-5 h-5" />
                     <Skeleton className="h-4 w-10" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
