import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const useGetFeed = (communityId?: Id<"communities">) => {
   const getFeed = useQuery(
      convexQuery(api.post.getFeed, communityId ? { communityId } : {})
   );

   return getFeed;
};
