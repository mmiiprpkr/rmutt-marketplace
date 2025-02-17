"use client";

import { Input } from "@/components/common/ui/input";
import { ProductFilter } from "@/components/features/market-place/browse-products/filter";
import { ProductCard } from "@/components/features/market-place/browse-products/product-card";
import { ProductCardSkeleton } from "@/components/features/market-place/skeleton/product-card-skeleton";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/common/ui/button";
import { parseAsString, useQueryStates, parseAsInteger } from "nuqs";
import { useDebounceValue } from "usehooks-ts";
import { Search } from "lucide-react";
import { MobileFilter } from "@/components/features/market-place/browse-products/mobile-filter";
import { useEffect, useState } from "react";
import { useUserId } from "@/hooks/use-user-id";
import { Id } from "../../../../../convex/_generated/dataModel";

interface BrowsMyProductProps {
   userAccountId?: Id<"users">;
}

export const BrowsMyProduct = ({ userAccountId }: BrowsMyProductProps) => {
   const currentUserId = useUserId();
   const userId = userAccountId || currentUserId;

   const [filter, setFilter] = useQueryStates({
      name: parseAsString,
      type: parseAsString,
      maxPrice: parseAsInteger,
      minPrice: parseAsInteger,
      category: parseAsString,
   });

   const [debounceFilter] = useDebounceValue(filter, 1000);
   const [isSticky, setIsSticky] = useState(false);

   const { type, maxPrice, minPrice, category, name } = debounceFilter;

   const { results, status, loadMore } = usePaginatedQuery(
      api.products.myProduct,
      {
         type: (type as "food" | "goods") || undefined,
         maxPrice: maxPrice || undefined,
         minPrice: minPrice || undefined,
         category: category || undefined,
         userId: userId!,
      },
      {
         initialNumItems: 25,
      },
   );

   const filterResult = results?.filter((product) => {
      if (name && !product.name.toLowerCase().includes(name.toLowerCase())) {
         return false;
      }
      return true;
   });

   useEffect(() => {
      const handleScroll = () => {
         setIsSticky(window.scrollY > 60);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div className="min-h-screen max-w-7xl w-full mx-auto">
         {/* Sticky Search Input and Filter */}
         <div
            className="sticky z-10 bg-background p-4 transition-all duration-300
               top-[60px]"
         >
            <div className="max-w-xl mx-auto w-full flex items-center space-x-4">
               <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                     type="text"
                     value={filter.name || ""}
                     onChange={(e) => {
                        setFilter({
                           ...filter,
                           name: e.target.value || null,
                        });
                     }}
                     placeholder="Search products..."
                     className="w-full pl-10"
                  />
               </div>
               <div className="md:hidden">
                  <MobileFilter />
               </div>
            </div>
         </div>

         {/* Main Content Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
            {/* Products Grid */}
            <div className="md:col-span-3">
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Loading State */}
                  {status === "LoadingFirstPage" &&
                     Array(12)
                        .fill(0)
                        .map((_, i) => <ProductCardSkeleton key={i} />)}

                  {/* Products */}
                  {status !== "LoadingFirstPage" &&
                     filterResult?.map((product) => (
                        <ProductCard product={product} key={product._id} />
                     ))}
               </div>

               {/* Loading More State */}
               {status === "LoadingMore" && (
                  <div className="flex justify-center py-6">
                     <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
                  </div>
               )}

               {/* Load More Button */}
               {status === "CanLoadMore" && (
                  <div className="flex justify-center py-6">
                     <Button
                        variant="outline"
                        onClick={() => loadMore(10)}
                        className="rounded-full"
                     >
                        Load More Products
                     </Button>
                  </div>
               )}

               {/* No More Products */}
               {status === "Exhausted" && (
                  <div className="flex justify-center py-6">
                     <p className="text-muted-foreground">No more products</p>
                  </div>
               )}
            </div>

            {/* Filter - Desktop */}
            <div className="hidden md:block">
               <div className="sticky" style={{ top: "calc(60px + 72px)" }}>
                  <ProductFilter />
               </div>
            </div>
         </div>
      </div>
   );
};
