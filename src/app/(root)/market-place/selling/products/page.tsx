"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { CreateProductButton } from "./create-product-button";
import { useGetProducts } from "@/api/market-place/product/use-get-product";
import { UpdateProductSheet } from "@/components/features/market-place/product/update-product.sheet";
import { CreateProductSheet } from "@/components/features/market-place/product/create-product-sheet";

const ProductManagementPage = () => {
   const { data: productData, isLoading: productLoading } = useGetProducts({
      limit: 10,
      page: 1,
   });

   return (
      <div className="container mx-auto p-4">
         <UpdateProductSheet />
         <CreateProductSheet />
         <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold mb-4">Product Management</h1>
            <CreateProductButton redirectTo="/market-place/selling/products/create" />
         </div>
         {productLoading ? (
            <div className="text-center">
               <p>Loading...</p>
            </div>
         ) : (
            <DataTable columns={columns} data={productData!.products} />
         )}
      </div>
   );
};

export default ProductManagementPage;
