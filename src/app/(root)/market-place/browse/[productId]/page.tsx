"use client";

import { useGetProductById } from "@/api/market-place/product/use-get-product-by-id";
import { useProductId } from "@/hooks/use-product-id";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useRecommendProduct } from "@/api/market-place/product/use-recommend-product";
import { ProductCard } from "@/components/features/market-place/browse-products/product-card";
import { ProductCardSkeleton } from "@/components/features/market-place/skeleton/product-card-skeleton";
import { ProductDetailSkeleton } from "@/components/features/market-place/skeleton/product-detail-skeleton";
import dayjs from "dayjs";

interface ProductData {
   _id: Id<"products">;
   _creationTime: number;
   quantity?: number;
   name: string;
   description: string;
   image: string;
   createdAt: string;
   sellerId: Id<"users">;
   price: number;
   category: string;
   productType: "food" | "goods";
   status: "available" | "unavailable";
}

const ProductIdPage = () => {
   const productId = useProductId();
   const [isLiked, setIsLiked] = useState(false);

   if (!productId) {
      notFound();
   }

   const { data: productDetail, error: productDetailError, isLoading: productDetailLoading } = useGetProductById({
      id: productId,
   });

   const { data: recommendProduct, isLoading: recommendProductLoading } =
      useRecommendProduct({
         productType: productDetail?.productType || "food",
         productId: productId,
      });

   if (productDetailError) {
      return <div>Error loading product: {productDetailError.message}</div>;
   }

   return (
      <div className="p-4 min-h-screen max-w-7xl w-full mx-auto space-y-8">

         {productDetailLoading && <ProductDetailSkeleton />}

         {!productDetailLoading && (
            <div className="grid md:grid-cols-2 gap-8">
               <div className="relative aspect-square">
                  <Image
                     src={productDetail?.image || "/placeholder.svg"}
                     alt={productDetail?.name || "Product"}
                     layout="fill"
                     objectFit="cover"
                     className="rounded-lg"
                  />
               </div>
               <div className="space-y-4">
                  <h1 className="text-3xl font-bold">{productDetail?.name}</h1>
                  <p className="text-xl font-semibold">${productDetail?.price.toFixed(2)}</p>
                  <div className="flex space-x-2">
                     <Badge
                        variant={
                           productDetail?.status === "available" ? "default" : "secondary"
                        }
                     >
                        {productDetail?.status}
                     </Badge>
                     <Badge
                        variant={
                           productDetail?.productType === "food" ? "destructive" : "outline"
                        }
                     >
                        {productDetail?.productType}
                     </Badge>
                  </div>
                  <p className="text-gray-600">{productDetail?.description}</p>
                  {productDetail?.quantity !== undefined && (
                     <p className="text-sm text-gray-500">
                        {productDetail?.quantity} left in stock
                     </p>
                  )}
                  <div className="flex space-x-4">
                     <Button className="flex-1">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                     </Button>
                     <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsLiked(!isLiked)}
                        className={`${isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"}`}
                     >
                        <Heart
                           className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`}
                        />
                     </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                     Category: {productDetail?.category}
                  </p>
                  <p className="text-sm text-gray-500">
                     Created: {dayjs(productDetail?.createdAt).format("DD MMM YYYY HH:mm")}
                  </p>
               </div>
            </div>
         )}

         <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {recommendProductLoading && (
                  Array.from({ length: 8 }).map((_,i) => {
                     return (
                        <ProductCardSkeleton key={i} />
                     )
                  })
               )}

               {!recommendProductLoading &&
                  recommendProduct?.map((p) => {
                     return <ProductCard product={p} key={p._id} />;
                  })}
            </div>
         </div>
      </div>
   );
};

export default ProductIdPage;
