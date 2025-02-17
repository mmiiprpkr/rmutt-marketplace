import type { Doc } from "../../../../convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/common/ui/badge"
import { Card } from "@/components/common/ui/card"
import { OrderStatusBadge } from "../market-place/orders/order-status-badge"

type Message = Doc<"messages"> & {
  sender: Doc<"users"> | undefined | null
  product: Doc<"products"> | undefined | null
  order: Doc<"orders"> | undefined | null
}

interface MessageCardProps {
  isCurrentUser: boolean
  message: Message | undefined
}

export const MessageCard = ({ isCurrentUser, message }: MessageCardProps) => {
  const isMessage = message?.content
  const isProduct = message?.product
  const isOrder = message?.order
  const isImage = message?.image

  return (
    <div className={cn("flex gap-2 w-fit max-w-full", isCurrentUser ? "ml-auto" : "mr-auto")}>
      {!isCurrentUser && message?.sender?.image && (
        <Image
          src={message.sender.image || "/placeholder.svg"}
          alt={message.sender.name || "User"}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}

      <div className="space-y-2">
        {/* Text Message */}
        {isMessage && (
          <div
            className={cn(
              "rounded-lg px-4 py-2 w-fit max-w-full shadow-sm",
              isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            <p className="break-words">{message.content}</p>
          </div>
        )}

        {/* Image Message */}
        {isImage && (
          <div className="relative w-[200px] md:w-[300px] aspect-video rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            <Image src={isImage || "/placeholder.svg"} alt="Message attachment" fill className="object-cover" />
          </div>
        )}

        {/* Product Message */}
        {isProduct && (
          <Card className="w-[250px] md:w-[300px] flex-shrink-0 overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="relative aspect-video">
              <Image src={isProduct.image || "/placeholder.svg"} alt={isProduct.name} fill className="object-cover" />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold truncate">{isProduct.name}</h3>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {isProduct.category}
                </Badge>
                <p className="font-semibold text-primary">{formatPrice(isProduct.price)}</p>
              </div>
              <Badge
                variant={isProduct.status === "available" ? "default" : "destructive"}
                className="w-full justify-center text-xs"
              >
                {isProduct.status}
              </Badge>
            </div>
          </Card>
        )}

        {/* Order Message */}
        {isOrder && (
          <Card className="w-[250px] md:w-[300px] flex-shrink-0 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Order #{isOrder._id.slice(0, 8)}</p>
                <OrderStatusBadge status={isOrder.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">{isOrder.quantity} items</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium text-primary">{formatPrice(isOrder.totalPrice)}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

