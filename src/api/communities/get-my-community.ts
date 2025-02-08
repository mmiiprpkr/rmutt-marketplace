import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useGetMyCommunities = () => {
   const getMyCommunities = useQuery(
      convexQuery(api.communities.getMyCommunities, {}),
   );

   return getMyCommunities;
};
