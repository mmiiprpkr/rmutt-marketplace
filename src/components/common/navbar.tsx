"use client";

import { Bell, MenuIcon, MessageSquare, Store } from "lucide-react";
import { Button } from "./ui/button";
import { UserButton } from "./user-button";
import { useSideBarStore } from "@/stores/use-side-bar";

export const Navbar = () => {
   const { onOpen } = useSideBarStore((state) => state);

   return (
      <div className="flex justify-between items-center p-4 h-[60px] sticky top-0 z-10 bg-white border-b border-gray-200">
         <MenuIcon className="size-5 cursor-pointer md:hidden" onClick={onOpen} />
         <div className="w-full flex items-center space-x-4 justify-end">
            <Button variant="ghost">
               <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost">
               <MessageSquare className="w-5 h-5" />
            </Button>
            <Button variant="ghost">
               <Store className="w-5 h-5" />
            </Button>
            <UserButton />
         </div>
      </div>
   );
};
