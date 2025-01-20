import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useFetchConversations = () => {
   const getCurrentUser = useQuery(
      convexQuery(api.messages.getConversations, {})
   );

   return getCurrentUser;
};
