import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

interface useGetOrderProps {
   types: "seller" | "buyer";
}

export const useGetOrder = ({
   types,
}: useGetOrderProps) => {
   const getOrder = useQuery(
      convexQuery(api.order.get, {
         types,
      }),
   );

   return getOrder;
};
