"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/common/ui/card"
import { Badge } from "@/components/common/ui/badge"
import { Button } from "@/components/common/ui/button"
import type { Id } from "../../../../../convex/_generated/dataModel"
import Link from "next/link"

interface ProductData {
  _id: Id<"products">
  _creationTime: number
  quantity?: number
  name: string
  category: string
  description: string
  image: string
  createdAt: string
  sellerId: Id<"users">
  price: number
  productType: "food" | "goods"
  status: "available" | "unavailable"
}

export function ProductCard({ product }: { product: ProductData }) {
  const [isLiked, setIsLiked] = useState(false)

  return (
   <Link href={`/market-place/browse/${product._id}`}>
      <Card className="w-full max-w-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg">
         <CardHeader className="p-0">
         <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
               src={product.image || "/placeholder.svg"}
               alt={product.name}
               layout="fill"
               objectFit="cover"
               className="transition-transform duration-300 hover:scale-105"
            />
            <Badge variant={product.status === "available" ? "default" : "secondary"} className="absolute top-2 right-2">
               {product.status}
            </Badge>
         </div>
         </CardHeader>
         <CardContent className="p-4 flex-grow flex flex-col">
         <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
         <p className="text-sm text-gray-600 mb-2">
            {product.category}
            {product.quantity !== undefined && ` • ${product.quantity} left`}
         </p>
         <p className="text-sm line-clamp-2 mb-2 flex-grow">{product.description}</p>
         <div className="flex justify-between items-center">
            <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            <Badge variant={product.productType === "food" ? "destructive" : "outline"}>{product.productType}</Badge>
         </div>
         </CardContent>
         <CardFooter className="p-4 flex justify-between items-center border-t">
         <Button className="flex-1 mr-2">Buy Now</Button>
         <Button
            variant="outline"
            size="icon"
            onClick={() => setIsLiked(!isLiked)}
            className={`${
               isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"
            } transition-colors duration-300`}
         >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
         </Button>
         </CardFooter>
      </Card>
   </Link>
  )
}
