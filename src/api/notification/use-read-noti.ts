import { api } from "../../../convex/_generated/api";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useReadNotification = () => {
   const read = useMutation({
      mutationFn: useConvexMutation(api.notification.markAsRead),
   });

   return read;
};
