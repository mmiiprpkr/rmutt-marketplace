"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import Link from "next/link";
import dayjs from "dayjs";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu";
import { Edit, Ellipsis, Trash } from "lucide-react";
import { useDeleteProduct as DeleteProduct } from "@/api/market-place/product/use-delete-product";
import { useProductController as ProductController } from "@/stores/use-product-controller";
import { useConfirm as Confirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useUpdateProductStatus as UpdateProductStatus } from "@/api/market-place/product/use-update-status";
import { MorphingDialogImg } from "@/components/features/market-place/product/morphing-dialog-img";
import { Switch } from "@/components/common/ui/switch";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = Doc<"products">;

export const columns: ColumnDef<Product>[] = [
   {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
         return (
            <div className="size-20 aspect-video relative">
               <MorphingDialogImg image={row.original.image} />
            </div>
         );
      },
   },
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "price",
      header: "Price",
   },
   {
      accessorKey: "quantity",
      header: "Quantity",
   },
   {
      accessorKey: "category",
      header: "Category",
   },
   {
      accessorKey: "productType",
      header: "Type",
   },
   {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
         const status = row.original.status;
         const productId = row.original._id;
         const isChecked = status === "available";

         const {
            mutateAsync: updateProductStatus,
            isPending: updateProductStatusPending,
         } = UpdateProductStatus();

         const [ConfirmationUpdateStatus, confirmUpdateStatus] = Confirm(
            "Update Status",
            `Are you sure you want to update this product's to ${
               isChecked ? "unavailable" : "available"
            }`,
            "destructive",
         );

         const handleUpdateStatus = async () => {
            try {
               const ok = await confirmUpdateStatus();
               if (!ok) return;

               await updateProductStatus({
                  id: productId,
                  status: isChecked ? "unavailable" : "available",
               });
               toast.success("Product status updated successfully");
            } catch (error: any) {
               if (error?.message?.includes("pending or accepted orders")) {
                  toast.error("Cannot update product with active orders");
               } else {
                  toast.error("Failed to update product");
               }
            }
         };

         return (
            <div>
               <ConfirmationUpdateStatus />

               <Switch
                  checked={isChecked}
                  onCheckedChange={(checked: boolean) => {
                     handleUpdateStatus();
                  }}
               />
            </div>
         );
      },
   },
   {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
         return dayjs(row.getValue("createdAt")).format("DD MMM YYYY HH:mm");
      },
   },
   {
      header: "Actions",
      cell: ({ row }) => {
         const productId = row.original._id;
         const { mutateAsync: deleteProduct, isPending: deleteProductPending } =
            DeleteProduct();
         const { onOpen } = ProductController();
         const [Confirmation, confirm] = Confirm(
            "Delete Product",
            "Are you sure you want to delete this product?",
            "destructive",
         );

         const handleDeleteProduct = async () => {
            try {
               const ok = await confirm();

               if (!ok) return;

               await deleteProduct({ id: productId });

               toast.success("Product deleted successfully");
            } catch (error: any) {
               if (error?.message?.includes("pending or accepted orders")) {
                  toast.error("Cannot delete product with active orders");
               } else {
                  toast.error("Failed to delete product");
               }
            }
         };

         return (
            <>
               <Confirmation />

               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Ellipsis className="size-6 cursor-pointer hover:opacity-75" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <Link
                        href={`/market-place/selling/products/update/${productId}`}
                        className="md:hidden"
                     >
                        <DropdownMenuItem>
                           <Edit className="size-4" /> Update
                        </DropdownMenuItem>
                     </Link>
                     <DropdownMenuItem
                        onClick={() => onOpen(productId, "update")}
                        className="hidden md:flex"
                     >
                        <Edit className="size-4" /> Update
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={handleDeleteProduct}
                        disabled={deleteProductPending}
                     >
                        <Trash className="size-4 flex" /> Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </>
         );
      },
   },
];
