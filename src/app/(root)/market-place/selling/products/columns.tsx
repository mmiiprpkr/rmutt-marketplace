"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc } from "../../../../../../convex/_generated/dataModel"
import Link from "next/link"
import dayjs from "dayjs"

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/common/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { useDeleteProduct } from "@/api/market-place/product/use-delete-product"
import { useProductController } from "@/stores/use-product-controller"
import { useConfirm } from "@/hooks/use-confirm"
import { toast } from "sonner"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = Doc<"products">

export const columns: ColumnDef<Product>[] = [
   {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
         return (
            <img
               src={row.getValue("image")}
               alt={row.getValue("name")}
               className="w-10 h-10 rounded-full"
            />
         )
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
         return dayjs(row.getValue("createdAt")).format("DD MMM YYYY HH:mm")
      },
   },
   {
      header: "Actions",
      cell: ({ row }) => {
         const productId = row.original._id
         const { mutate: deleteProduct, isPending: deleteProductPending } =
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useDeleteProduct()
         // eslint-disable-next-line react-hooks/rules-of-hooks
         const { onOpen } = useProductController()
         const [Confirmation, confirm] = useConfirm(
            "Delete Product",
            "Are you sure you want to delete this product?",
            "destructive",
         )

         const handleDeleteProduct = async () => {
            try {
               const ok = await confirm()

               if (!ok) return

               deleteProduct({ id: productId })

               toast.success("Product deleted successfully")
            } catch (error) {
               toast.error("Failed to delete product")
            }
         }

         return (
            <>
               <Confirmation />

               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Menu className="size-4" />
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
                     <DropdownMenuItem>Update Status</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </>
         )
      },
   },
]
