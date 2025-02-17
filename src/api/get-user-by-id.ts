import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export const useGetUserById = (userId: Id<"users">) => {
   const getUserById = useQuery(convexQuery(api.user.getUserById, { userId }));

   return getUserById;
};
