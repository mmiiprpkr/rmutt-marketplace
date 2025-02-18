"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import dayjs from "dayjs";

import { MorphingDialogImg } from "@/components/features/market-place/product/morphing-dialog-img";
import { UserButton } from "@/components/common/user-button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

import { useConfirm as Confirm } from "@/hooks/use-confirm";
import { useCancelOrder as CancelOrder } from "@/api/market-place/order/use-cancel-order";
import { toast } from "sonner";
import { colorMapper } from "@/lib/mapper/color.mapper";
import { Badge } from "@/components/common/ui/badge";
import { sendNotification } from "@/actions/send-notification";

export type Order = Doc<"orders"> & {
   seller: Doc<"users"> | null;
   product: Doc<"products"> | null;
};

export const columns: ColumnDef<Order>[] = [
   {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
         return (
            <div className="size-20 aspect-video relative">
               <MorphingDialogImg image={row.original?.product?.image || ""} />
            </div>
         );
      },
   },
   {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
         return <div>{row.original?.product?.name}</div>;
      },
   },
   {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
         return formatPrice(row.original.totalPrice);
      },
   },
   {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
         return row.original.quantity;
      },
   },
   {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
         return row.original?.product?.category;
      },
   },
   {
      accessorKey: "productType",
      header: "Type",
      cell: ({ row }) => {
         return row.original?.product?.productType;
      },
   },
   {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
         const status = row.original.status;

         return <Badge variant={status}>{status.toUpperCase()}</Badge>;
      },
   },
   {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
         return dayjs(row.original._creationTime).format("DD MMM YYYY HH:mm");
      },
   },
   {
      header: "Seller",
      cell: ({ row }) => {
         return (
            <UserButton
               imageUrl={row.original?.seller?.image || ""}
               type="profile"
               userId1={row.original?.sellerId}
               userId2={row.original?.buyerId}
            />
         );
      },
   },
   {
      header: "Actions",
      cell: ({ row }) => {
         const { mutateAsync } = CancelOrder();
         const [ConfirmCancel, confirmCancel] = Confirm(
            "Are you sure you want to cancel this order?",
            "Cancel Order",
            "destructive",
         );

         const handleCancelOrder = async () => {
            const ok = await confirmCancel();

            if (!ok) return;

            toast.promise(
               mutateAsync({
                  orderId: row.original._id,
               }),
               {
                  loading: "Cancelling order...",
                  success: "Order cancelled successfully",
                  error: "Failed to cancel order",
               },
            );

            await sendNotification({
               senderId: row.original.buyerId,
               recieverId: row.original.sellerId,
               title: "Order Cancelled",
               message: `Your order has been cancelled by the buyer`,
               link: `/market-place/orders`,
            });
         };

         return (
            <>
               <ConfirmCancel />

               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Ellipsis className="size-6 cursor-pointer hover:opacity-75" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     {row.original.status === "pending" && (
                        <DropdownMenuItem onClick={handleCancelOrder}>
                           Cancel
                        </DropdownMenuItem>
                     )}
                     <DropdownMenuItem>
                        <Link
                           href={`/market-place/browse/${row.original?.product?._id}`}
                        >
                           Product
                        </Link>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </>
         );
      },
   },
];
