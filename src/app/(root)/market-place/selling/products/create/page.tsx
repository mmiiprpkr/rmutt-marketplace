"use client";

import { useCreateProduct } from "@/api/market-place/product/use-create-product";
import { ProductForm } from "@/components/features/market-place/product/product-form";
import { ProductValidationSchema } from "@/validations/product-validation";
import { toast } from "sonner";

const CreateProductPage = () => {
   const { mutateAsync, isPending } = useCreateProduct();

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
         });

         toast.success("Product created successfully");
      } catch (error) {
         toast.error("Something went wrong");
      }
   };
   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold mb-4">Create Product</h1>
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
      </div>
   );
};

export default CreateProductPage;
