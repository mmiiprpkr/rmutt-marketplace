import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useUpdateOrderStatus = () => {
   const updateOrderStatus = useMutation({
      mutationFn: useConvexMutation(api.order.update),
   });

   return updateOrderStatus;
};
