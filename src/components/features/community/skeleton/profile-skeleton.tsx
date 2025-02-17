import { Card, CardContent } from "@/components/common/ui/card";
import { Skeleton } from "@/components/common/ui/skeleton";
import { PostFeedSkeleton } from "./feed-skeleton";

export const ProfileSkeleton = () => {
   return (
      <div className="relative">
         {/* Cover Image Skeleton */}
         <Skeleton className="h-48 w-full rounded-lg" />

         {/* Profile Info Card Skeleton */}
         <Card className="max-w-3xl mx-auto -mt-24 relative z-[4]">
            <CardContent className="p-6">
               <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar Skeleton */}
                  <div className="relative">
                     <Skeleton className="size-32 rounded-xl" />
                  </div>

                  {/* User Info Skeleton */}
                  <div className="flex-1 text-center md:text-left space-y-3">
                     <Skeleton className="h-8 w-48" />
                     <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-2">
                           <Skeleton className="size-4" />
                           <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                           <Skeleton className="size-4" />
                           <Skeleton className="h-5 w-24" />
                        </div>
                     </div>
                  </div>

                  {/* Stats Skeleton */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                     <div className="p-3 rounded-lg bg-muted">
                        <Skeleton className="size-5 mx-auto mb-1" />
                        <Skeleton className="h-8 w-12 mx-auto" />
                        <Skeleton className="h-4 w-16 mx-auto mt-1" />
                     </div>
                     <div className="p-3 rounded-lg bg-muted">
                        <Skeleton className="size-5 mx-auto mb-1" />
                        <Skeleton className="h-8 w-12 mx-auto" />
                        <Skeleton className="h-4 w-16 mx-auto mt-1" />
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 10 }).map((_, index) => {
               return <PostFeedSkeleton key={index} />;
            })}
         </div>
      </div>
   );
};
