import { Skeleton } from "@/components/common/ui/skeleton";

export const ProfileSkeleton = () => {
   return (
      <div className="flex flex-col gap-2 items-center justify-center">
         <Skeleton className="h-12 w-[80px]" />

         <Skeleton
            className="size-20 rounded-lg"
         />

         <Skeleton className="h-8 w-[200px]" />
         <Skeleton className="h-8 w-[150px]" />
      </div>
   );
};