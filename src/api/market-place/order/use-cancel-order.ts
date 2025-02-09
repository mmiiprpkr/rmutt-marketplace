import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useCancelOrder = () => {
   const cancelOrder = useMutation({
      mutationFn: useConvexMutation(api.order.cancel),
   });

   return cancelOrder;
};
