import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useUpdateProductStatus = () => {
   const updateStatus = useMutation({
      mutationFn: useConvexMutation(api.products.updateStatus),
   });

   return updateStatus;
};
