import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const usePostId = (): Id<"posts"> | undefined => {
   const communityId = useParams();

   if (communityId === undefined) {
      return undefined;
   }

   return communityId?.postId as Id<"posts">;
};
