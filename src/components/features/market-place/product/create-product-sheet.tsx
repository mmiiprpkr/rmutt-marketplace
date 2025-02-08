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

export const CreateProductSheet = () => {
   const { isOpen, type, onClose } = useProductController()

   const isSheetOpen = isOpen && type === "create"
   const handleClose = (open: boolean) => {
      onClose(open)
   }

   const { mutateAsync, isPending } = useCreateProduct()

   const handleSubmit = async (data: ProductValidationSchema) => {
      try {
         await mutateAsync({
            category: data.category,
            description: data.description,
            image: data.image,
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            productType: data.productType,
         })

         onClose(false)
         toast.success("Product created successfully")
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

               <ProductForm
                  initialValues={{
                     name: "",
                     description: "",
                     image: "",
                     category: "",
                     price: undefined,
                     quantity: undefined,
                     productType: "goods",
                     status: "available",
                  }}
                  onSubmit={handleSubmit}
               />
            </SheetHeader>
         </SheetContent>
      </Sheet>
   )
}
