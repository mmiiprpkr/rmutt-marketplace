"use client";

import Image from "next/image";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import { Heart, Loader, ShoppingCart } from "lucide-react";
import dayjs from "dayjs";
import { useCreateOrder } from "@/api/market-place/order/use-create-order";
import { useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useLikeProduct } from "@/api/market-place/product/use-like-product";
import { UserButton } from "@/components/common/user-button";
import { useGetCurrentUser } from "@/api/get-current-user";
import { sendNotification } from "@/actions/send-notification";

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
   seller?: Doc<"users"> | null;
}

export const ProductDetail = ({
   productDetail,
   isLiked,
   seller,
}: ProductDetailProps) => {
   const { data, isLoading } = useGetCurrentUser();
   const [quantity, setQuantity] = useState(1);
   const { mutateAsync: createOrder, isPending: createOrderPending } =
      useCreateOrder();
   const [Confirmation, confirm] = useConfirm(
      "Are you sure you want to create order?",
      "Create order",
      "outline",
   );

   const { mutateAsync: likeProduct, isPending: likeProductPending } =
      useLikeProduct();
   const handleLikeProduct = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!productDetail?._id) return;

      await likeProduct(
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
                  `Product has been ${isLiked ? "unliked" : "liked"}`,
               );
            },
         },
      );
   };

   const handleCreateOrder = async () => {
      try {
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
                  console.log("Order created");
                  setQuantity(1);
                  toast.success("Order created successfully");
               },
            },
         );

         await sendNotification({
            senderId: data?._id!,
            recieverId: productDetail!.sellerId,
            title: "New Order",
            message: `You have a new order for ${productDetail!.name}`,
            link: `/market-place`,
         });
      } catch (error) {
         toast.error("Failed to create order");
      }
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
                  <Heart
                     className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`}
                  />
               </Button>
            </div>
            <p className="text-sm text-gray-500">
               Category: {productDetail?.category}
            </p>
            <p className="text-sm text-gray-500">
               Created:{" "}
               {dayjs(productDetail?.createdAt).format("DD MMM YYYY HH:mm")}
            </p>
            {seller && (
               <div className="mt-6 p-4 border rounded-lg bg-card">
                  <h2 className="text-lg font-semibold mb-4">
                     Seller Information
                  </h2>
                  <div className="flex items-center gap-4">
                     <UserButton
                        type="profile"
                        userId1={data?._id}
                        userId2={seller?._id}
                        imageUrl={seller?.image || ""}
                     />
                     <div className="flex-1">
                        <p className="font-medium">
                           {seller?.email?.split("@")[0]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                           {seller?.email}
                        </p>
                     </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                     <div className="p-2 rounded-md bg-muted">
                        <p className="text-lg font-semibold">4.8</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                     </div>
                     <div className="p-2 rounded-md bg-muted">
                        <p className="text-lg font-semibold">50+</p>
                        <p className="text-xs text-muted-foreground">
                           Products
                        </p>
                     </div>
                     <div className="p-2 rounded-md bg-muted">
                        <p className="text-lg font-semibold">100+</p>
                        <p className="text-xs text-muted-foreground">Sales</p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};
