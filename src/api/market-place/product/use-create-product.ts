import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useCreateProduct = () => {
   const createProduct = useMutation({
      mutationFn: useConvexMutation(api.products.create),
   });

   return createProduct;
};
