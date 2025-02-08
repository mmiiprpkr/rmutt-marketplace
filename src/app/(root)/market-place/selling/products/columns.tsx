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
import { Ellipsis } from "lucide-react";
import { useDeleteProduct as DeleteProduct } from "@/api/market-place/product/use-delete-product";
import { useProductController as ProductController } from "@/stores/use-product-controller";
import { useConfirm as Confirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useUpdateProductStatus as UpdateProductStatus } from "@/api/market-place/product/use-update-status";
import { MorphingDialogImg } from "@/components/features/market-place/product/morphing-dialog-img";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = Doc<"products">;

export const columns: ColumnDef<Product>[] = [
   {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
         return (
            <MorphingDialogImg image={row.original.image} />
            // <img
            //    src={row.getValue("image")}
            //    alt={row.getValue("name")}
            //    className="aspect-video object-cover rounded-md size-20"
            // />
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
         const {
            mutate: updateProductStatus,
            isPending: updateProductStatusPending,
         } = UpdateProductStatus();
         const { mutate: deleteProduct, isPending: deleteProductPending } =
            DeleteProduct();
         const { onOpen } = ProductController();
         const [Confirmation, confirm] = Confirm(
            "Delete Product",
            "Are you sure you want to delete this product?",
            "destructive",
         );
         const [ConfirmationUpdateStatus, confirmUpdateStatus] = Confirm(
            "Update Status",
            `Are you sure you want to update this product's to ${
               row.getValue("status") === "available"
                  ? "unavailable"
                  : "available"
            }`,
            "destructive",
         );

         const handleDeleteProduct = async () => {
            try {
               const ok = await confirm();

               if (!ok) return;

               deleteProduct({ id: productId });

               toast.success("Product deleted successfully");
            } catch (error) {
               toast.error("Failed to delete product");
            }
         };

         const handleUpdateStatus = async () => {
            try {
               const ok = await confirmUpdateStatus();
               if (!ok) return;

               updateProductStatus({
                  id: productId,
                  status:
                     row.getValue("status") === "available"
                        ? "unavailable"
                        : "available",
               });
               toast.success("Product status updated successfully");
            } catch (error) {
               toast.error("Failed to update product status");
            }
         };

         return (
            <>
               <Confirmation />
               <ConfirmationUpdateStatus />

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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                     </Link>
                     <DropdownMenuItem
                        onClick={() => onOpen(productId, "update")}
                        className="hidden md:block"
                     >
                        Edit
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={handleDeleteProduct}
                        disabled={deleteProductPending}
                     >
                        Delete Product
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={handleUpdateStatus}
                        disabled={updateProductStatusPending}
                     >
                        Update Status
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </>
         );
      },
   },
];
