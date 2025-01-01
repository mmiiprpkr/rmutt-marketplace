import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const useCommunityId = (): Id<"communities"> | undefined => {
   const communityId = useParams();

   if (communityId === undefined) {
      return undefined;
   }

   return communityId?.communityId as Id<"communities">;
};
