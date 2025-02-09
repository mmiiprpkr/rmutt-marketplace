import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useRecommendProductProps {
   productType: "food" | "goods";
   productId: Id<"products">;
}

export const useRecommendProduct = ({
   productType,
   productId,
}: useRecommendProductProps) => {
   const getProducts = useQuery(
      convexQuery(api.products.recommend, {
         productType,
         productId,
      }),
   );

   return getProducts;
};
