import { api } from "../../../convex/_generated/api";

import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useCreateCategory = () => {
   const category = useMutation({
      mutationFn: useConvexMutation(api.category.create),
   });

   return category;
};
