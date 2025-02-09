import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const useProductId = (): Id<"products"> | undefined => {
   const product = useParams();

   if (product === undefined) {
      return undefined;
   }

   return product?.productId as Id<"products">;
};
