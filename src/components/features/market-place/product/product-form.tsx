"use client"

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/common/ui/select"
import CreatableSelect from "react-select/creatable";

import { Input } from "@/components/common/ui/input"
import { cn } from "@/lib/utils"
import {
   productValidationSchema,
   ProductValidationSchema,
} from "@/validations/product-validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Loader, UploadCloudIcon } from "lucide-react"
import { uploadFiles } from "@/lib/uploadthing"
import { toast } from "sonner"
import { useGetCategory } from "@/api/market-place/use-get-category";
import { useCreateCategory } from "@/api/market-place/use-create-category";
import { Button } from "@/components/common/ui/button";

interface ProductFormProps {
   onSubmit: (data: ProductValidationSchema) => void
   initialValues: Partial<ProductValidationSchema>,
   isUpdate?: boolean;
}

export const ProductForm = ({
   onSubmit,
   initialValues,
   isUpdate,
}: ProductFormProps) => {
   const [imageLoading, setImageLoading] = useState(false);
   const form = useForm<ProductValidationSchema>({
      resolver: zodResolver(productValidationSchema),
      defaultValues: initialValues,
   });

   const { data: categoryDate, isLoading: categoryLoading } = useGetCategory();
   const { mutate: createCategory, isPending: createCategoryPending } = useCreateCategory();

   const { image, productType } = form.watch()

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
         "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
      onDrop: async (acceptedFiles) => {
         try {
            setImageLoading(true);
            const file = acceptedFiles[0]
            if (!file) return

            const res = await uploadFiles("imageUploader", {
               files: [file]
            });

            if (res) {
               form.setValue("image", res[0].url);
            }

            toast.success("Image uploaded successfully");
         } catch (error) {
            toast.error("Failed to upload image");
         } finally {
            setImageLoading(false);
         }
      },
   })

   const isSubmitting = form.formState.isSubmitting
   const errors = form.formState.errors

   console.log(errors);

   return (
      <form
         className="flex flex-col gap-4"
         onSubmit={form.handleSubmit(onSubmit)}
      >
         <Controller
            control={form.control}
            name="name"
            render={({ field }) => {
               return (
                  <Input
                     {...field}
                     placeholder="Product Name"
                     disabled={isSubmitting}
                     error={errors?.name?.message}
                  />
               )
            }}
         />
         <Controller
            control={form.control}
            name="description"
            render={({ field }) => {
               return (
                  <TextareaAutosize
                     {...field}
                     minRows={3} // จำนวนแถวขั้นต่ำ
                     maxRows={10} // จำนวนแถวสูงสุด
                     placeholder="Description"
                     style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "16px",
                     }}
                     className={cn(
                        "resize-none outline-none border border-input rounded-md",
                        errors?.description &&
                           "border-destructive focus:outline-destructive",
                     )}
                     disabled={isSubmitting}
                  />
               )
            }}
         />
         <div className="w-full lg:w-[250px]">
            <div
               {...getRootProps()}
               className={cn(
                  "w-full cursor-pointer relative group border-2 border-dashed border-neutral_n4 rounded-lg",
                  "aspect-square flex items-center justify-center", // Changed to aspect-square
                  isDragActive && "border-main bg-main/5",
                  (isSubmitting) &&
                     "cursor-not-allowed opacity-60",
                  errors?.image?.message && "border-destructive",
               )}
            >
               <input {...getInputProps()} />
               {image ? (
                  <Image
                     src={image}
                     alt="Campaign preview"
                     fill
                     className="w-full h-full object-cover rounded-lg"
                  />
               ) : (
                  <div className="flex flex-col items-center gap-4 p-4 text-center">
                     <UploadCloudIcon size={40} className="text-neutral_n2" />
                     <div className="flex flex-col items-center gap-1">
                        <p className="text-neutral_black font-medium">
                           Upload campaign image
                        </p>
                        <p className="text-neutral_n2 text-xs">
                           Recommended size: 350x350 px
                        </p>
                     </div>
                     {imageLoading && (
                        <div className="mt-4">
                           <Loader className="size-4 animate-spin" />
                        </div>
                     )}
                  </div>
               )}
               {!isSubmitting && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <span className="text-white text-sm">
                        Click or drag image to upload
                     </span>
                  </div>
               )}
            </div>
         </div>
         <Controller
            control={form.control}
            name="price"
            render={({ field }) => {
               return (
                  <Input
                     {...field}
                     placeholder="Price"
                     disabled={isSubmitting}
                     error={errors?.price?.message}
                     onChange={(e) => {
                        field.onChange(Number(e.target.value))
                     }}
                     value={field.value || undefined}
                  />
               )
            }}
         />
         {productType === "goods" && (
            <Controller
               key={productType}
               control={form.control}
               name="quantity"
               render={({ field }) => {
                  return (
                     <Input
                        {...field}
                        onChange={(e) => {
                           field.onChange(Number(e.target.value))
                        }}
                        value={field.value || undefined}
                        placeholder="Quantity"
                        disabled={isSubmitting}
                        error={errors?.quantity?.message}
                     />
                  )
               }}
            />
         )}
         <Controller
            control={form.control}
            name="productType"
            render={({ field }) => {
               return (
                  <Select value={field.value} onValueChange={(value) => {
                     field.onChange(value);
                     form.setValue("quantity", undefined);
                  }}>
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="ProductType" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="goods">Goods</SelectItem>
                     </SelectContent>
                  </Select>
               )
            }}
         />
         <Controller
            control={form.control}
            name="category"
            render={({ field }) => {
               const options = categoryDate?.map((category) => ({
                  label: category.name,
                  value: category.name,
               })) || [];

               return (
                  <CreatableSelect
                     isLoading={categoryLoading}
                     options={options}
                     value={field.value ? { label: field.value, value: field.value } : null}
                     onChange={(newValue) => field.onChange(newValue?.value)}
                     isClearable
                     onCreateOption={(inputValue) => {
                        createCategory({ category: inputValue }, {
                           onSuccess: () => {
                              field.onChange(inputValue);
                              toast.success("Category created successfully");
                           },
                           onError: () => {
                              toast.error("Failed to create category");
                           }
                        });
                     }}
                     placeholder="Category"
                     formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                     styles={{
                        control: (baseStyles, state) => ({
                           ...baseStyles,
                           borderColor: errors?.category ? "hsl(var(--destructive))" : state.isFocused ? "hsl(var(--input))" : "hsl(var(--input))",
                           "&:hover": {
                              borderColor: errors?.category ? "hsl(var(--destructive))" : "hsl(var(--input))"
                           }
                        })
                     }}
                     classNames={{
                        control: () => "border rounded-md",
                        placeholder: () => "text-muted-foreground",
                     }}
                  />
               )
            }}
         />

         <Button
            type="submit"
         >
            {isUpdate? "Update" : "Create"}
         </Button>
      </form>
   )
}
