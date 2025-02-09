"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { formatPrice } from "@/lib/utils";

import { useConfirm as Confirm } from "@/hooks/use-confirm";
import { useCancelOrder as CancelOrder } from "@/api/market-place/order/use-cancel-order";
import { toast } from "sonner";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { UpdateOrderStatusDialog } from "./update-order-status-dialog";
import { useState as State } from "react";

export type Order = Doc<"orders"> & {
   seller: Doc<"users"> | null;
   product: Doc<"products"> | null;
   buyer: Doc<"users"> | null;
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
         return (
            <Link
               href={`/market-place/selling/products/${row.original?.product?._id}`}
               className="hidden md:flex"
            >
               {row.original?.product?.name}
            </Link>
         );
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
         return row.original.status;
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
      header: "Buyer",
      cell: ({ row }) => {
         return (
            <UserButton
               imageUrl={row.original?.buyer?.image || ""}
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
         const [open, setOpen] = State(false);

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
         };

         return (
            <>
               <ConfirmCancel />
               <UpdateOrderStatusDialog
                  open={open}
                  onClose={(open: boolean) => setOpen(open)}
                  orderId={row.original._id}
                  status={row.original.status}
                  userId1={row.original?.sellerId}
                  userId2={row.original?.buyerId}
               />

               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Ellipsis className="size-6 cursor-pointer hover:opacity-75" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuItem>
                        <Link
                           href={`/market-place/browse/${row.original?.product?._id}`}
                        >
                           Product
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setOpen(true)}>
                        Update Status
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </>
         );
      },
   },
];
