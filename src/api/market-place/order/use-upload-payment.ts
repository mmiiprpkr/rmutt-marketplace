import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useUploadPayment = () => {
   const uploadPayment = useMutation({
      mutationFn: useConvexMutation(api.order.updateOrderPayment),
   });

   return uploadPayment;
};
