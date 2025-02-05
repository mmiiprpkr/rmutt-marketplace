import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useLikePost = () => {
   const likePost = useMutation({
      mutationFn: useConvexMutation(api.post.likePost),
   });

   return likePost;
};
