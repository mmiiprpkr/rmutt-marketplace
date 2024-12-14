"use client";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

const RootPage = () => {
   const {
      data: user,
      isLoading,
      isError
   } = useQuery(
      convexQuery(api.user.currentUser, {})
   );

   return (
      <div>
         {isLoading && <p>Loading...</p>}
         {isError && <p>Error</p>}
         {user && <p>{JSON.stringify(user)}</p>}
         <h1>Hello World</h1>
      </div>
   );
};

export default RootPage;