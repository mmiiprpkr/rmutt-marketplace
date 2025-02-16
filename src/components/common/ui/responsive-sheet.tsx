import { useMediaQuery } from "usehooks-ts";

import { Sheet, SheetContent } from "./sheet";

import { Drawer, DrawerContent } from "@/components/common/ui/drawer";

interface ResponsiveModalProps {
   children: React.ReactNode;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const ResponsiveSheet = ({
   children,
   open,
   onOpenChange,
}: ResponsiveModalProps) => {
   const isSmallScreen = useMediaQuery("(max-width: 780px)");
   if (isSmallScreen) {
      return (
         <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>{children}</DrawerContent>
         </Drawer>
      );
   } else {
      return (
         <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-0 min-w-[500px] dark:bg-primary-foreground">{children}</SheetContent>
         </Sheet>
      );
   }
};
