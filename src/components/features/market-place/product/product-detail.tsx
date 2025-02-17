"use client";

import Image from "next/image";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import { Heart, Loader, ShoppingCart } from "lucide-react";
import dayjs from "dayjs";
import { useCreateOrder } from "@/api/market-place/order/use-create-order";
import { useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useLikeProduct } from "@/api/market-place/product/use-like-product";

interface ProductDetailProps {
   productDetail:
      | {
           _id: Id<"products">;
           _creationTime: number;
           quantity?: number | undefined;
           category: string;
           name: string;
           description: string;
           image: string;
           createdAt: string;
           sellerId: Id<"users">;
           price: number;
           productType: "food" | "goods";
           status: "available" | "unavailable";
        }
      | null
      | undefined;
   isLiked: boolean | undefined;
}

export const ProductDetail = ({ productDetail, isLiked }: ProductDetailProps) => {
   const [quantity, setQuantity] = useState(1);
   const { mutate: createOrder, isPending: createOrderPending } =
      useCreateOrder();
   const [Confirmation, confirm] = useConfirm(
      "Are you sure you want to create order?",
      "Create order",
      "outline",
   );

      const { mutate: likeProduct, isPending: likeProductPending } = useLikeProduct();
      const handleLikeProduct = async (e: React.MouseEvent) => {
         e.preventDefault();
         e.stopPropagation();

         if (!productDetail?._id) return;

         likeProduct(
            {
               productId: productDetail._id,
               action: isLiked ? "unlike" : "like", // Specify the action
            },
            {
               onError: () => {
                  toast.error("Failed to update like status");
               },
               onSuccess: () => {
                  toast.success(
                     `Product has been ${isLiked ? "unliked" : "liked"}`
                  );
               }
            },
         );
      };

   const handleCreateOrder = () => {
      if (!quantity) return toast.error("Quantity is required");

      if (quantity > productDetail!.quantity!) {
         return toast.error("Quantity is greater than available quantity");
      }

      createOrder(
         {
            sellerId: productDetail!.sellerId,
            productId: productDetail!._id,
            quantity: quantity,
            totalPrice: productDetail!.price * quantity,
         },
         {
            onSuccess: () => {
               console.log("Order created")
               setQuantity(1);
               toast.success("Order created successfully");
            },
         },
      );
   };

   const handleConfirm = async () => {
      try {
         const ok = await confirm();

         if (!ok) return;

         handleCreateOrder();
      } catch (error) {
         toast.error("Something went wrong");
      }
   };

   return (
      <div className="grid md:grid-cols-2 gap-8">
         <Confirmation />
         <div className="relative aspect-square">
            <Image
               src={productDetail?.image || "/placeholder.svg"}
               alt={productDetail?.name || "Product"}
               layout="fill"
               objectFit="cover"
               className="rounded-lg"
            />
         </div>
         <div className="space-y-4">
            <h1 className="text-3xl font-bold">{productDetail?.name}</h1>
            <p className="text-xl font-semibold">
               ${productDetail?.price.toFixed(2)}
            </p>
            <div className="flex space-x-2">
               <Badge
                  variant={
                     productDetail?.status === "available"
                        ? "default"
                        : "secondary"
                  }
               >
                  {productDetail?.status}
               </Badge>
               <Badge
                  variant={
                     productDetail?.productType === "food"
                        ? "destructive"
                        : "outline"
                  }
               >
                  {productDetail?.productType}
               </Badge>
            </div>
            <p className="text-gray-600">{productDetail?.description}</p>
            {productDetail?.quantity !== undefined && (
               <p className="text-sm text-gray-500">
                  {productDetail?.quantity} left in stock
               </p>
            )}

            <div className="flex items-center gap-x-3">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity === 1}
               >
                  -
               </Button>
               <p>{quantity}</p>
               <Button
                  variant="default"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity === productDetail?.quantity}
               >
                  +
               </Button>
            </div>

            <div className="flex space-x-4">
               <Button className="flex-1" onClick={handleConfirm}>
                  {createOrderPending ? (
                     <Loader className="size-4 mr-2 animate-spin" />
                  ) : (
                     <ShoppingCart className="size-4 mr-2" />
                  )}
                  Buy
               </Button>
               <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => handleLikeProduct(e)}
                  disabled={likeProductPending}
                  className={`${isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"}`}
               >
                  <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
               </Button>
            </div>
            <p className="text-sm text-gray-500">
               Category: {productDetail?.category}
            </p>
            <p className="text-sm text-gray-500">
               Created:{" "}
               {dayjs(productDetail?.createdAt).format("DD MMM YYYY HH:mm")}
            </p>
         </div>
      </div>
   );
};
