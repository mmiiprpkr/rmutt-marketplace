import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useSavePost = () => {
   const savePost = useMutation({
      mutationFn: useConvexMutation(api.post.savePost),
   });

   return savePost;
};
