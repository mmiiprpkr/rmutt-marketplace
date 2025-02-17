"use client";

import { useCreateProduct } from "@/api/market-place/product/use-create-product";
import { useUpdateProduct } from "@/api/market-place/product/use-update-product";
import { ProductForm } from "@/components/features/market-place/product/product-form";
import { ProductValidationSchema } from "@/validations/product-validation";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Id } from "../../../../../../../../convex/_generated/dataModel";
import { useGetProductById } from "@/api/market-place/product/use-get-product-by-id";

const CreateProductPage = () => {
   const router = useRouter();
   const { productId } = useParams();
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

         toast.success("Product update successfully");
         router.back();
      } catch (error: any) {
         if (error?.message?.includes("pending or accepted orders")) {
            toast.error("Cannot update product with active orders");
         } else {
            toast.error("Failed to update product");
         }
      }
   };
   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold mb-4">Create Product</h1>
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
      </div>
   );
};

export default CreateProductPage;
