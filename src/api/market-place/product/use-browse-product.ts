import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

interface useBrowseProductProps {
   page: number,
   limit: number,
   name?: string,
   categoryId?: string,
   minPrice?: number,
   maxPrice?: number,
}

export const useBrowseProduct = ({
   page,
   limit,
   name,
   categoryId,
   minPrice,
   maxPrice,
}: useBrowseProductProps) => {
   const getProducts = useQuery(
      convexQuery(api.products.brows, {
         page,
         limit,
         name,
         categoryId,
         minPrice,
         maxPrice,
      }),
   );

   return getProducts;
};
