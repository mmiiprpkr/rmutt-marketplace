import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useCreateOrder = () => {
   const createProduct = useMutation({
      mutationFn: useConvexMutation(api.order.create),
   });

   return createProduct;
};
