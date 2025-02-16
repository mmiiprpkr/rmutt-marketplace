import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetOrderByConversationsProps {
   conversationId: Id<"conversations">
}

export const useGetOrderByConversations = ({
   conversationId,
}: useGetOrderByConversationsProps) => {
   const getOrder = useQuery(
      convexQuery(api.order.getOrderByConversation, {
         conversationId,
      }),
   );

   return getOrder;
};
