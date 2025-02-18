"use client";

import { UserButton } from "@/components/common/user-button";
import { ProfileStats } from "@/components/features/community/profile-stats";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/common/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationSkeleton } from "@/components/features/community/skeleton/notification-skeletio";

const NotificationPage = () => {
   const { results, loadMore, status } = usePaginatedQuery(
      api.notification.get,
      {},
      { initialNumItems: 10 },
   );

   return (
      <div className="max-w-7xl mx-auto px-4">
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 py-4 min-h-screen">
            <div className="w-full col-span-2 space-y-4">
               <div className="sticky top-[60px] backdrop-blur-sm bg-background/80 px-6 py-4 z-10 flex items-center justify-between border-b shadow-sm">
                  <div className="flex items-center gap-2">
                     <Bell className="w-5 h-5" />
                     <h2 className="text-xl font-semibold">Notifications</h2>
                  </div>
               </div>

               <div className="space-y-2 px-6">
                  {status === "LoadingFirstPage" ? (
                     Array.from({ length: 10 }).map((_, index) => (
                        <NotificationSkeleton key={index} />
                     ))
                  ) : results?.length === 0 ? (
                     <div className="text-center py-10 text-muted-foreground">
                        No notifications yet
                     </div>
                  ) : (
                     results?.map((notification) => (
                        <div
                           key={notification._id}
                           className={cn(
                              "flex items-start space-x-4 p-4 rounded-lg transition-colors",
                              notification.isRead
                                 ? "bg-background"
                                 : "bg-muted/50",
                           )}
                        >
                           <UserButton
                              imageUrl={notification.sender?.image ?? ""}
                              type="profile"
                              userId1={notification.sender?._id}
                           />
                           <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                 <div>
                                    <p className="font-medium">
                                       {notification.sender?.name ||
                                          notification.sender?.email?.split(
                                             "@",
                                          )[0]}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                       {notification.body}
                                    </p>
                                 </div>
                                 <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                       notification._creationTime,
                                       {
                                          addSuffix: true,
                                       },
                                    )}
                                 </span>
                              </div>
                           </div>
                        </div>
                     ))
                  )}

                  {status === "CanLoadMore" && (
                     <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => loadMore(10)}
                     >
                        Load More
                     </Button>
                  )}

                  {status === "LoadingMore" && (
                     <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary" />
                     </div>
                  )}

                  {status === "Exhausted" && (
                     <div className="text-center py-4 text-muted-foreground">
                        No more notifications
                     </div>
                  )}
               </div>
            </div>

            <div className="lg:block hidden">
               <div className="sticky top-[65px] max-h-[700px] bg-background p-4 rounded-lg border overflow-y-auto">
                  <ProfileStats />
               </div>
            </div>
         </div>
      </div>
   );
};

export default NotificationPage;
