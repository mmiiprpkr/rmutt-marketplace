import { Badge } from "@/components/common/ui/badge";
import { Doc } from "../../../../../convex/_generated/dataModel";

export const OrderStatusBadge = ({ status }: { status: Doc<"orders">["status"] }) => {
   const statusConfig = {
      pending: {
         className: "bg-yellow-100 text-yellow-800 border-yellow-200",
         label: "Pending",
      },
      accepted: {
         className: "bg-blue-100 text-blue-800 border-blue-200",
         label: "Accepted",
      },
      completed: {
         className: "bg-green-100 text-green-800 border-green-200",
         label: "Completed",
      },
      cancelled: {
         className: "bg-red-100 text-red-800 border-red-200",
         label: "Cancelled",
      },
   };

   return (
      <Badge
         className={`${statusConfig[status].className} text-xs font-medium px-3 py-1 rounded-full border`}
      >
         {statusConfig[status].label}
      </Badge>
   );
};
