"use client";

import { useFetchConversations } from "@/api/messages/get-conversations";
import { Skeleton } from "@/components/common/ui/skeleton";
import { UserButton } from "@/components/common/user-button";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

export const Sidebar = () => {
   const { data, isLoading } = useFetchConversations();
   const params = useParams();
   const router = useRouter();

   const conversationId = params.conversationId;

   return (
      <div className="bg-background/20 border-r h-full w-64 fixed hidden lg:block">
         {isLoading ? (
            <div className="flex flex-col w-full gap-1 px-1">
               {Array.from({ length: 10 }).map((_, i) => {
                  return <Skeleton key={i} className="w-full h-12 mt-2" />;
               })}
            </div>
         ) : (
            <div className={cn("flex flex-col w-full gap-2")}>
               {data?.map((conversation) => {
                  return (
                     <div
                        key={conversation._id}
                        className={cn(
                           "flex items-center p-2 cursor-pointer hover:opacity-75 relative",
                           conversation._id === conversationId
                              ? "bg-secondary"
                              : "",
                        )}
                        onClick={() => {
                           router.push(`/messages/${conversation._id}`);
                        }}
                     >
                        <UserButton
                           imageUrl={conversation.otherUser?.image || ""}
                           type="profile"
                           key={conversation._id}
                        />

                        <div className="ml-2">
                           <p className="text-sm font-semibold">
                              {conversation.otherUser?.email}
                           </p>
                           <p className="text-xs text-gray-500">Last message</p>
                        </div>

                        {conversation.countOrder > 0 && (
                           <div className="absolute right-2 top-2">
                              <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                                 {conversation.countOrder}
                              </span>
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
};
