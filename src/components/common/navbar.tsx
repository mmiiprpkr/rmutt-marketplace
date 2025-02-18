"use client";

import { Bell, MenuIcon, MessageSquare, Store } from "lucide-react";

import { useSideBarStore } from "@/stores/use-side-bar";

import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { UserButton } from "./user-button";
import { useGetCurrentUser } from "@/api/get-current-user";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useBadgeCount } from "@/api/use-badge-count";

export const Navbar = () => {
   const { onOpen } = useSideBarStore((state) => state);
   const { data, isLoading } = useGetCurrentUser();
   const { data: badgeCountData } = useBadgeCount();

   return (
      <div className="flex justify-between items-center p-4 h-[60px] sticky top-0 z-10 bg-background border-b border-secondary">
         <MenuIcon
            className="size-5 cursor-pointer lg:hidden"
            onClick={onOpen}
         />
         <div className="w-full flex items-center space-x-4 justify-end">
            <ModeToggle />
            <Button variant="ghost" className="relative">
               <Link href="/community/notifications">
                  <Bell className="w-5 h-5" />
                  {(badgeCountData?.unreadNotifications || 0) > 0 && (
                     <span className="absolute top-0 right-0 rounded-full bg-red-500 text-white text-xs px-1">
                        {badgeCountData?.unreadNotifications}
                     </span>
                  )}
               </Link>
            </Button>
            <Button variant="ghost">
               <Link href="/messages">
                  <MessageSquare className="w-5 h-5" />
               </Link>
            </Button>
            <Button variant="ghost" className="relative">
               <Link href="/market-place/selling/orders">
                  <Store className="w-5 h-5" />
                  {(badgeCountData?.pendingOrders || 0) > 0 && (
                     <span className="absolute top-0 right-0 rounded-full bg-red-500 text-white text-xs px-1">
                        {badgeCountData?.pendingOrders}
                     </span>
                  )}
               </Link>
            </Button>
            {isLoading ? (
               <Skeleton className="size-6" />
            ) : (
               <UserButton imageUrl={data?.image ?? ""} type="settings" />
            )}
         </div>
      </div>
   );
};
