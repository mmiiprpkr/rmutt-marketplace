import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useGetSavePost = () => {
   const getSavePost = useQuery(
      convexQuery(api.post.getSavedPosts, {})
   );

   return getSavePost;
};
