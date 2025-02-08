import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useGetCategory = () => {
   const getCategory = useQuery(convexQuery(api.category.get, {}));

   return getCategory;
};
