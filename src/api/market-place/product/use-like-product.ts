import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useLikeProduct = () => {
   const likeProduct = useMutation({
      mutationFn: useConvexMutation(api.products.like),
   });

   return likeProduct;
};
