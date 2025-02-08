import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useUpdateProduct = () => {
   const updateProduct = useMutation({
      mutationFn: useConvexMutation(api.products.update),
   });

   return updateProduct;
};
