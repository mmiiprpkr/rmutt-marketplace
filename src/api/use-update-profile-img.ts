import { api } from "../../convex/_generated/api";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useUpdateProfileImg = () => {
   const updateProfileImg = useMutation({
      mutationFn: useConvexMutation(api.user.updateProfileImage),
   });

   return updateProfileImg;
};
