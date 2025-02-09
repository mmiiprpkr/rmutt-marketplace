import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

export const useGetOrder = () => {
   const getOrder = useQuery(
      convexQuery(api.order.get, {}),
   );

   return getOrder;
};
