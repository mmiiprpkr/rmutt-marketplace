import { api } from "../../convex/_generated/api";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useUpdateFcmToken = () => {
   const updateFCM = useMutation({
      mutationFn: useConvexMutation(api.user.updateFcmToken),
   });

   return updateFCM;
};
