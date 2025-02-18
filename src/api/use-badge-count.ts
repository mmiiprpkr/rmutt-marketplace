import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";

export const useBadgeCount = () => {
   const badgeCountQuery = useQuery(convexQuery(api.user.badgeCount, {}));

   return badgeCountQuery;
};
