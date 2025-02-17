import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

interface useGetStatsProps {
   end: string | undefined;
   start: string | undefined;
}

export const useGetStats = ({ end, start }: useGetStatsProps) => {
   const getStats = useQuery(
      convexQuery(api.products.stats, {
         end,
         start,
      }),
   );

   return getStats;
};
