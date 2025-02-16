import { Doc } from "../../../../../convex/_generated/dataModel";
import { useQueryState } from "nuqs";
import { ResponsiveSheet } from "@/components/common/ui/responsive-sheet";
import { Badge } from "@/components/common/ui/badge";
import { UpdateOrderStatusDialog } from "../../market-place/selling/orders/update-order-status-dialog";
import { OrderConversationCard } from "@/components/features/market-place/orders/order-conversation-card";

type OrderWithProduct = Doc<"orders"> & {
   product: Doc<"products"> | null;
};

interface ConversationOrderProductDialogProps {
   order: OrderWithProduct[] | undefined;
}

export const ConversationOrderProductDialog = ({
   order,
}: ConversationOrderProductDialogProps) => {
   const [isOpen, setIsOpen] = useQueryState("order");

   if (!Array.isArray(order)) return null;

   return (
      <ResponsiveSheet open={!!isOpen} onOpenChange={() => setIsOpen(null)}>
         <div className="p-6 space-y-6 h-[70vh] md:h-full overflow-y-auto bg-background">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-semibold">Order Details</h2>
               <Badge className="bg-gray-100 text-gray-600 border-0">
                  {order.length} items
               </Badge>
            </div>

            <div className="space-y-4">
               {order.map((od, index) => (
                  <OrderConversationCard key={index} order={od} />
               ))}
            </div>
         </div>
      </ResponsiveSheet>
   );
};

export default ConversationOrderProductDialog;
