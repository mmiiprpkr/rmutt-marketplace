import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetProductByIdProps {
   id: Id<"products">;
}

export const useGetProductById = ({ id }: useGetProductByIdProps) => {
   const getProducts = useQuery(
      convexQuery(api.products.getById, {
         id,
      }),
   );

   return getProducts;
};
