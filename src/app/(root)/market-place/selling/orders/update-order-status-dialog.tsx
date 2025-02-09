import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/common/ui/select";

import { Id } from "../../../../../../convex/_generated/dataModel";
import { useConversations } from "@/api/messages/create-conversations";
import { Button } from "@/components/common/ui/button";
import { ResponsiveModal } from "@/components/common/ui/responsive-modal";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

interface UpdateOrderStatusDialogProps {
   open: boolean;
   onClose: (open: boolean) => void;
   orderId: Id<"orders">;
   userId1: Id<"users">;
   userId2: Id<"users">;
   status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
}

const statusOptions = [
   "pending",
   "accepted",
   "rejected",
   "completed",
   "cancelled",
];

export const UpdateOrderStatusDialog = ({
   open,
   onClose,
   orderId,
   userId1,
   userId2,
   status,
}: UpdateOrderStatusDialogProps) => {
   const {
      data,
      isPending,
      mutateAsync: conversationMutate,
   } = useConversations();

   const handleUpdateOrderStatus = async () => {
      const conversation = await conversationMutate({
         userId1: userId1,
         userId2: userId2,
      });

      console.log({ conversation });
   };

   return (
      <ResponsiveModal onOpenChange={onClose} open={open}>
         <form className="flex flex-col gap-y-3 min-h-[200px] p-4">
            <h2 className="text-lg font-semibold">Update Order Status</h2>
            <Select value={status}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Order Status" />
               </SelectTrigger>
               <SelectContent>
                  {statusOptions.map((st) => {
                     return (
                        <SelectItem key={st} value={st}>
                           {st}
                        </SelectItem>
                     );
                  })}
               </SelectContent>
            </Select>

            <TextareaAutosize
               minRows={3} // จำนวนแถวขั้นต่ำ
               maxRows={10} // จำนวนแถวสูงสุด
               placeholder="Message"
               style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
               }}
               className={cn(
                  "resize-none outline-none border border-input rounded-md",
                  false && "border-destructive focus:outline-destructive",
               )}
            />

            <div className="flex flex-col-reverse md:flex-row gap-2 md:justify-end">
               <Button
                  variant="outline"
                  onClick={() => onClose(false)}
                  type="button"
               >
                  Cancel
               </Button>
               <Button onClick={handleUpdateOrderStatus}>Update</Button>
            </div>
         </form>
      </ResponsiveModal>
   );
};
