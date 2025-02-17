import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

export const useUserId = (): Id<"users"> | undefined => {
   const user = useParams();

   if (user === undefined) {
      return undefined;
   }

   return user?.userId as Id<"users">;
};
