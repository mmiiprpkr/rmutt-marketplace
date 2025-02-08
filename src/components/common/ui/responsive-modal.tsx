import { useMediaQuery } from "usehooks-ts";

import {
   Dialog,
   DialogContent,
} from "@/components/common/ui/dialog"

import {
   Drawer,
   DrawerContent,
} from "@/components/common/ui/drawer"

interface ResponsiveModalProps {
   children: React.ReactNode;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({
   children,
   open,
   onOpenChange,
}: ResponsiveModalProps) => {
   const isSmallScreen = useMediaQuery("(max-width: 780px)");
   if (isSmallScreen) {
      return (
         <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
               {children}
            </DrawerContent>
         </Drawer>
      )
   } else {
      return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
               {children}
            </DialogContent>
         </Dialog>
      )
   }
}