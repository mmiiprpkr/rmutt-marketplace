import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export type getMessageArgs = {
   conversationId: Id<"conversations">;
}

export const useGetMessage = ({
   conversationId,
}: getMessageArgs) => {
   const getCurrentUser = useQuery(
      convexQuery(api.messages.getMessage, {
         conversationId: conversationId,
      })
   );

   return getCurrentUser;
};
