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
      } catch (error) {
         toast.error("Something went wrong");
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
      </div>
   );
};

export default CreateProductPage;
