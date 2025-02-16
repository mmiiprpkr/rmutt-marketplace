import { Doc } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/common/ui/badge";
import { Card } from "@/components/common/ui/card";

type Message = Doc<"messages"> & {
  sender: Doc<"users"> | undefined | null;
  product: Doc<"products"> | undefined | null;
  order: Doc<"orders"> | undefined | null;
}

interface MessageCardProps {
  isCurrentUser: boolean;
  message: Message | undefined;
}

export const MessageCard = ({ isCurrentUser, message }: MessageCardProps) => {
  const isMessage = message?.content;
  const isProduct = message?.product;
  const isOrder = message?.order;
  const isImage = message?.image;

  console.log({ message });

  return (
    <div className={cn(
      "flex gap-2 max-w-[80%]",
      isCurrentUser ? "ml-auto" : "mr-auto"
    )}>
      {!isCurrentUser && message?.sender?.image && (
        <Image
          src={message.sender.image}
          alt={message.sender.name || "User"}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}

      <div className="space-y-2">
        {/* Text Message */}
        {isMessage && (
          <div className={cn(
            "rounded-lg px-4 py-2",
            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <p>{message.content}</p>
          </div>
        )}

        {/* Image Message */}
        {isImage && (
          <div className="relative aspect-video w-[200px] rounded-lg overflow-hidden">
            <Image
              src={isImage}
              alt="Message attachment"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Product Message */}
        {isProduct && (
          <Card className="w-[300px] overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={isProduct.image}
                alt={isProduct.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold truncate">{isProduct.name}</h3>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{isProduct.category}</Badge>
                <p className="font-semibold text-primary">
                  {formatPrice(isProduct.price)}
                </p>
              </div>
              <Badge
                variant={isProduct.status === "available" ? "default" : "destructive"}
                className="w-full justify-center"
              >
                {isProduct.status}
              </Badge>
            </div>
          </Card>
        )}

        {/* Order Message */}
        {isOrder && (
          <Card className="w-[300px]">
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Order #{isOrder._id.slice(0, 8)}
                </p>
                <Badge
                  variant={
                    isOrder.status === "completed" ? "default" :
                    isOrder.status === "pending" ? "secondary" :
                    isOrder.status === "accepted" ? "outline" : "destructive"
                  }
                >
                  {isOrder.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">{isOrder.quantity} items</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium text-primary">
                    {formatPrice(isOrder.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
