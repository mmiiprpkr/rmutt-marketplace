"use client"

import { Button } from "@/components/common/ui/button"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { CreateProductButton } from "./create-product-button"
import { useGetProducts } from "@/api/market-place/product/use-get-product"

const ProductManagementPage = () => {
   const { data: productData, isLoading: productLoading } = useGetProducts({
      limit: 10,
      page: 1,
   });

   return (
      <div className="container mx-auto p-4">
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
   )
}

export default ProductManagementPage
