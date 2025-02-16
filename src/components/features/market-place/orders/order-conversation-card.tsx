import { useQueryState } from "nuqs";
import { Doc } from "../../../../../convex/_generated/dataModel";
import Image from "next/image";
import { Separator } from "@/components/common/ui/separator";
import { Calendar, CreditCard, PackageIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/common/ui/button";
import { OrderStatusBadge } from "./order-status-badge";

type OrderConversationCardProps = Doc<"orders"> & {
   product: Doc<"products"> | null;
};

export const OrderConversationCard = ({
   order,
}: {
   order: OrderConversationCardProps;
}) => {
   const [updateStatusOpen, setUpdateStatusOpen] =
      useQueryState("updateStatus");

   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
         <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold truncate">
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
            <Separator className="my-4" />

            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                     <PackageIcon className="w-4 h-4 text-gray-400" />
                     <p className="text-sm font-medium text-gray-600">
                        Order: {order._id.slice(0, 8)}...
                     </p>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Calendar className="w-4 h-4 text-gray-400" />
                     <p className="text-sm text-gray-500">
                        Created{" "}
                        {formatDistance(order._creationTime, new Date(), {
                           addSuffix: true,
                        })}
                     </p>
                  </div>
               </div>
               <OrderStatusBadge status={order.status} />
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Quantity</p>
                  <p className="text-lg font-semibold">
                     {order.quantity} items
                  </p>
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                     Total Price
                  </p>
                  <div className="flex items-center space-x-1">
                     <CreditCard className="w-4 h-4 text-gray-400" />
                     <p className="text-lg font-semibold text-green-600">
                        {formatPrice(order.totalPrice)}
                     </p>
                  </div>
               </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Seller</span>
                  <span className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                     {order.sellerId.slice(0, 12)}...
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Buyer</span>
                  <span className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                     {order.buyerId.slice(0, 12)}...
                  </span>
               </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
               <Button
                  variant={order.status === "pending" ? "outline" : "secondary"}
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
   );
};
