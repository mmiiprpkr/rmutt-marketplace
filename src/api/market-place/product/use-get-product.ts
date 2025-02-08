import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

interface useGetProductsProps {
   page: number;
   limit: number;
}

export const useGetProducts = ({ page, limit }: useGetProductsProps) => {
   const getProducts = useQuery(
      convexQuery(api.products.get, {
         page,
         limit,
      }),
   );

   return getProducts;
};
