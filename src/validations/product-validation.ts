import { z } from "zod"

export const productValidationSchema = z.object({
   name: z
      .string({
         required_error: "Name is required",
      })
      .min(3, {
         message: "Name must be at least 3 characters",
      })
      .max(255, {
         message: "Name must be at most 255 characters",
      }),
   description: z
      .string({
         required_error: "Description is required",
      })
      .min(1, {
         message: "Description is required",
      })
      .max(255, {
         message: "Description must be at most 255 characters",
      }),
   price: z
      .number({
         required_error: "Price is required",
      })
      .min(1, {
         message: "Price must be at least 1",
      }),
   image: z
      .string({
         required_error: "Image is required",
      })
      .min(1, {
         message: "Image is required",
      }),
   category: z
      .string({
         required_error: "Category is required",
      })
      .min(1, {
         message: "Category is required",
      }),
   productType: z.enum(["food", "goods"]),
   quantity: z.number().optional(),
   status: z.enum(["available", "unavailable"]),
}).refine(
   (data) => {
      if (data.productType === "goods") {
         return data.quantity !== null
      }
      return true
   },
   {
      message: "Quantity is required for food",
      path: ["quantity"],
   }
)

export type ProductValidationSchema = z.infer<typeof productValidationSchema>
