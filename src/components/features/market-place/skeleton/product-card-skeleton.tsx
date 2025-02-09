import { Skeleton } from "@/components/common/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/common/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="w-full max-w-sm overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Skeleton className="w-full h-full" />
          <Skeleton className="absolute top-2 right-2 h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-1" />

        {/* Category and quantity */}
        <Skeleton className="h-4 w-1/2 mb-2" />

        {/* Description */}
        <div className="space-y-2 mb-2 flex-grow">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Price and badge */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <Skeleton className="h-10 flex-1 mr-2" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  )
}