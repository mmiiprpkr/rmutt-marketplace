import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface useGetMyPostsProps {
   userId?: Id<"users">
}

export const useGetMyPosts = ({
   userId,
}: useGetMyPostsProps) => {
   const getSavePosts = useQuery(convexQuery(api.post.getMyPosts, {
      userId,
   }));

   return getSavePosts;
};
