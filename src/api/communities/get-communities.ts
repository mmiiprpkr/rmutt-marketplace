import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useGetCommunities = () => {
   const getCommunities = useQuery(
      convexQuery(api.communities.getCommunities, {}),
   );

   return getCommunities;
};
