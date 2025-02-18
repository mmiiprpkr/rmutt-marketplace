import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const useGetConversationById = (
   conversationId: Id<"conversations">,
) => {
   const getConversationById = useQuery(
      convexQuery(api.messages.getConversationById, {
         conversationId: conversationId,
      }),
   );

   return getConversationById;
};
