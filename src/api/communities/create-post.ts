import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useCreatePost = () => {
   const createPost = useMutation({
      mutationFn: useConvexMutation(api.communities.createPost)
   });

   return createPost;
};
