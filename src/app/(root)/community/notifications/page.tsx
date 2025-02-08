"use client";

import { useGetCurrentUser } from "@/api/get-current-user";
import { UserButton } from "@/components/common/user-button";
import { NotificationSkeleton } from "@/components/features/community/skeleton/notification-skeletio";
import dayjs from "dayjs";

const NotificationPage = () => {
   const { data, isLoading } = useGetCurrentUser();

   return (
      <div className="max-w-7xl mx-auto px-4">
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 py-4 min-h-screen">
            <div className="w-full col-span-2 space-y-4 border-r">
               {isLoading ? (
                  Array.from({ length: 10 }).map((_, index) => {
                     return <NotificationSkeleton key={index} />;
                  })
               ) : (
                  <div className="flex items-start flex-col border-b py-2">
                     <div className="flex items-center gap-x-2">
                        <UserButton
                           imageUrl={data?.image ?? ""}
                           type="settings"
                           key={data?._id}
                        />
                        <span className="text-lg font-semibold">
                           {data?.email}
                        </span>
                     </div>
                     <div className="flex flex-col gap-0.5 pl-12">
                        <div>CreatePosts</div>

                        <span>
                           {dayjs(data?._creationTime).format(
                              "DD MMM YYYY HH:mm",
                           )}
                        </span>
                     </div>
                  </div>
               )}
            </div>

            <div className="lg:block hidden">
               <div className="sticky top-[65px] max-h-[700px] bg-background p-4 rounded-lg border">
                  Stats
               </div>
            </div>
         </div>
      </div>
   );
};

export default NotificationPage;
