"use client";

import { Bell, MenuIcon, MessageSquare, Store } from "lucide-react";

import { useSideBarStore } from "@/stores/use-side-bar";

import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { UserButton } from "./user-button";

export const Navbar = () => {
   const { onOpen } = useSideBarStore((state) => state);

   return (
      <div className="flex justify-between items-center p-4 h-[60px] sticky top-0 z-10 bg-background border-b border-secondary">
         <MenuIcon
            className="size-5 cursor-pointer lg:hidden"
            onClick={onOpen}
         />
         <div className="w-full flex items-center space-x-4 justify-end">
            <ModeToggle />
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
