"use client";

import { useGetFavorites } from "@/api/market-place/product/use-get-favorites";
import { ProductCard } from "@/components/features/market-place/browse-products/product-card";
import { ProductCardSkeleton } from "@/components/features/market-place/skeleton/product-card-skeleton";
import { Heart } from "lucide-react";

const FavoritesPage = () => {
   const { data, isLoading } = useGetFavorites();

   return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
               <Heart className="w-6 h-6 text-red-500" />
               <h1 className="text-2xl font-semibold">Your Favorites</h1>
            </div>

            {/* Content */}
            {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array(8).fill(0).map((_, i) => (
                     <ProductCardSkeleton key={i} />
                  ))}
               </div>
            ) : !data?.length ? (
               <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Heart className="w-12 h-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No favorites yet</h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                     Like some products and they will appear here for easy access.
                  </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.map((product) => {
                     if (!product) return null;

                     return (
                        <ProductCard
                           key={product._id}
                           product={{
                              _id: product._id!,
                              _creationTime: product._creationTime!,
                              category: product.category!,
                              description: product.description!,
                              image: product.image!,
                              name: product.name!,
                              price: product.price!,
                              createdAt: product.createdAt!,
                              isLiked: product.isLiked!,
                              productType: product.productType!,
                              quantity: product.quantity!,
                              sellerId: product.sellerId!,
                              status: product.status!,
                           }}
                        />
                     );
                  })}
               </div>
            )}
         </div>
      </div>
   );
};

export default FavoritesPage;
