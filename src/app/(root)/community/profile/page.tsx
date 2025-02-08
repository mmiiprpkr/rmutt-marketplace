/* eslint-disable @next/next/no-img-element */
"use client";

import { useGetCurrentUser } from "@/api/get-current-user";
import dayjs from "dayjs";

import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/common/ui/tabs";
import { ProfileSkeleton } from "@/components/features/community/skeleton/profile-skeleton";

const ProfilePage = () => {
   const { data, isLoading, isError } = useGetCurrentUser();

   if (isError) {
      return <div>Error</div>;
   }

   return (
      <div className="max-w-7xl mx-auto p-4 flex flex-col items-center justify-center space-y-6">
         {isLoading ? (
            <ProfileSkeleton />
         ) : (
            <>
               <h3 className="text-lg font-semibold">Profile</h3>

               <div className="mt-4 flex flex-col items-center">
                  <img
                     src={
                        "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Aidan"
                     }
                     className="size-20 rounded-lg"
                     alt="avatar"
                  />

                  <h3 className="text-lg font-semibold mt-4">
                     Email: {data?.email}
                  </h3>

                  <h3 className="text-base font-semibold">
                     Joined when:{" "}
                     {dayjs(data?._creationTime).format("DD MMM YYYY HH:mm")}
                  </h3>
               </div>
            </>
         )}

         <Tabs defaultValue="posts" className="w-full">
            <TabsList>
               <TabsTrigger value="posts">Posts</TabsTrigger>
               <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
               Make changes to your posts here.
            </TabsContent>
            <TabsContent value="marketplace">Your Products.</TabsContent>
         </Tabs>
      </div>
   );
};

export default ProfilePage;
