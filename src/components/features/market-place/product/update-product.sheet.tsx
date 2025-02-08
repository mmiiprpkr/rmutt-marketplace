"use client"

import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
} from "@/components/common/ui/sheet"
import { useProductController } from "@/stores/use-product-controller"
import { ProductForm } from "./product-form"
import { useCreateProduct } from "@/api/market-place/product/use-create-product"
import { ProductValidationSchema } from "@/validations/product-validation"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { useUpdateProduct } from "@/api/market-place/product/use-update-product"
import { useGetProductById } from "@/api/market-place/product/use-get-product-by-id"
import { Id } from "../../../../../convex/_generated/dataModel"

export const UpdateProductSheet = () => {
   const { isOpen, type, onClose, productId } = useProductController()

   const isSheetOpen = isOpen && type === "update" && !!productId
   const handleClose = (open: boolean) => {
      onClose(open)
   }

   const { mutateAsync } = useUpdateProduct()
   const { data: productData, isLoading: productLoading } = useGetProductById({
      id: productId as Id<"products">,
   })

   const handleSubmit = async (data: ProductValidationSchema) => {
      try {
         await mutateAsync({
            category: data.category,
            description: data.description,
            id: productId as Id<"products">,
            image: data.image,
            name: data.name,
            price: data.price,
            productType: data.productType,
            quantity: data.quantity,
         })

         handleClose(false)
         toast.success("Product update successfully")
      } catch (error) {
         toast.error("Something went wrong")
      }
   }

   return (
      <Sheet open={isSheetOpen} onOpenChange={handleClose}>
         <SheetContent>
            <SheetHeader>
               <SheetTitle>Are you absolutely sure?</SheetTitle>
               <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
               </SheetDescription>

               {productLoading ? (
                  <div>
                     <p>Loading...</p>
                  </div>
               ) : (
                  <ProductForm
                     initialValues={{
                        name: productData?.name,
                        description: productData?.description,
                        image: productData?.image,
                        category: productData?.category,
                        price: productData?.price,
                        quantity: productData?.quantity,
                        productType: productData?.productType,
                        status: productData?.status,
                     }}
                     onSubmit={handleSubmit}
                     isUpdate
                  />
               )}
            </SheetHeader>
         </SheetContent>
      </Sheet>
   )
}
