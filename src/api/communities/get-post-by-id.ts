import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface useGetPostByIdProps {
   postId: Id<"posts">;
}

export const useGetPostById = ({
   postId,
}: useGetPostByIdProps) => {
   const getPostById = useQuery(convexQuery(api.post.getPostById, {
      postId,
   }));

   return getPostById;
};
