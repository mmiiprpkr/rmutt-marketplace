"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc } from "../../../../../../convex/_generated/dataModel"
import Link from "next/link"
import { Button } from "@/components/common/ui/button"
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
         // eslint-disable-next-line react-hooks/rules-of-hooks
         const { mutate: deleteProduct, isPending: deleteProductPending } = useDeleteProduct();

         return (
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <Menu className="size-4" />
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link
                     href={`/market-place/selling/products/update/${productId}`}
                  >
                     <DropdownMenuItem>Edit</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                     onClick={() => deleteProduct({ id: productId })}
                     disabled={deleteProductPending}
                  >
                     Delete Product
                  </DropdownMenuItem>
                  <DropdownMenuItem>Update Status</DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         )
      },
   },
]
