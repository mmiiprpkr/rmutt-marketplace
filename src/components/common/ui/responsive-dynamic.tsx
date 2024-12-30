"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Sheet, SheetContent } from "./sheet";

type ResponsiveDialogDrawerType = "drawer" | "dialog" | "sheet";

interface ResponsiveDynamicProps {
   children: React.ReactNode;
   trigger?: React.ReactNode;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   type?: {
      mobile: ResponsiveDialogDrawerType;
      desktop: ResponsiveDialogDrawerType;
   };
   dialog?: {
      className?: string;
      triggerClassName?: string;
    };
    drawer?: {
      className?: string;
      triggerClassName?: string;
    };
    sheet?: {
      className?: string;
      triggerClassName?: string;
    }
}

export const ResponsiveDynamic = ({
   children,
   trigger,
   open,
   onOpenChange,
   type,
   dialog,
   drawer,
   sheet,
}: ResponsiveDynamicProps) => {
   const isMobile = useIsMobile();

   if (
      (isMobile && type?.mobile === "drawer") ||
      (!isMobile && type?.desktop === "drawer")
   ) {
      return (
         <Drawer
            open={open}
            onOpenChange={onOpenChange}
         >
            {trigger && (
               <DrawerTrigger className={cn(drawer?.triggerClassName)}>
                  {trigger}
               </DrawerTrigger>
            )}
            <DrawerContent
               className={cn(drawer?.className)}>
               {children}
            </DrawerContent>
         </Drawer>
      );
   }

   if (
      (isMobile && type?.mobile === "sheet") ||
      (!isMobile && type?.desktop === "sheet")
   ) {
      return (
         <Sheet
            open={open}
            onOpenChange={onOpenChange}
         >
            {trigger && (
               <DialogTrigger className={cn(dialog?.triggerClassName)}>
                  {trigger}
               </DialogTrigger>
            )}
            <SheetContent className={cn(sheet?.className,)}>
               {children}
            </SheetContent>
         </Sheet>
      );
   }

   return (
      <Dialog
         open={open}
         onOpenChange={onOpenChange}
      >
         {trigger && (
            <DialogTrigger className={cn(dialog?.triggerClassName)}>
               {trigger}
            </DialogTrigger>
         )}
         <DialogContent
            className={cn(dialog?.className)}>
            {children}
         </DialogContent>
      </Dialog>
   );
};
