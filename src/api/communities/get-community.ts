import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const useGetCommunity = (communityId: Id<"communities">) => {
   const getCommunity = useQuery(
      convexQuery(api.communities.getCommunity, {
         communityId,
      }),
   );

   return getCommunity;
};
