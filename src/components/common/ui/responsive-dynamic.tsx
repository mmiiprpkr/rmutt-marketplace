"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

type ResponsiveDialogDrawerType = "drawer" | "dialog";

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
}

export const ResponsiveDynamic = ({
   children,
   trigger,
   open,
   onOpenChange,
   type,
   dialog,
   drawer,
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
