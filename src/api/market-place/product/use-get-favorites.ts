import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useGetFavorites = () => {
   const getProducts = useQuery(
      convexQuery(api.products.getFavorites, {}),
   );

   return getProducts;
};
