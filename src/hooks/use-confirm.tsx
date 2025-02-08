import { useState } from "react";

import { Button, type ButtonProps } from "@/components/common/ui/button";
import { ResponsiveModal } from "@/components/common/ui/responsive-modal";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/common/ui/card";

export const useConfirm = (
   title: string,
   message: string,
   variant: ButtonProps["variant"] = "default",
): [() => JSX.Element, () => Promise<unknown>] => {
   const [promise, setPromise] = useState<{
      resolve: (value: boolean) => void;
   } | null>(null);

   const confirm = () => {
      return new Promise((resolve) => {
         setPromise({ resolve });
      });
   };

   const handleClose = () => {
      setPromise(null);
   };

   const handleConfirm = () => {
      promise?.resolve(true);
      handleClose();
   };

   const handleCancel = () => {
      promise?.resolve(false);
      handleClose();
   };

   const ConfirmationDialog = () => {
      return (
         <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
            <Card className="w-full h-full border-none shadow-none">
               <CardContent className="pt-8 px-0 pb-0">
                  <CardHeader className="p-0">
                     <CardTitle>{title}</CardTitle>
                     <CardDescription>{message}</CardDescription>
                  </CardHeader>
                  <div className="w-full flex mt-4 gap-2 flex-col md:flex-row items-center justify-end">
                     <Button
                        variant="default"
                        onClick={handleCancel}
                        className="w-full md:w-32"
                     >
                        Cancel
                     </Button>
                     <Button
                        variant={variant}
                        onClick={handleConfirm}
                        className="w-full md:w-32"
                     >
                        Confirm
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </ResponsiveModal>
      );
   };

   return [ConfirmationDialog, confirm];
};
