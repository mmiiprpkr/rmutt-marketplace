"use client";

import { useBrowseProduct } from "@/api/market-place/product/use-browse-product";
import { Input } from "@/components/common/ui/input";
import { ProductFilter } from "@/components/features/market-place/browse-products/filter";
import { ProductCard } from "@/components/features/market-place/browse-products/product-card";
import { ProductCardSkeleton } from "@/components/features/market-place/skeleton/product-card-skeleton";

const BrowsProductPage = () => {
   const { data, isLoading, error } = useBrowseProduct({
      page: 1,
      limit: 25,
   });

   if (error) {
      throw new Error(error.message);
   }

   return (
      <div className="p-4 min-h-screen max-w-7xl w-full mx-auto space-y-4">
         <div>
            <Input placeholder="search...." />
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-2">
               {isLoading &&
                  [...Array(25)].map((_, i) => {
                     return <ProductCardSkeleton key={i} />;
                  })}
               {!isLoading &&
                  data?.productData?.map((p) => {
                     return <ProductCard product={p} key={p._id} />;
                  })}
            </div>

            <div className="hidden md:block">
               <ProductFilter />
            </div>
         </div>
      </div>
   );
};

export default BrowsProductPage;
