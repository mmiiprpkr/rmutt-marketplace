"use client";

import { useSideBarStore } from "@/stores/use-side-bar";
import { Sheet, SheetContent } from "./ui/sheet";
import { SideBar } from "./side-bar";

export const MobileSidebar = () => {
   const {
      isOpen,
      onClose
   } = useSideBarStore((state) => state);

   return (
      <Sheet open={isOpen} onOpenChange={onClose}>
         <SheetContent side="left" className="p-0">
            <SideBar />
         </SheetContent>
      </Sheet>
   );
};
