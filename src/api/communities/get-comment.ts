import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type GetCommentArgs = {
   postId: Id<"posts">;
}

export const useGetComments = (args: GetCommentArgs) => {
   const getComments = useQuery(
      convexQuery(api.communities.getComments, {
         postId: args.postId,
      })
   );

   return getComments;
};
