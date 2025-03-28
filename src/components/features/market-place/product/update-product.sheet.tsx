"use client";

import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
} from "@/components/common/ui/sheet";
import { useProductController } from "@/stores/use-product-controller";
import { ProductForm } from "./product-form";
import { useCreateProduct } from "@/api/market-place/product/use-create-product";
import { ProductValidationSchema } from "@/validations/product-validation";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useUpdateProduct } from "@/api/market-place/product/use-update-product";
import { useGetProductById } from "@/api/market-place/product/use-get-product-by-id";
import { Id } from "../../../../../convex/_generated/dataModel";

export const UpdateProductSheet = () => {
   const { isOpen, type, onClose, productId } = useProductController();

   const isSheetOpen = isOpen && type === "update" && !!productId;
   const handleClose = (open: boolean) => {
      onClose(open);
   };

   const { mutateAsync } = useUpdateProduct();
   const { data: productData, isLoading: productLoading } = useGetProductById({
      id: productId as Id<"products">,
   });

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
         });

         handleClose(false);
         toast.success("Product update successfully");
      } catch (error: any) {
         if (error?.message?.includes("pending or accepted orders")) {
            toast.error("Cannot update product with active orders");
         } else {
            toast.error("Failed to update product");
         }
      }
   };

   return (
      <Sheet open={isSheetOpen} onOpenChange={handleClose}>
         <SheetContent>
            <SheetHeader>
               <SheetTitle>Update Product</SheetTitle>
               <SheetDescription>
                  Modify your product details below. All changes will be saved immediately.
               </SheetDescription>

               {productLoading ? (
                  <div>
                     <p>Loading...</p>
                  </div>
               ) : (
                  <ProductForm
                     initialValues={{
                        name: productData?.products?.name,
                        description: productData?.products?.description,
                        image: productData?.products?.image,
                        category: productData?.products?.category,
                        price: productData?.products?.price,
                        quantity: productData?.products?.quantity,
                        productType: productData?.products?.productType,
                        status: productData?.products?.status,
                     }}
                     onSubmit={handleSubmit}
                     isUpdate
                  />
               )}
            </SheetHeader>
         </SheetContent>
      </Sheet>
   );
};
