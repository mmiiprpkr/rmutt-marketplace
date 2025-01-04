import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useGetMySavePosts = () => {
   const getSavePosts = useQuery(
      convexQuery(api.communities.getMyPosts, {})
   );

   return getSavePosts;
};
