import { Skeleton } from "@/components/common/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
      <div className="space-y-4">
        {/* Product name */}
        <Skeleton className="h-9 w-3/4" />

        {/* Price */}
        <Skeleton className="h-7 w-24" />

        {/* Badges */}
        <div className="flex space-x-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Stock info */}
        <Skeleton className="h-4 w-32" />

        {/* Buttons */}
        <div className="flex space-x-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>

        {/* Category and date */}
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}