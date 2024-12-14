import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";

export const useUploadFile = () => {
   const uploadFile = useMutation({
      mutationFn: useConvexMutation(api.upload.generateUploadUrl),
   });

   return uploadFile;
};
