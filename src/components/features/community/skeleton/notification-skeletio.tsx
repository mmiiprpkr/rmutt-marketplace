import { Skeleton } from "@/components/common/ui/skeleton";

export const NotificationSkeleton = () => {
   return (
      <div className="flex flex-col gap-2 border-b py-2">
         <div className="flex items-center gap-x-2">
            <Skeleton
               className="size-8 rounded-full"
            />

            <Skeleton
               className="h-8 w-[200px]"
            />
         </div>

         <div className="flex flex-col gap-0.5 pl-12">
            <Skeleton
               className="h-6 w-[100px]"
            />

            <Skeleton
               className="h-4 w-[150px]"
            />
         </div>
      </div>
   );
};