import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useGetFeed = () => {
   const getFeed = useQuery(convexQuery(api.communities.getFeed, {}));

   return getFeed;
};
