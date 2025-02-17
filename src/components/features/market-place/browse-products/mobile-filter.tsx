import {
   Drawer,
   DrawerContent,
   DrawerTrigger,
} from "@/components/common/ui/drawer";
import { Filter } from "lucide-react";
import { ProductFilter } from "./filter";

export const MobileFilter = () => {
   return (
      <Drawer>
         <DrawerTrigger asChild>
            <Filter className="size-5" />
         </DrawerTrigger>
         <DrawerContent>
            <ProductFilter />
         </DrawerContent>
      </Drawer>
   );
};
