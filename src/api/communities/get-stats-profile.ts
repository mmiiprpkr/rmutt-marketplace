import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export const useGetStatsProfile = () => {
   const getStatsProfile = useQuery(convexQuery(api.user.profileStats, {}));

   return getStatsProfile;
};
