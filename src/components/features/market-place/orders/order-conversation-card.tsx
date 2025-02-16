import { useQueryState } from "nuqs";
import { Doc } from "../../../../../convex/_generated/dataModel";
import Image from "next/image";
import { Separator } from "@/components/common/ui/separator";
import { Calendar, CreditCard, PackageIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/common/ui/button";
import { OrderStatusBadge } from "./order-status-badge";
import { UpdateOrderStatusDialog } from "@/app/(root)/market-place/selling/orders/update-order-status-dialog";

type OrderConversationCardProps = Doc<"orders"> & {
   product: Doc<"products"> | null;
};

export const OrderConversationCard = ({
   order,
}: {
   order: OrderConversationCardProps;
}) => {
   const [updateStatusOpen, setUpdateStatusOpen] = useQueryState(`updateStatus-${order._id}`);

   return (
      <>
         <UpdateOrderStatusDialog
            open={!!updateStatusOpen}
            onClose={() => setUpdateStatusOpen(null)}
            orderId={order._id}
            status={order.status}
            userId1={order.sellerId}
            userId2={order.buyerId}
            productId={order.productId}
         />
         <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-6 space-y-4">
               <h3 className="text-lg font-semibold truncate text-foreground">
                  {order?.product?.name}
               </h3>
               <div className="relative aspect-video max-h-[100px]">
                  <Image
                     src={order?.product?.image ?? ""}
                     fill
                     className="absolute object-cover rounded-lg"
                     alt="Product"
                  />
               </div>
               <Separator />

               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <div className="flex items-center space-x-2">
                        <PackageIcon className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                           Order: {order._id.slice(0, 8)}...
                        </p>
                     </div>
                     <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                           Created{" "}
                           {formatDistance(order._creationTime, new Date(), {
                              addSuffix: true,
                           })}
                        </p>
                     </div>
                  </div>
                  <OrderStatusBadge status={order.status} />
               </div>

               <Separator />

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-sm font-medium text-muted-foreground">
                        Quantity
                     </p>
                     <p className="text-lg font-semibold text-foreground">
                        {order.quantity} items
                     </p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-sm font-medium text-muted-foreground">
                        Total Price
                     </p>
                     <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <p className="text-lg font-semibold text-primary">
                           {formatPrice(order.totalPrice)}
                        </p>
                     </div>
                  </div>
               </div>

               <Separator />

               <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground">
                        Seller
                     </span>
                     <span className="text-sm font-mono bg-muted text-muted-foreground px-2 py-1 rounded">
                        {order.sellerId.slice(0, 12)}...
                     </span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground">
                        Buyer
                     </span>
                     <span className="text-sm font-mono bg-muted text-muted-foreground px-2 py-1 rounded">
                        {order.buyerId.slice(0, 12)}...
                     </span>
                  </div>
               </div>

               <Separator />

               <div className="space-y-2">
                  <Button
                     variant={
                        order.status === "pending" ? "outline" : "secondary"
                     }
                     className="w-full"
                     onClick={() => setUpdateStatusOpen("open")}
                  >
                     {order.status === "pending"
                        ? "Accept Order"
                        : "Update Status"}
                  </Button>
               </div>
            </div>
         </div>
      </>
   );
};
