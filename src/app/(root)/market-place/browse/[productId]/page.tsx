"use client";

import { useGetProductById } from "@/api/market-place/product/use-get-product-by-id";
import { useProductId } from "@/hooks/use-product-id";
import { notFound } from "next/navigation";
import { useRecommendProduct } from "@/api/market-place/product/use-recommend-product";
import { ProductCard } from "@/components/features/market-place/browse-products/product-card";
import { ProductCardSkeleton } from "@/components/features/market-place/skeleton/product-card-skeleton";
import { ProductDetailSkeleton } from "@/components/features/market-place/skeleton/product-detail-skeleton";
import { ProductDetail } from "@/components/features/market-place/product/product-detail";

const ProductIdPage = () => {
   const productId = useProductId();

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
            <ProductDetail productDetail={productDetail} />
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
